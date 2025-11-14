import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'tekyebrivzshyfxryeyq';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRla3llYnJpdnpzaHlmeHJ5ZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDMwNjMsImV4cCI6MjA3Nzc3OTA2M30.rAHm9riy6eyYP3K9FmoF9ICRBhnUlyScJMREJJDCio4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);