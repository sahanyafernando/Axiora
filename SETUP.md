# Axiora - Detailed Setup Guide

## 🎯 Quick Start

1. **Install dependencies**: `npm install`
2. **Set up Supabase**: Create project and run schema
3. **Configure environment**: Add `.env.local` file
4. **Run**: `npm run dev`

## 📋 Step-by-Step Setup

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - **Name**: Axiora (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier
4. Wait for project to be created (~2 minutes)

### 2. Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see success messages for tables, indexes, triggers, and policies

### 4. Environment Variables

Create a file named `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_HF_API_KEY=your_huggingface_key_here_optional
```

**Important**: 
- Replace the values with your actual Supabase credentials
- Hugging Face API key is optional (app works without it)
- Never commit `.env.local` to git (it's in `.gitignore`)

### 5. Hugging Face API Key (Optional)

1. Go to [huggingface.co](https://huggingface.co) and create account
2. Go to **Settings** → **Access Tokens**
3. Click "New token"
4. Name it (e.g., "Axiora")
5. Copy the token
6. Add to `.env.local` as `NEXT_PUBLIC_HF_API_KEY`

**Note**: The app includes a fallback rule-based parser, so Hugging Face is optional but improves AI understanding.

### 6. PWA Icons (Optional but Recommended)

For PWA to work fully, you need app icons:

1. Create two PNG images:
   - `icon-192x192.png` (192x192 pixels)
   - `icon-512x512.png` (512x512 pixels)
2. Place them in the `public/` folder
3. You can use any image editor or online tools:
   - [Favicon Generator](https://realfavicongenerator.net/)
   - [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)

**Quick Icon Creation**:
- Use any square logo/image
- Resize to 192x192 and 512x512
- Save as PNG with transparency
- Place in `public/` folder

If icons are missing, PWA will still work but without custom icons.

### 7. Install Dependencies

```bash
npm install
# or
yarn install
```

### 8. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### 9. Create Your First Account

1. You'll be redirected to the auth page
2. Click "Don't have an account? Sign up"
3. Enter email and password (min 6 characters)
4. Check your email for confirmation (if email confirmation is enabled)
5. Sign in

### 10. Test the App

Try these features:
- ✅ Create a goal
- ✅ Add a task
- ✅ Log an expense
- ✅ View dashboard
- ✅ Use AI assistant (voice or text)

## 🔍 Verification Checklist

After setup, verify:

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] `.env.local` file created with correct values
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Can sign up/sign in
- [ ] Can create goals
- [ ] Can add tasks
- [ ] Can log expenses
- [ ] AI assistant works (text input)
- [ ] Voice input works (Chrome/Edge only)

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify variable names are correct
- Restart dev server after adding variables

### "Unauthorized" errors
- Verify Supabase credentials are correct
- Check Row Level Security policies are enabled
- Make sure you're signed in

### Voice recognition not working
- Use Chrome or Edge browser
- Check microphone permissions
- Allow microphone access when prompted
- Check if Web Speech API is supported: `'webkitSpeechRecognition' in window`

### Database errors
- Verify schema.sql ran successfully
- Check Supabase logs in dashboard
- Ensure tables exist in Database → Tables

### AI not understanding commands
- If using Hugging Face: check API key is correct
- Fallback parser works but is less accurate
- Try simpler commands: "Add a goal to finish this in 7 days"

## 📱 Testing PWA

1. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

2. **Test installation**:
   - Chrome/Edge: Look for install icon in address bar
   - Mobile: Use Chrome on Android or Safari on iOS

3. **Verify PWA features**:
   - App installs to home screen
   - Works offline (with service worker)
   - Shows custom icon

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_HF_API_KEY` (optional)
5. Deploy!

### Other Platforms

- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **Render**: Simple deployment

**Important**: Always set environment variables in your hosting platform.

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Hugging Face Models](https://huggingface.co/models)

## ✅ Next Steps

After setup:
1. Customize app theme in `tailwind.config.ts`
2. Add more expense categories if needed
3. Configure email settings in Supabase
4. Set up OAuth providers (Google, GitHub) in Supabase
5. Customize AI prompts in `lib/ai/intent-parser.ts`

---

**Need help?** Open an issue on GitHub or check the main README.md
