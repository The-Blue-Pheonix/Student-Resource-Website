
// Centralized Supabase Config
// Uses the credentials found in the dashboard file
const SUPABASE_URL = "https://ringzvnghdbkksfzgjmi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpbmd6dm5naGRia2tzZnpnam1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODk5MTgsImV4cCI6MjA3ODM2NTkxOH0.ExdjZ8XJqKMrXOp2qr3QMctFwHvzvolGqzBM3enUZXY";

// Check if supabase global is available (from CDN)
if (typeof supabase === 'undefined') {
    console.error("Supabase client library not loaded! Make sure to include the CDN link before this script.");
}

// Initialize and export the client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to get current session
async function getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    return data.session;
}

// Export for module usage or global availability
window.supabaseClient = supabaseClient;
window.getSession = getSession;
