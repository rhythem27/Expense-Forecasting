-- SQL script to create the necessary tables for Aura Finance

-- Enable UUID extension if it doesn't already exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    current_cash_balance NUMERIC DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: You should execute this SQL in your Supabase SQL Editor.
-- Once created, you can insert the default company:
-- INSERT INTO public.companies (id, name, current_cash_balance) VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Aura Demo Company', 500000.00);
