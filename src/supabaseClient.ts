import { createClient } from '@supabase/supabase-js';

// Ersätt med din Supabase URL och public API key
const supabaseUrl = 'https://grdhuwwcpovnebwralwd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZGh1d3djcG92bmVid3JhbHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NDM0NDEsImV4cCI6MjA0NjIxOTQ0MX0.o2vUEamuIxw4sgTV6T3LEg46yPrVHdTWpAvgABLHhR4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);