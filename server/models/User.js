const { getSupabase } = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class User {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.company = data.company || '';
    this.phone = data.phone || '';
    this.role = data.role || 'user';
    this.isActive = data.is_active !== undefined ? data.is_active : true;
    this.lastLogin = data.last_login;
    this.profilePicture = data.profile_picture || '';
    this.preferences = data.preferences || {
      theme: 'dark',
      notifications: {
        email: true,
        threatAlerts: true,
        systemUpdates: false
      },
      dashboard: {
        widgets: []
      }
    };
    this.securitySettings = data.security_settings || {
      twoFactorEnabled: false,
      twoFactorSecret: '',
      passwordChangedAt: new Date().toISOString(),
      loginAttempts: 0,
      lockUntil: null
    };
    this.apiKeys = data.api_keys || [];
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Convert to database format
  toDB() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      company: this.company,
      phone: this.phone,
      role: this.role,
      is_active: this.isActive,
      last_login: this.lastLogin,
      profile_picture: this.profilePicture,
      preferences: this.preferences,
      security_settings: this.securitySettings,
      api_keys: this.apiKeys,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  // Convert from database format
  static fromDB(data) {
    return new User(data);
  }

  // Virtual for account lock status
  get isLocked() {
    return !!(this.securitySettings.lockUntil && new Date(this.securitySettings.lockUntil) > new Date());
  }

  // Instance methods
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  async incrementLoginAttempts() {
    const supabase = getSupabase();
    
    // If we have a previous lock that has expired, restart at 1
    if (this.securitySettings.lockUntil && new Date(this.securitySettings.lockUntil) < new Date()) {
      const { error } = await supabase
        .from('users')
        .update({
          security_settings: {
            ...this.securitySettings,
            lockUntil: null,
            loginAttempts: 1
          }
        })
        .eq('id', this.id);
      
      if (!error) {
        this.securitySettings.lockUntil = null;
        this.securitySettings.loginAttempts = 1;
      }
      return { error };
    }
    
    const newAttempts = this.securitySettings.loginAttempts + 1;
    const updates = {
      security_settings: {
        ...this.securitySettings,
        loginAttempts: newAttempts
      }
    };
    
    // Lock account after 5 failed attempts for 2 hours
    if (newAttempts >= 5 && !this.isLocked) {
      updates.security_settings.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    }
    
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', this.id);
    
    if (!error) {
      this.securitySettings = updates.security_settings;
    }
    
    return { error };
  }

  async resetLoginAttempts() {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('users')
      .update({
        security_settings: {
          ...this.securitySettings,
          loginAttempts: 0,
          lockUntil: null
        }
      })
      .eq('id', this.id);
    
    if (!error) {
      this.securitySettings.loginAttempts = 0;
      this.securitySettings.lockUntil = null;
    }
    
    return { error };
  }

  generateApiKey(name, permissions = ['read']) {
    const key = crypto.randomBytes(32).toString('hex');
    const newApiKey = {
      name,
      key,
      permissions,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    this.apiKeys.push(newApiKey);
    return key;
  }

  revokeApiKey(keyId) {
    this.apiKeys = this.apiKeys.filter(key => key.id !== keyId);
  }

  async updateLastLogin() {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', this.id);
    
    if (!error) {
      this.lastLogin = new Date().toISOString();
    }
    
    return { error };
  }

  async save() {
    const supabase = getSupabase();
    const data = this.toDB();
    
    if (this.id) {
      // Update existing user
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', this.id)
        .select()
        .single();
      
      if (error) return { error };
      return { data: User.fromDB(updatedUser) };
    } else {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert(data)
        .select()
        .single();
      
      if (error) return { error };
      return { data: User.fromDB(newUser) };
    }
  }

  // Static methods
  static async findByEmail(email) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error) return { error };
    return { data: User.fromDB(data) };
  }

  static async findActiveUsers() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(user => User.fromDB(user)) };
  }

  static async findByRole(role) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(user => User.fromDB(user)) };
  }

  static async findById(id) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return { error };
    return { data: User.fromDB(data) };
  }

  static async findAll(filters = {}) {
    const supabase = getSupabase();
    let query = supabase.from('users').select('*');
    
    if (filters.role) {
      query = query.eq('role', filters.role);
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    
    query = query.order('created_at', { ascending: false });
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) return { error };
    return { data: data.map(user => User.fromDB(user)) };
  }

  static async delete(id) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return { error };
  }
}

module.exports = User;
