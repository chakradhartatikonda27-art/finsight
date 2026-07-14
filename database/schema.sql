-- FinSight MIS Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tally_format TEXT DEFAULT 'KA',
  fiscal_year TEXT DEFAULT '2025-26',
  subscription_tier TEXT DEFAULT 'growth',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  file_size_bytes INTEGER,
  row_count INTEGER,
  voucher_count INTEGER,
  ledger_count INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  validated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES uploads(id),
  org_id TEXT NOT NULL,
  txn_date DATE,
  voucher_type TEXT,
  voucher_no TEXT,
  ledger_name TEXT,
  debit NUMERIC(15,2) DEFAULT 0,
  credit NUMERIC(15,2) DEFAULT 0,
  cost_centre TEXT,
  narration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  ledger_code TEXT,
  ledger_name TEXT NOT NULL,
  tally_group TEXT,
  mis_head TEXT,
  confidence INTEGER DEFAULT 0,
  confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by TEXT,
  confirmed_at TIMESTAMPTZ,
  mapping_source TEXT DEFAULT 'rule_engine',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, ledger_name)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  actor_id TEXT,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  detail JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_upload_id ON vouchers(upload_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_org_id ON vouchers(org_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_ledger_name ON vouchers(ledger_name);
CREATE INDEX IF NOT EXISTS idx_ledger_mappings_org_id ON ledger_mappings(org_id);
CREATE INDEX IF NOT EXISTS idx_uploads_org_id ON uploads(org_id);

INSERT INTO companies (name, tally_format, fiscal_year, subscription_tier)
VALUES ('Mudduluru Infratech Pvt. Ltd. (KA)', 'KA', '2025-26', 'growth')
ON CONFLICT DO NOTHING;
