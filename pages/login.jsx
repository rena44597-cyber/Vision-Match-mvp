// File: pages/login.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Mail, Loader2, LogIn, UserCircle } from 'lucide-react';
// Assuming you created a dedicated Supabase client file in lib/
import { supabase } from '../lib/supabaseClient'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // 1. Check existing session and redirect
  useEffect(() => {
    const checkSession = async () => {
      // Note: In a production app using the Auth Helpers, you'd use 
      // the `useUser` hook or an SSR check to get the session easily.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/swipe'); // Redirect to the main app page
      }
    };
    
    // This handles the post-redirect URL hash containing access tokens
    // which is needed for some older mobile/browser flows.
    if (window.location.hash.includes('access_token')) {
        checkSession(); // Check immediately after a successful OAuth redirect
    } else {
        checkSession(); // Check on component mount
    }

  }, [router]);

  // 2. Google OAuth Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Use the current origin for redirect
        redirectTo: `${window.location.origin}/`, 
      },
    });

    if (error) {
      alert(`Google sign-in error: ${error.message}`);
      setLoading(false);
    }
    // Success will be handled by the useEffect above (or by Supabase automatically).
  };

  // 3. Email Magic Link Sign-In (OTP)
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address.');

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Must match the URL in your Supabase Auth settings
        emailRedirectTo: `${window.location.origin}/`, 
      },
    });

    setLoading(false);
    if (error) {
      alert(`Magic link error: ${error.message}`);
    } else {
      setMagicLinkSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <LogIn className="text-indigo-600" size={28} />
          Welcome to Vision Match
        </h1>
        <p className="text-sm text-gray-500">Sign in to find your next co-founder or project.</p>

        {/* --- GOOGLE OAUTH BUTTON --- */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <UserCircle size={20} />}
          {loading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">Or use Magic Link</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* --- EMAIL MAGIC LINK FORM --- */}
        {magicLinkSent ? (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md">
                <p className="font-medium">Magic Link Sent! ✉️</p>
                <p className="text-sm">Please check your **campus email inbox** to complete sign-in.</p>
            </div>
        ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@university.edu"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                Send Magic Link
              </button>
            </form>
        )}

        <p className="mt-4 text-xs text-gray-500 text-center">
          We prioritize campus email verification to build a trusted community.
        </p>
      </div>
    </div>
  );
}
