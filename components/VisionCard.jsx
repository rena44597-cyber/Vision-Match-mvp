import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Rocket, Clock, Users } from 'lucide-react';

export default function VisionCard({ card, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacityRight = useTransform(x, [50, 150], [0, 1]);
  const opacityLeft = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  if (!card) return null;

  return (
    <div className="relative w-full max-w-sm h-[600px] perspective-1000">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate }}
        onDragEnd={handleDragEnd}
        className="absolute w-full h-full bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Swipe Indicators */}
        <motion.div style={{ opacity: opacityRight }} className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded -rotate-12 z-20 bg-white/50 backdrop-blur-sm">
          MATCH
        </motion.div>
        <motion.div style={{ opacity: opacityLeft }} className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded rotate-12 z-20 bg-white/50 backdrop-blur-sm">
          PASS
        </motion.div>

        {/* Card Header */}
        <div className="h-2/5 bg-gradient-to-br from-blue-600 to-indigo-800 p-6 flex flex-col justify-end relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium">
            {card.status || 'Active'}
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-2">{card.title}</h2>
          <div className="flex gap-2 text-blue-100 text-sm">
            <Rocket size={16} />
            <span>Early Stage</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col h-3/5 justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {card.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-lg leading-relaxed line-clamp-4">
              {card.summary}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-700">
              <Users size={20} className="text-indigo-500" />
              <span className="font-medium text-sm">Needs: <span className="text-gray-900">{card.required_roles?.join(', ')}</span></span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={20} className="text-indigo-500" />
              <span className="font-medium text-sm">Time: <span className="text-gray-900">{card.commitment_level}</span></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
