import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MessageSquare, Heart, Share2, ArrowLeft } from 'lucide-react';

export default function Feed({ supabase }) {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeed = async () => {
      const { data } = await supabase
        .from('posts')
        .select(`*, profiles(full_name, avatar_url, role_type)`)
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
    };
    fetchFeed();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">Hustle Feed</h1>
        <div className="w-6" />
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Create Post Input */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
            <textarea className="w-full resize-none outline-none text-gray-700 mt-2" placeholder="What are you building today?" rows={2} />
          </div>
          <div className="flex justify-end mt-2">
            <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">Post</button>
          </div>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {post.profiles?.full_name?.[0] || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-none">{post.profiles?.full_name || 'Anonymous User'}</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">{post.profiles?.role_type || 'Founder'}</p>
              </div>
            </div>
            
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center gap-6 border-t pt-3 text-gray-400">
              <button className="flex items-center gap-2 hover:text-red-500 transition"><Heart size={18} /><span className="text-xs font-bold">{post.likes_count}</span></button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition"><MessageSquare size={18} /><span className="text-xs font-bold">Comment</span></button>
              <button className="ml-auto hover:text-gray-600"><Share2 size={18} /></button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
