# Supabase Setup Guide for THINK AI 3.0

This guide will help you set up Supabase as the database for the THINK AI 3.0 Cybersecurity Platform.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js (v18 or higher)
3. npm or yarn

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `think-ai-3-cybersecurity`
   - Database Password: (generate a strong password)
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Set Up Environment Variables

1. Copy the `env.example` file to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000

   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # JWT Secret (generate a strong secret key)
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@thinkai3.com

   # Other configurations...
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the contents of `server/config/supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `users` table with all necessary fields and indexes
- `threats` table with comprehensive threat management fields
- `contacts` table for contact form submissions
- All necessary indexes for performance
- Row Level Security (RLS) policies
- Helper functions for statistics

## Step 5: Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## Step 6: Test the Connection

1. Start the server:
   ```bash
   npm run server
   ```

2. You should see:
   ```
   🗄️  Supabase Connected Successfully
   🌍 Supabase URL: https://your-project-ref.supabase.co
   🚀 Server running on port 5000
   ```

## Step 7: Create Your First Admin User

You can create an admin user through the Supabase dashboard or by using the API. Here's a sample script:

```javascript
// create-admin.js
const bcrypt = require('bcryptjs');
const { getSupabase } = require('./server/config/database');

async function createAdmin() {
  const supabase = getSupabase();
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: 'Admin User',
      email: 'admin@thinkai3.com',
      password: hashedPassword,
      role: 'admin',
      is_active: true
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating admin:', error);
  } else {
    console.log('Admin user created:', data);
  }
}

createAdmin();
```

## Step 8: Configure Row Level Security (Optional)

The schema includes RLS policies, but you may want to customize them based on your needs:

1. Go to Authentication > Policies in your Supabase dashboard
2. Review and modify the policies for each table
3. Ensure your policies match your application's security requirements

## Step 9: Set Up Email (Optional)

If you want to use email notifications:

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure SMTP settings or use Supabase's built-in email service
3. Update the email configuration in your `.env` file

## Troubleshooting

### Common Issues

1. **Connection Error**: Check that your Supabase URL and keys are correct
2. **Permission Denied**: Ensure you're using the service role key for server operations
3. **Schema Errors**: Make sure you've run the complete schema from `supabase-schema.sql`
4. **RLS Issues**: Check that your RLS policies allow the operations you're trying to perform

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Supabase Discord](https://discord.supabase.com) for community support
- Check the application logs for detailed error messages

## Next Steps

1. Start the development server: `npm run dev`
2. Access the application at `http://localhost:3000`
3. Test the authentication and data operations
4. Customize the application based on your needs

## Production Deployment

When deploying to production:

1. Create a new Supabase project for production
2. Update your environment variables with production credentials
3. Run the schema on the production database
4. Configure proper RLS policies for production
5. Set up monitoring and backups

---

**Note**: Keep your service role key secure and never commit it to version control!
