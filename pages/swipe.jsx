import { useState, useEffect } from 'react';
import VisionCard from '../components/VisionCard';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

export default function SwipePage({ supabase }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/vision-cards');
      const data = await res.json();
      setCards(data.cards || []);
    } catch (error) {
      console.error("Failed to load cards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    const cardToSwipe = cards[0];
    // Optimistic Update: Remove card from UI immediately
    setCards((prev) => prev.slice(1));

    try {
      await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cardId: cardToSwipe.id, 
          direction 
        }),
      });
    } catch (error) {
      console.error("Swipe sync failed", error);
      // In production, you might want to revert the UI state here
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-medium">
      Finding visions...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="w-full max-w-sm px-4 mb-4 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="p-2 bg-white rounded-full shadow-sm text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Discover</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 w-full flex justify-center items-center px-4">
        {cards.length > 0 ? (
          <VisionCard card={cards[0]} onSwipe={handleSwipe} />
        ) : (
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">You're all caught up!</h3>
            <p className="text-gray-500 mb-6">Check back later for more startup ideas.</p>
            <button 
                onClick={fetchCards}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold w-full"
            >
                Refresh Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
