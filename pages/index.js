import { useRouter } from 'next/router';
import { Sparkles, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
            <Sparkles size={48} className="text-yellow-300" />
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight">Vision Match</h1>
        <p className="text-lg text-indigo-100 leading-relaxed">
          Don't just find a co-founder. Find a vision you believe in.
          Swipe on ideas, projects, and startup concepts.
        </p>

        <div className="flex flex-col gap-3 pt-8 w-full">
          <button 
            onClick={() => router.push('/swipe')}
            className="w-full py-4 bg-white text-indigo-700 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1"
          >
            Start Swiping
          </button>
          
          <button 
            onClick={() => router.push('/feed')}
            className="w-full py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Community Feed
          </button>
        </div>
      </div>
    </div>
  );
}
