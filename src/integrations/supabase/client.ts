// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xitppxwiczmqwekbnrzo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdHBweHdpY3ptcXdla2JucnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNzUzODUsImV4cCI6MjA2NDg1MTM4NX0.pstEd-kuOxXmW3eXkSqonczjU3FJbsqgK6m5bMcS1eA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);