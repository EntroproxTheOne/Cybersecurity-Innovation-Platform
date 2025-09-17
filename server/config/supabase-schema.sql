-- Supabase Database Schema for THINK AI 3.0 Cybersecurity Platform
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL CHECK (length(name) >= 2),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
    company VARCHAR(100) DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'analyst', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_picture TEXT DEFAULT '',
    preferences JSONB DEFAULT '{
        "theme": "dark",
        "notifications": {
            "email": true,
            "threatAlerts": true,
            "systemUpdates": false
        },
        "dashboard": {
            "widgets": []
        }
    }',
    security_settings JSONB DEFAULT '{
        "twoFactorEnabled": false,
        "twoFactorSecret": "",
        "passwordChangedAt": "NOW()",
        "loginAttempts": 0,
        "lockUntil": null
    }',
    api_keys JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Threats table
CREATE TABLE threats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL CHECK (length(title) >= 3),
    description TEXT NOT NULL CHECK (length(description) >= 10),
    severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    type VARCHAR(30) NOT NULL CHECK (type IN ('malware', 'phishing', 'ddos', 'data_breach', 'insider_threat', 'vulnerability', 'other')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive', 'closed')),
    source VARCHAR(100) NOT NULL,
    ip_address INET,
    location VARCHAR(100),
    detected_by UUID REFERENCES users(id) NOT NULL,
    resolved_by UUID REFERENCES users(id),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT CHECK (length(resolution) <= 1000),
    notes TEXT CHECK (length(notes) <= 2000),
    additional_data JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
    impact VARCHAR(20) DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high', 'critical')),
    likelihood VARCHAR(20) DEFAULT 'medium' CHECK (likelihood IN ('low', 'medium', 'high', 'critical')),
    affected_systems TEXT[] DEFAULT '{}',
    indicators JSONB DEFAULT '[]',
    timeline JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    related_threats UUID[] DEFAULT '{}',
    escalation JSONB DEFAULT '{
        "escalated": false,
        "escalatedAt": null,
        "escalatedTo": null,
        "reason": ""
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (length(name) >= 2),
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    subject VARCHAR(200) NOT NULL CHECK (length(subject) >= 5),
    message TEXT NOT NULL CHECK (length(message) >= 10),
    company VARCHAR(100) DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(20) DEFAULT 'general' CHECK (category IN ('general', 'support', 'sales', 'partnership', 'security', 'other')),
    assigned_to UUID REFERENCES users(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT DEFAULT '',
    response TEXT DEFAULT '',
    attachments JSONB DEFAULT '[]',
    follow_up JSONB DEFAULT '{
        "required": false,
        "scheduledAt": null,
        "completed": false,
        "notes": ""
    }',
    source VARCHAR(20) DEFAULT 'website' CHECK (source IN ('website', 'email', 'phone', 'social_media', 'referral', 'other')),
    ip_address INET,
    user_agent TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE INDEX idx_threats_detected_at ON threats(detected_at DESC);
CREATE INDEX idx_threats_severity ON threats(severity);
CREATE INDEX idx_threats_status ON threats(status);
CREATE INDEX idx_threats_type ON threats(type);
CREATE INDEX idx_threats_detected_by ON threats(detected_by);
CREATE INDEX idx_threats_source ON threats(source);
CREATE INDEX idx_threats_ip_address ON threats(ip_address);
CREATE INDEX idx_threats_tags ON threats USING GIN(tags);
CREATE INDEX idx_threats_created_at ON threats(created_at DESC);
CREATE INDEX idx_threats_status_severity ON threats(status, severity);
CREATE INDEX idx_threats_detected_at_status ON threats(detected_at DESC, status);
CREATE INDEX idx_threats_type_severity ON threats(type, severity);

CREATE INDEX idx_contacts_submitted_at ON contacts(submitted_at DESC);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_priority ON contacts(priority);
CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_status_priority ON contacts(status, priority);
CREATE INDEX idx_contacts_submitted_at_status ON contacts(submitted_at DESC, status);
CREATE INDEX idx_contacts_category_status ON contacts(category, status);

-- Create full-text search indexes
CREATE INDEX idx_threats_text_search ON threats USING GIN(to_tsvector('english', title || ' ' || description || ' ' || COALESCE(source, '') || ' ' || COALESCE(notes, '')));
CREATE INDEX idx_contacts_text_search ON contacts USING GIN(to_tsvector('english', name || ' ' || email || ' ' || subject || ' ' || message || ' ' || COALESCE(company, '')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threats_updated_at BEFORE UPDATE ON threats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Threats policies
CREATE POLICY "Users can view threats" ON threats FOR SELECT USING (true);
CREATE POLICY "Analysts and admins can insert threats" ON threats FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('analyst', 'admin'))
);
CREATE POLICY "Analysts and admins can update threats" ON threats FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('analyst', 'admin'))
);
CREATE POLICY "Admins can delete threats" ON threats FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Contacts policies
CREATE POLICY "Users can view contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Analysts and admins can update contacts" ON contacts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('analyst', 'admin'))
);
CREATE POLICY "Admins can delete contacts" ON contacts FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_threat_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'active', COUNT(*) FILTER (WHERE status = 'active'),
        'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
        'critical', COUNT(*) FILTER (WHERE severity = 'critical'),
        'high', COUNT(*) FILTER (WHERE severity = 'high'),
        'medium', COUNT(*) FILTER (WHERE severity = 'medium'),
        'low', COUNT(*) FILTER (WHERE severity = 'low')
    ) INTO result
    FROM threats;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_contact_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'new', COUNT(*) FILTER (WHERE status = 'new'),
        'inProgress', COUNT(*) FILTER (WHERE status = 'in_progress'),
        'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
        'closed', COUNT(*) FILTER (WHERE status = 'closed'),
        'urgent', COUNT(*) FILTER (WHERE priority = 'urgent'),
        'high', COUNT(*) FILTER (WHERE priority = 'high'),
        'medium', COUNT(*) FILTER (WHERE priority = 'medium'),
        'low', COUNT(*) FILTER (WHERE priority = 'low')
    ) INTO result
    FROM contacts;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
