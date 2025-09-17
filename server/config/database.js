const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const connectDB = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration. Please check your environment variables.');
    }

    supabase = createClient(supabaseUrl, supabaseKey);

    // Test the connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected for new projects
      throw error;
    }

    console.log('🗄️  Supabase Connected Successfully');
    console.log(`🌍 Supabase URL: ${supabaseUrl}`);
    
    // Handle connection events
    process.on('SIGINT', async () => {
      console.log('Supabase connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Supabase connection error:', error);
    console.log('⚠️  Continuing without database connection for development...');
    // Don't exit in development mode
  }
};

const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Make sure to call connectDB() first.');
  }
  return supabase;
};

module.exports = { connectDB, getSupabase };
