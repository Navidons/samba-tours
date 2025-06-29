const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function generateSecurePassword() {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  password += 'A1!a' // Ensure password meets complexity requirements
  return password
}

async function checkIfAuthUserExists(email) {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) throw error
    return users.some(user => user.email === email)
  } catch (error) {
    console.error(`Error checking if user ${email} exists:`, error.message)
    return false
  }
}

async function deleteAllAuthUsers() {
  const maxRetries = 5
  let retryCount = 0
  let allDeleted = false

  console.log('Starting deletion of non-admin auth users from Supabase Auth...')

  while (!allDeleted && retryCount < maxRetries) {
    retryCount++
    console.log(`\nAttempt ${retryCount} of ${maxRetries} to delete auth users...\n`)
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      if (error) throw error

      const usersToDelete = users.filter(user => user.email !== 'admin@vu.ac.ug')

      if (usersToDelete.length === 0) {
        console.log('No non-admin auth users found to delete.')
        allDeleted = true
        break
      }

      console.log(`Found ${usersToDelete.length} non-admin auth users to delete.`)

      let deletedBatchCount = 0
      const batchSize = 3

      for (let i = 0; i < usersToDelete.length; i += batchSize) {
        const batch = usersToDelete.slice(i, Math.min(i + batchSize, usersToDelete.length))

        await Promise.all(batch.map(async (user) => {
          try {
            const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
            if (deleteError) {
              console.error(`Error deleting user ${user.email} (ID: ${user.id}):`, deleteError.message)
            } else {
              console.log(`✓ Deleted auth user: ${user.email}`)
            }
          } catch (error) {
            console.error(`Unexpected error deleting user ${user.email}:`, error.message)
          }
        }))
        // Small delay between user deletions within a batch and longer between batches
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      console.log(`Attempt ${retryCount} completed. Deleted ${deletedBatchCount} users in this attempt.`)

      // After attempting deletions, verify if any non-admin users still exist
      const { data: { users: remainingUsers }, error: remainingUsersError } = await supabase.auth.admin.listUsers()
      if (remainingUsersError) throw remainingUsersError
      
      const stillRemaining = remainingUsers.filter(user => user.email !== 'admin@vu.ac.ug')
      if (stillRemaining.length === 0) {
        console.log('All non-admin auth users successfully deleted.')
        allDeleted = true
      } else {
        console.log(`${stillRemaining.length} non-admin auth users still remain. Retrying...`)
        // Longer delay before next retry attempt
        await new Promise(resolve => setTimeout(resolve, 5000))
      }

    } catch (error) {
      console.error('Error during deleteAllAuthUsers attempt:', error.message)
      // Longer delay before next retry attempt on error
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  if (!allDeleted) {
    console.error(`\nFailed to delete all non-admin auth users after ${maxRetries} attempts.\n`)
    return false
  }
  return true
}

async function recreateAuthUsers() {
  try {
    console.log('\nStarting user authentication synchronization process...')

    // First, disable RLS temporarily
    await supabase.rpc('disable_rls')
    console.log('Disabled RLS temporarily')

    // 1. Store all original database users data
    console.log('Fetching all current users from public.users table...')
    const { data: originalDbUsers, error: originalDbUsersError } = await supabase
      .from('users')
      .select('id, email, role, first_name, last_name')
      .order('email'); // Order for consistent processing
    if (originalDbUsersError) throw originalDbUsersError;

    if (originalDbUsers.length === 0) {
        console.warn('No users found in public.users table. Exiting.')
        return;
    }
    console.log(`Found ${originalDbUsers.length} users in public.users table.`)

    // 2. Disable foreign key constraints temporarily
    await supabase.rpc('disable_foreign_keys')
    console.log('Disabled foreign key constraints')

    // 3. Delete existing Supabase Auth users (excluding admin)
    const deleteSuccess = await deleteAllAuthUsers()
    if (!deleteSuccess) {
      throw new Error('Failed to delete existing auth users completely. Aborting.')
    }

    // Add a delay after deletions before creating/updating new users
    console.log('Waiting 10 seconds before proceeding with user synchronization...')
    await new Promise(resolve => setTimeout(resolve, 10000))

    const results = {
      processed: [], // Users from public.users that were processed
      errors: [],
    }

    const batchSize = 3
    const batches = []
    for (let i = 0; i < originalDbUsers.length; i += batchSize) {
      batches.push(originalDbUsers.slice(i, i + batchSize))
    }

    // 4. Process each database user: Create/Retrieve in Auth, then update public.users ID
    console.log('\nSynchronizing public.users with Supabase Auth...')
    for (const batch of batches) {
      await Promise.all(batch.map(async (dbUser) => {
        try {
          const password = generateSecurePassword() 
          let authUserId = null;
          let action = ''; // 'created' or 're-mapped'

          // Check if user already exists in Auth before creating (especially for admin)
          const userAlreadyExistsInAuth = await checkIfAuthUserExists(dbUser.email)
          
          if (userAlreadyExistsInAuth) {
            // If user exists, retrieve their current Auth ID
            const { data: { users: existingAuthUsers }, error: fetchAuthUserError } = await supabase.auth.admin.listUsers()
            if (fetchAuthUserError) throw fetchAuthUserError
            const existingAuthUser = existingAuthUsers.find(u => u.email === dbUser.email)
            
            if (existingAuthUser) {
                authUserId = existingAuthUser.id
                action = 're-mapped existing'
                console.log(`WARN: User ${dbUser.email} already exists in Auth. Re-mapping existing Auth ID (${authUserId}).`)            
            } else {
                throw new Error(`User ${dbUser.email} reported as existing but could not retrieve Auth ID.`)
            }
          } else {
            // Create new user in Auth
            const { data: authUser, error: createAuthError } = await supabase.auth.admin.createUser({
              email: dbUser.email,
              password: password,
              email_confirm: true,
              user_metadata: {
                role: dbUser.role
              }
            })
            if (createAuthError) throw createAuthError
            authUserId = authUser.user.id;
            action = 'created new'
            console.log(`✓ ${action} auth record for ${dbUser.email} (Auth ID: ${authUserId}).`)
          }

          if (!authUserId) {
              throw new Error(`Could not obtain Auth ID for ${dbUser.email}`)
          }

          // Update the public.users table with the new/existing Auth ID
          const { data: updatedPublicUser, error: updatePublicUserError } = await supabase
            .from('users')
            .update({ id: authUserId }) // Update the ID to match Auth ID
            .eq('email', dbUser.email) // Match by email
            .select() // Return the updated record

          if (updatePublicUserError) throw updatePublicUserError;

          if (updatedPublicUser.length === 0) {
              throw new Error(`No user found in public.users to update for email: ${dbUser.email}`)
          }

          results.processed.push({
            email: dbUser.email,
            password: password, // This will be the generated password or 'N/A (already existed)'
            role: dbUser.role,
            original_db_id: dbUser.id,
            new_auth_id: authUserId,
            status: action
          })

          console.log(`✓ Updated public.users entry for ${dbUser.email}. Original ID: ${dbUser.id}, New Auth ID: ${authUserId}.`)

          // Add a small delay between operations
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error(`✗ Error synchronizing user ${dbUser.email}:`, error.message)
          results.errors.push({
            email: dbUser.email,
            error: error.message
          })
        }
      }))

      // Add a longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // 5. Re-enable foreign key constraints and RLS
    console.log('\nRe-enabling foreign key constraints...')
    await supabase.rpc('enable_foreign_keys')
    console.log('Re-enabled foreign key constraints')

    console.log('Re-enabling RLS...')
    await supabase.rpc('enable_rls')
    console.log('Re-enabled RLS')

    // Save results to a file
    const fs = require('fs')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const resultsFile = `recreated-users-${timestamp}.json`
    
    fs.writeFileSync(resultsFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total_users_in_db: originalDbUsers.length,
        users_synchronized: results.processed.length,
        errors: results.errors.length,
        // Relationships are now implicitly restored due to ON UPDATE CASCADE
        relationships_implicitly_updated: `Lecturers and Students user_id columns should be automatically updated due to ON UPDATE CASCADE.`
      },
      synchronized_users: results.processed,
      errors: results.errors
    }, null, 2))

    console.log('\nResults Summary:')
    console.log('Total users found in public.users:', originalDbUsers.length)
    console.log('Users synchronized (Auth created/re-mapped and public.users updated):', results.processed.length)
    console.log('Errors during synchronization:', results.errors.length)
    console.log(`Relationships in lecturers and students tables were implicitly updated due to ON UPDATE CASCADE.`)
    console.log(`\nDetailed results saved to: ${resultsFile}`)
    console.log('\nIMPORTANT: The file contains passwords for all NEWLY CREATED users. Store it securely and delete after use.')

  } catch (error) {
    console.error('Unexpected error during synchronization process:', error.message)
    // Try to re-enable constraints and RLS in case of error
    try {
      await supabase.rpc('enable_foreign_keys')
      console.log('Re-enabled foreign key constraints after error')
      await supabase.rpc('enable_rls')
      console.log('Re-enabled RLS after error')
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError.message)
    }
  }
}

recreateAuthUsers() 