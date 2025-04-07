# Supabase Setup Guide for MCP Server Directory

This guide provides instructions for setting up Supabase for the MCP Server Directory application.

## SQL Script

Run the following SQL in the Supabase SQL Editor to set up your database:

```sql
-- Create the servers table
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  logo_url TEXT,
  github_url TEXT,
  contact_email TEXT,
  tags TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Add RLS policies
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to approved servers only
CREATE POLICY "Allow public read access to approved servers" 
ON servers FOR SELECT 
USING (status = 'approved');

-- Allow anonymous insert with pending status
CREATE POLICY "Allow anonymous submissions with pending status" 
ON servers FOR INSERT 
WITH CHECK (status = 'pending');
```

## Manual Steps in Supabase UI

If you prefer using the Supabase UI instead of SQL:

1. Go to **Database** > **Tables** in your Supabase dashboard
2. Click **Create a new table**
3. Set name to `servers`
4. Add these columns:
   - `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
   - `created_at` (Timestamp with timezone, Default: `now()`)
   - `updated_at` (Timestamp with timezone, Default: `now()`)
   - `name` (Text, NOT NULL)
   - `description` (Text, NOT NULL)
   - `endpoint_url` (Text, NOT NULL)
   - `logo_url` (Text, NULL allowed)
   - `github_url` (Text, NULL allowed)
   - `contact_email` (Text, NULL allowed)
   - `tags` (Text array, Default: `'{}'`)
   - `features` (Text array, Default: `'{}'`)
   - `status` (Text, Default: `'pending'`, Check constraint: `status IN ('pending', 'approved', 'rejected')`)
5. Enable Row Level Security (RLS) and add policies as described in the SQL script above

## Checking Your Setup

After setting up the database:

1. Restart your Next.js development server
2. Try submitting a new server through the form
3. Check the Supabase **Table Editor** to see if your submission was recorded

## Troubleshooting

If you're experiencing issues:

1. **Connection problems**: Check that your `.env.local` file contains the correct Supabase URL and anon key
2. **Empty tags/features in submissions**: Make sure the form is correctly transforming comma-separated tags into arrays
3. **Permission errors**: Verify that your RLS policies are set up correctly
4. **Type errors**: Check that the `ServerEntry` type in `src/lib/supabase.ts` matches your database schema

## Administration

To approve submitted servers:

1. Go to the Supabase **Table Editor**
2. Find the server in the `servers` table
3. Change its `status` from `pending` to `approved`
4. The server will now appear in the public listing