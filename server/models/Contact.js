const { getSupabase } = require('../config/database');

class Contact {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.subject = data.subject;
    this.message = data.message;
    this.company = data.company || '';
    this.phone = data.phone || '';
    this.status = data.status || 'new';
    this.priority = data.priority || 'medium';
    this.category = data.category || 'general';
    this.assignedTo = data.assigned_to;
    this.submittedAt = data.submitted_at || new Date().toISOString();
    this.resolvedAt = data.resolved_at;
    this.notes = data.notes || '';
    this.response = data.response || '';
    this.attachments = data.attachments || [];
    this.followUp = data.follow_up || {
      required: false,
      scheduledAt: null,
      completed: false,
      notes: ''
    };
    this.source = data.source || 'website';
    this.ipAddress = data.ip_address;
    this.userAgent = data.user_agent;
    this.tags = data.tags || [];
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Convert to database format
  toDB() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      company: this.company,
      phone: this.phone,
      status: this.status,
      priority: this.priority,
      category: this.category,
      assigned_to: this.assignedTo,
      submitted_at: this.submittedAt,
      resolved_at: this.resolvedAt,
      notes: this.notes,
      response: this.response,
      attachments: this.attachments,
      follow_up: this.followUp,
      source: this.source,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      tags: this.tags,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  // Convert from database format
  static fromDB(data) {
    return new Contact(data);
  }

  // Virtual for response time in hours
  get responseTimeInHours() {
    if (this.resolvedAt) {
      return Math.floor((new Date(this.resolvedAt) - new Date(this.submittedAt)) / (1000 * 60 * 60));
    }
    return null;
  }

  // Virtual for age in hours
  get ageInHours() {
    return Math.floor((Date.now() - new Date(this.submittedAt)) / (1000 * 60 * 60));
  }

  // Auto-set priority based on keywords in message
  setPriorityFromMessage() {
    const urgentKeywords = ['urgent', 'emergency', 'critical', 'asap', 'immediately'];
    const highKeywords = ['important', 'priority', 'soon', 'quickly'];
    
    const messageLower = this.message.toLowerCase();
    
    if (urgentKeywords.some(keyword => messageLower.includes(keyword))) {
      this.priority = 'urgent';
    } else if (highKeywords.some(keyword => messageLower.includes(keyword))) {
      this.priority = 'high';
    }
  }

  // Instance methods
  async assignTo(userId) {
    this.assignedTo = userId;
    this.status = 'in_progress';
    return this.save();
  }

  async addNote(note) {
    this.notes = this.notes ? `${this.notes}\n${note}` : note;
    return this.save();
  }

  async addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
    return this.save();
  }

  async removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    return this.save();
  }

  async scheduleFollowUp(scheduledAt, notes = '') {
    this.followUp = {
      required: true,
      scheduledAt: scheduledAt.toISOString(),
      notes,
      completed: false
    };
    return this.save();
  }

  async completeFollowUp(notes = '') {
    this.followUp.completed = true;
    if (notes) {
      this.followUp.notes = this.followUp.notes ? `${this.followUp.notes}\n${notes}` : notes;
    }
    return this.save();
  }

  async save() {
    const supabase = getSupabase();
    
    // Auto-set resolvedAt when status changes to resolved
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date().toISOString();
    }

    // Auto-set priority based on keywords in message
    if (!this.id) {
      this.setPriorityFromMessage();
    }
    
    const data = this.toDB();
    
    if (this.id) {
      // Update existing contact
      const { data: updatedContact, error } = await supabase
        .from('contacts')
        .update(data)
        .eq('id', this.id)
        .select()
        .single();
      
      if (error) return { error };
      return { data: Contact.fromDB(updatedContact) };
    } else {
      // Create new contact
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert(data)
        .select()
        .single();
      
      if (error) return { error };
      return { data: Contact.fromDB(newContact) };
    }
  }

  // Static methods
  static async findByStatus(status) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('status', status)
      .order('submitted_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(contact => Contact.fromDB(contact)) };
  }

  static async findByPriority(priority) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('priority', priority)
      .order('submitted_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(contact => Contact.fromDB(contact)) };
  }

  static async findByCategory(category) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('category', category)
      .order('submitted_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(contact => Contact.fromDB(contact)) };
  }

  static async findOverdue() {
    const supabase = getSupabase();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .in('status', ['new', 'in_progress'])
      .lt('submitted_at', oneDayAgo)
      .order('submitted_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(contact => Contact.fromDB(contact)) };
  }

  static async findPendingFollowUp() {
    const supabase = getSupabase();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('follow_up.required', true)
      .eq('follow_up.completed', false)
      .lte('follow_up.scheduledAt', now)
      .order('submitted_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(contact => Contact.fromDB(contact)) };
  }

  static async getContactStats() {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('get_contact_stats');
    
    if (error) return { error };
    return { data: data || { total: 0, new: 0, inProgress: 0, resolved: 0, closed: 0, urgent: 0, high: 0, medium: 0, low: 0 } };
  }

  static async findById(id) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return { error };
    return { data: Contact.fromDB(data) };
  }

  static async findAll(filters = {}) {
    const supabase = getSupabase();
    let query = supabase.from('contacts').select('*');
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
    if (filters.startDate && filters.endDate) {
      query = query.gte('submitted_at', filters.startDate.toISOString()).lte('submitted_at', filters.endDate.toISOString());
    }
    
    query = query.order('submitted_at', { ascending: false });
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) return { error };
    return { data: data.map(contact => Contact.fromDB(contact)) };
  }

  static async delete(id) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    return { error };
  }
}

module.exports = Contact;
