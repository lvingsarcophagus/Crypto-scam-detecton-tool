-- Crypto Scam Detector Initial Setup
-- Note: This project doesn't use persistent database storage
-- This file is included for completeness and future extensions

-- Create a simple log table for tracking function usage (optional)
CREATE TABLE IF NOT EXISTS public.analysis_logs (
    id BIGSERIAL PRIMARY KEY,
    token_input TEXT NOT NULL,
    risk_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analysis_logs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert logs (optional)
CREATE POLICY "Allow public insert" ON public.analysis_logs
    FOR INSERT TO public
    WITH CHECK (true);

-- Create a policy that prevents reading logs (privacy)
CREATE POLICY "Prevent public read" ON public.analysis_logs
    FOR SELECT TO public
    USING (false);

-- Add a comment explaining the table purpose
COMMENT ON TABLE public.analysis_logs IS 'Optional logging table for tracking token analysis requests. Not used in current implementation but available for future analytics.';
