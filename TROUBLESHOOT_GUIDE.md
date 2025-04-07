# Troubleshooting RLS Policy Issues

Row-Level Security (RLS) in Supabase can sometimes cause unexpected behavior. Here's how to troubleshoot and fix common issues.

## Understanding the Error

The error code `42501` with message `new row violates row-level security policy for table "servers"` means:

- You're trying to insert/update data
- The RLS policies are preventing it
- The data you're trying to insert doesn't meet the policy requirements

## Quick Fix (Run in SQL Editor)

```sql
-- Temporarily disable RLS to see if that's the issue
ALTER TABLE servers DISABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for inserts
CREATE POLICY "Allow anonymous submissions" 
ON servers 
FOR INSERT 
WITH CHECK (TRUE);

-- Re-enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
```

## Common RLS Issues and Solutions

### 1. Insert Policy Too Restrictive

**Problem**: The current policy only allows inserts with `status = 'pending'`
**Solution**: Make the insert policy more permissive or ensure your data includes the right status

```sql
CREATE POLICY "Allow anonymous submissions" 
ON servers 
FOR INSERT 
WITH CHECK (TRUE);  -- Allow all inserts
```

### 2. Auth Issues

**Problem**: RLS policies might be checking for authenticated users
**Solution**: Ensure your anonymous key has the right permissions

```sql
-- Check if auth is required in your policies
SELECT * FROM pg_policies WHERE tablename = 'servers';

-- Create a policy that doesn't require auth
CREATE POLICY "Allow anonymous submissions" 
ON servers 
FOR INSERT 
WITH CHECK (TRUE);
```

### 3. Hidden Fields

**Problem**: You might be trying to set fields that the policy restricts
**Solution**: Check what fields your insert includes

```sql
-- Example of a more specific policy that only allows certain fields
CREATE POLICY "Allow anonymous submissions with specific fields" 
ON servers 
FOR INSERT 
WITH CHECK (
  status = 'pending' -- Only allow pending status
);
```

## Testing & Debugging

1. **Check existing policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'servers';
   ```

2. **Test without RLS**:
   ```sql
   -- Temporarily disable RLS
   ALTER TABLE servers DISABLE ROW LEVEL SECURITY;
   
   -- Try your insert
   INSERT INTO servers (...) VALUES (...) RETURNING *;
   
   -- Re-enable RLS
   ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
   ```

3. **Inspect query logs**:
   - In Supabase Dashboard > Settings > Database
   - Look for error details in the logs

## Best Practices for RLS

1. **Start permissive**:
   - Begin with broad policies then restrict as needed
   - `WITH CHECK (TRUE)` allows all inserts
   
2. **Test policies incrementally**:
   - Add restrictions one by one and test after each change
   
3. **Use separate policies for different operations**:
   - One policy for SELECT, another for INSERT, etc.

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) 