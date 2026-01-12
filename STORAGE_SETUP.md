# Supabase Storage Setup for Profile Photos

To enable profile photo uploads, you need to create a storage bucket in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click **New bucket**
4. Name it `avatars`
5. Make it **Public** (or configure RLS policies)
6. Click **Create bucket**

## Optional: Row Level Security (RLS) Policies

If you want to keep the bucket private and use RLS:

1. Go to **Storage** → **Policies**
2. Create a policy for the `avatars` bucket:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public to read avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

For simplicity, making the bucket public is recommended for development.
