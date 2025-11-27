import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cardId, direction } = req.body;
  // Mock User ID for MVP
  const userId = req.headers['x-user-id'] || 'user_demo_1'; 

  try {
    // 1. Insert Swipe
    const { error: swipeError } = await supabase.from('swipes').insert({
      swiper_id: userId,
      card_id: cardId,
      direction
    });

    if (swipeError) throw swipeError;

    let isMatch = false;

    // 2. Simple Match Logic: 
    // If User Swipes RIGHT, check if Card Owner has ALREADY swiped RIGHT on this User's Card.
    // (Or for this specific MVP requirement: Swipe Right on Idea -> "Save/Interest")
    
    if (direction === 'right') {
      // Fetch card details to get the creator
      const { data: card } = await supabase
        .from('vision_cards')
        .select('creator_id')
        .eq('id', cardId)
        .single();
        
      if (card) {
        // Create a Match Record (In a real app, you might wait for mutual approval)
        // Here we assume "Swiping Right on an Idea" indicates strong interest triggering a match request.
        const { error: matchError } = await supabase.from('matches').insert({
          card_id: cardId,
          seeker_id: userId,
          founder_id: card.creator_id,
          synergy_score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
          is_active: true
        });

        if (!matchError) isMatch = true;
      }
    }

    res.status(200).json({ success: true, match: isMatch });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
