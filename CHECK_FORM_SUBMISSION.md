# Troubleshooting Form Submission Issues

Follow these steps to diagnose and fix the 400 Bad Request error when submitting your form.

## 1. Check Browser Console Logs

First, open your browser's Developer Tools and check the console for error messages:

1. Right-click on the page and select "Inspect" or "Inspect Element"
2. Go to the "Console" tab
3. Submit the form and look for error messages

## 2. Common Causes of 400 Bad Request

### Missing Required Fields

Your Supabase table requires these fields:
- `name` (Text, NOT NULL)
- `description` (Text, NOT NULL)
- `endpoint_url` (Text, NOT NULL)

Ensure these fields have values when submitting.

### Data Type Mismatches

The most common issues are with array fields:
- `tags` should be an array of strings
- `features` should be an array of strings

### Row Level Security (RLS) Issues

The RLS policy might be preventing inserts. Check:
- All insert policies are correct
- The `status` field is set to "pending" during insert

## 3. Test Direct API Access

Test a direct API insert to isolate if the issue is with your form or the database:

1. Run this in your browser console:

```javascript
const { supabase } = window;
supabase
  .from('servers')
  .insert([{
    name: 'Test Server',
    description: 'Testing submission',
    endpoint_url: 'https://example.com',
    tags: ['test', 'debug'],
    features: ['testing'],
    status: 'pending'
  }])
  .select()
  .then(console.log)
  .catch(console.error);
```

## 4. Check Network Tab

1. In Developer Tools, go to the "Network" tab
2. Submit the form
3. Find the POST request to Supabase
4. Check the response details for specific error messages

## 5. Inspect the Transformed Data

I've added logging in the form submission to show:
- The original form data
- The transformed data sent to Supabase

Check that arrays are properly formatted and no required fields are null.

## 6. Common Error Codes

- `23505`: Unique constraint violation (duplicate entry)
- `23502`: Not-null constraint violation (missing required field)
- `42501`: Permission denied (RLS policy issue)
- `400`: Bad Request (general validation error)

## 7. Specific Fixes to Try

### Fix 1: Reset Your Database Table

Run this SQL to recreate your table properly:

```sql
-- Enable the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop and recreate the table
DROP TABLE IF EXISTS servers;
CREATE TABLE servers (
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
CREATE POLICY "Allow public read access to approved servers" 
  ON servers FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow anonymous submissions with pending status" 
  ON servers FOR INSERT WITH CHECK (status = 'pending');
```

### Fix 2: Modify the Form Data Handling

I've updated the form to:
- Properly handle empty optional fields
- Trim all input values
- Convert empty values to null
- Use improved error messages

## 8. If All Else Fails

If you still encounter errors:
1. Try submitting with minimal data (just the required fields)
2. Check for any special characters in your inputs
3. Try disabling Row Level Security temporarily for testing
4. Check Supabase logs for more detailed error messages 