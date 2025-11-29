// pages/login.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle redirect after OAuth sign-in if using "redirectTo"
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Optionally you can parse the token or just redirect to home
      router.replace('/');
    }
  }, [router]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // optional: redirect after sign-in
        redirectTo: typeof window !== 'undefined' ? window.location.origin + '/' : undefined,
      },
    });
    if (error) alert('Error: ' + error.message);
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) return alert('Please enter your email address');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/': undefined,
      },
    });
    if (error) return alert('Error: ' + error.message);
    alert('Magic link sent! Check your email.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow rounded p-8">
        <h1 className="text-2xl font-bold mb-4">Sign in to Vision Match</h1>

        <button
          onClick={signInWithGoogle}
          className="w-full mb-4 py-2 px-4 bg-red-500 text-white rounded"
        >
          Continue with Google
        </button>

        <div className="my-4 text-center text-sm text-gray-500">or</div>

        <form onSubmit={signInWithEmail}>
          <input
            name="email"
            type="email"
            placeholder="your@university.edu"
            className="w-full mb-3 border px-3 py-2 rounded"
            required
          />
          <button className="w-full py-2 bg-blue-600 text-white rounded">Send magic link</button>
        </form>

        <p className="mt-4 text-xs text-gray-500">Use your campus email for verified student access.</p>
      </div>
    </div>
  );
}
