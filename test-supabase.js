#!/usr/bin/env node

/**
 * Test script to verify Supabase connection and basic operations
 * Run this after setting up your Supabase project and environment variables
 */

require('dotenv').config();
const { connectDB, getSupabase } = require('./server/config/database');
const User = require('./server/models/User');
const Threat = require('./server/models/Threat');
const Contact = require('./server/models/Contact');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    await connectDB();
    console.log('✅ Database connection successful\n');

    // Test basic operations
    console.log('2. Testing basic operations...');
    
    // Test User model
    console.log('   Testing User model...');
    const { data: users, error: usersError } = await User.findAll({ limit: 1 });
    if (usersError) {
      console.log('   ⚠️  User table might not exist yet:', usersError.message);
    } else {
      console.log('   ✅ User model working');
    }

    // Test Threat model
    console.log('   Testing Threat model...');
    const { data: threats, error: threatsError } = await Threat.findAll({ limit: 1 });
    if (threatsError) {
      console.log('   ⚠️  Threat table might not exist yet:', threatsError.message);
    } else {
      console.log('   ✅ Threat model working');
    }

    // Test Contact model
    console.log('   Testing Contact model...');
    const { data: contacts, error: contactsError } = await Contact.findAll({ limit: 1 });
    if (contactsError) {
      console.log('   ⚠️  Contact table might not exist yet:', contactsError.message);
    } else {
      console.log('   ✅ Contact model working');
    }

    console.log('\n3. Testing statistics functions...');
    
    // Test threat stats
    const { data: threatStats, error: threatStatsError } = await Threat.getThreatStats();
    if (threatStatsError) {
      console.log('   ⚠️  Threat stats function might not exist yet:', threatStatsError.message);
    } else {
      console.log('   ✅ Threat stats function working');
    }

    // Test contact stats
    const { data: contactStats, error: contactStatsError } = await Contact.getContactStats();
    if (contactStatsError) {
      console.log('   ⚠️  Contact stats function might not exist yet:', contactStatsError.message);
    } else {
      console.log('   ✅ Contact stats function working');
    }

    console.log('\n🎉 Supabase connection test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure you have run the SQL schema from server/config/supabase-schema.sql');
    console.log('2. Check your environment variables in .env file');
    console.log('3. Start the server with: npm run server');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    console.log('2. Make sure your Supabase project is active');
    console.log('3. Verify you have run the database schema');
    process.exit(1);
  }
}

// Run the test
testSupabaseConnection();
