-- Add highlights column to tours table if it doesn't exist
DO $$
BEGIN
    -- Check if highlights column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tours' 
        AND column_name = 'highlights'
    ) THEN
        -- Add highlights column as TEXT[]
        ALTER TABLE tours ADD COLUMN highlights TEXT[];
        
        RAISE NOTICE 'Added highlights column to tours table';
    ELSE
        RAISE NOTICE 'highlights column already exists in tours table';
    END IF;
END $$;

-- Grant permissions on the new column
GRANT SELECT, UPDATE, INSERT ON tours TO authenticated;
GRANT SELECT ON tours TO anon;

SELECT 'Highlights column migration completed successfully!' as status; 