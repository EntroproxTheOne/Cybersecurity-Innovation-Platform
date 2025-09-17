const { getSupabase } = require('../config/database');

class Threat {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.severity = data.severity || 'medium';
    this.type = data.type;
    this.status = data.status || 'active';
    this.source = data.source;
    this.ipAddress = data.ip_address;
    this.location = data.location;
    this.detectedBy = data.detected_by;
    this.resolvedBy = data.resolved_by;
    this.detectedAt = data.detected_at || new Date().toISOString();
    this.resolvedAt = data.resolved_at;
    this.resolution = data.resolution;
    this.notes = data.notes;
    this.additionalData = data.additional_data || {};
    this.tags = data.tags || [];
    this.riskScore = data.risk_score || 50;
    this.impact = data.impact || 'medium';
    this.likelihood = data.likelihood || 'medium';
    this.affectedSystems = data.affected_systems || [];
    this.indicators = data.indicators || [];
    this.timeline = data.timeline || [];
    this.attachments = data.attachments || [];
    this.relatedThreats = data.related_threats || [];
    this.escalation = data.escalation || {
      escalated: false,
      escalatedAt: null,
      escalatedTo: null,
      reason: ''
    };
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Convert to database format
  toDB() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      severity: this.severity,
      type: this.type,
      status: this.status,
      source: this.source,
      ip_address: this.ipAddress,
      location: this.location,
      detected_by: this.detectedBy,
      resolved_by: this.resolvedBy,
      detected_at: this.detectedAt,
      resolved_at: this.resolvedAt,
      resolution: this.resolution,
      notes: this.notes,
      additional_data: this.additionalData,
      tags: this.tags,
      risk_score: this.riskScore,
      impact: this.impact,
      likelihood: this.likelihood,
      affected_systems: this.affectedSystems,
      indicators: this.indicators,
      timeline: this.timeline,
      attachments: this.attachments,
      related_threats: this.relatedThreats,
      escalation: this.escalation,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  // Convert from database format
  static fromDB(data) {
    return new Threat(data);
  }

  // Virtual for threat age in hours
  get ageInHours() {
    return Math.floor((Date.now() - new Date(this.detectedAt)) / (1000 * 60 * 60));
  }

  // Virtual for response time in hours
  get responseTimeInHours() {
    if (this.resolvedAt) {
      return Math.floor((new Date(this.resolvedAt) - new Date(this.detectedAt)) / (1000 * 60 * 60));
    }
    return null;
  }

  // Calculate risk score based on severity and impact
  calculateRiskScore() {
    const severityScores = { low: 25, medium: 50, high: 75, critical: 100 };
    const impactScores = { low: 25, medium: 50, high: 75, critical: 100 };
    
    this.riskScore = Math.round(
      (severityScores[this.severity] + impactScores[this.impact]) / 2
    );
  }

  // Instance methods
  async addTimelineEntry(action, performedBy, details = '') {
    this.timeline.push({
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString()
    });
    return this.save();
  }

  async escalate(escalatedTo, reason) {
    this.escalation = {
      escalated: true,
      escalatedAt: new Date().toISOString(),
      escalatedTo,
      reason
    };
    return this.save();
  }

  async addIndicator(type, value, description = '') {
    this.indicators.push({
      type,
      value,
      description
    });
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

  async save() {
    const supabase = getSupabase();
    
    // Auto-calculate risk score
    this.calculateRiskScore();
    
    // Auto-set resolvedAt when status changes to resolved
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date().toISOString();
    }
    
    const data = this.toDB();
    
    if (this.id) {
      // Update existing threat
      const { data: updatedThreat, error } = await supabase
        .from('threats')
        .update(data)
        .eq('id', this.id)
        .select()
        .single();
      
      if (error) return { error };
      return { data: Threat.fromDB(updatedThreat) };
    } else {
      // Create new threat
      const { data: newThreat, error } = await supabase
        .from('threats')
        .insert(data)
        .select()
        .single();
      
      if (error) return { error };
      return { data: Threat.fromDB(newThreat) };
    }
  }

  // Static methods
  static async findBySeverity(severity) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('severity', severity)
      .neq('status', 'closed')
      .order('detected_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(threat => Threat.fromDB(threat)) };
  }

  static async findActive() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('status', 'active')
      .order('detected_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(threat => Threat.fromDB(threat)) };
  }

  static async findByType(type) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('type', type)
      .order('detected_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(threat => Threat.fromDB(threat)) };
  }

  static async findByDateRange(startDate, endDate) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString())
      .order('detected_at', { ascending: false });
    
    if (error) return { error };
    return { data: data.map(threat => Threat.fromDB(threat)) };
  }

  static async getThreatStats() {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('get_threat_stats');
    
    if (error) return { error };
    return { data: data || { total: 0, active: 0, resolved: 0, critical: 0, high: 0, medium: 0, low: 0 } };
  }

  static async findById(id) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return { error };
    return { data: Threat.fromDB(data) };
  }

  static async findAll(filters = {}) {
    const supabase = getSupabase();
    let query = supabase.from('threats').select('*');
    
    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.detectedBy) {
      query = query.eq('detected_by', filters.detectedBy);
    }
    if (filters.source) {
      query = query.ilike('source', `%${filters.source}%`);
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,source.ilike.%${filters.search}%`);
    }
    if (filters.startDate && filters.endDate) {
      query = query.gte('detected_at', filters.startDate.toISOString()).lte('detected_at', filters.endDate.toISOString());
    }
    
    query = query.order('detected_at', { ascending: false });
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) return { error };
    return { data: data.map(threat => Threat.fromDB(threat)) };
  }

  static async delete(id) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('threats')
      .delete()
      .eq('id', id);
    
    return { error };
  }
}

module.exports = Threat;
