import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Key for generic backend access
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Mock User ID for MVP (In prod, verify Auth token)
  const userId = req.headers['x-user-id'] || 'user_demo_1';

  try {
    // 1. Get IDs of cards this user has already swiped
    const { data: swipes } = await supabase
      .from('swipes')
      .select('card_id')
      .eq('swiper_id', userId);

    const swipedIds = swipes?.map(s => s.card_id) || [];

    // 2. Fetch Active cards NOT in that list
    let query = supabase
      .from('vision_cards')
      .select('*, profiles(full_name, role_type)')
      .eq('status', 'active')
      .limit(20);

    if (swipedIds.length > 0) {
      // Supabase PostgREST syntax for "not in"
      query = query.not('id', 'in', `(${swipedIds.join(',')})`);
    }

    const { data: cards, error } = await query;

    if (error) throw error;

    res.status(200).json({ cards });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
