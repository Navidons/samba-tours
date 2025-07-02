"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Mail, LoaderIcon } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: number
  post_id: number
  author_name: string
  author_email: string | null
  content: string
  created_at: string
}

interface BlogCommentsProps {
  postId: number
}

// Utility function to generate avatar initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Utility function to generate a deterministic color based on the name
const getAvatarColor = (name: string) => {
  const colorPalettes = [
    // Soft pastel colors with darker text
    { background: 'bg-rose-100', text: 'text-rose-800' },
    { background: 'bg-amber-100', text: 'text-amber-800' },
    { background: 'bg-emerald-100', text: 'text-emerald-800' },
    { background: 'bg-sky-100', text: 'text-sky-800' },
    { background: 'bg-purple-100', text: 'text-purple-800' },
    { background: 'bg-teal-100', text: 'text-teal-800' },
    { background: 'bg-indigo-100', text: 'text-indigo-800' },
    { background: 'bg-pink-100', text: 'text-pink-800' },
  ]
  
  // Simple hash function to generate consistent color
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return colorPalettes[Math.abs(hash) % colorPalettes.length]
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadMoreModalOpen, setIsLoadMoreModalOpen] = useState(false)
  const supabase = createClient()

  // Fetch comments for the specific blog post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching comments:', error)
          toast.error('Failed to load comments')
          return
        }

        setComments(data || [])
        // Display only the most recent 3-4 comments
        setDisplayedComments((data || []).slice(0, 4))
      } catch (error) {
        console.error('Unexpected error:', error)
        toast.error('An unexpected error occurred')
      }
    }

    fetchComments()

    // Set up real-time subscription for comments
    const channel = supabase
      .channel(`blog_comments_${postId}`)
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'blog_comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          // Add new comment to the top of the list
          const newComment = payload.new as Comment
          setComments(prevComments => [newComment, ...prevComments])
          
          // Update displayed comments
          setDisplayedComments(prev => {
            const updated = [newComment, ...prev]
            return updated.slice(0, 4)
          })
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!name.trim() || !newComment.trim()) {
      toast.error('Please enter your name and comment')
      return
    }

    if (!postId || postId <= 0) {
      toast.error('Invalid blog post. Please refresh the page and try again.')
      return
    }

    // Prevent multiple submissions
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Prepare comment data
      const commentData = {
        post_id: postId,
        author_name: name.trim(),
        author_email: email.trim() || null,
        content: newComment.trim()
      }

      // Insert comment
      const { data, error } = await supabase
        .from('blog_comments')
        .insert(commentData)
        .select()

      if (error) {
        console.error('Error submitting comment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          commentData: commentData
        })
        
        // Check for specific error types
        if (error.code === 'PGRST116') {
          toast.error('Comments table not accessible. Please try again later.')
        } else if (error.code === '23503') {
          toast.error('Invalid blog post. Please refresh the page and try again.')
        } else {
          toast.error(`Failed to submit comment: ${error.message || 'Database error'}`)
        }
        return
      }

      if (!data || data.length === 0) {
        console.error('No data returned from comment insertion')
        toast.error('Comment submission failed. Please try again.')
        return
      }

      // Update comments count in blog_posts
      const { error: rpcError } = await supabase.rpc('increment_blog_post_comments', { 
        blog_post_id: postId 
      })
      
      if (rpcError) {
        console.warn('Warning: Failed to update comment count:', {
          message: rpcError.message,
          details: rpcError.details,
          hint: rpcError.hint,
          code: rpcError.code
        })
        // Don't fail the comment submission if count update fails
      }

      // Clear form
    setNewComment("")
    setName("")
    setEmail("")

      // Show success toast
      toast.success('Comment submitted successfully!')
    } catch (error) {
      console.error('Unexpected error submitting comment:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      toast.error(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCommentList = (commentList: Comment[]) => (
    <div className="space-y-4 max-w-4xl mx-auto">
      {commentList.map((comment) => {
        const avatarColors = getAvatarColor(comment.author_name)
        return (
          <div 
            key={comment.id} 
            className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <Avatar className={`w-10 h-10 ${avatarColors.background}`}>
              <AvatarFallback className={`${avatarColors.text} text-xs font-bold`}>
                {getInitials(comment.author_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h5 className="font-semibold text-earth-900 text-sm">
                    {comment.author_name}
                  </h5>
                  {comment.author_email && (
                    <div 
                      className="flex items-center space-x-1 text-earth-500 text-xs"
                      title={comment.author_email}
                    >
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[100px]">
                        {comment.author_email}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-earth-500 ml-auto">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-earth-700 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <Card className="mt-8 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-forest-600" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
        <CardContent className="px-4 md:px-6 lg:px-8">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-earth-900 mb-4">Leave a Comment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            <Input
              type="email"
                placeholder="Your Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Share your thoughts, questions, or experiences..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="mb-4"
            required
          />
            <Button 
              type="submit" 
              className="btn-primary w-full md:w-auto" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>

          {/* Recent Comments */}
          {renderCommentList(displayedComments)}

          {/* Load More Button */}
          {comments.length > 4 && (
            <div className="text-center mt-6">
                              <Button
                variant="outline" 
                onClick={() => setIsLoadMoreModalOpen(true)}
              >
                Load More Comments
                              </Button>
                    </div>
                  )}

          {comments.length === 0 && (
            <div className="text-center text-earth-600 py-8">
              No comments yet. Be the first to comment!
            </div>
          )}
      </CardContent>
    </Card>

      {/* Load More Comments Modal */}
      <Dialog 
        open={isLoadMoreModalOpen} 
        onOpenChange={setIsLoadMoreModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Comments ({comments.length})</DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto px-4">
            {renderCommentList(comments)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
