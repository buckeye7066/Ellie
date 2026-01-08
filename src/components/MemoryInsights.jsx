import { motion } from 'framer-motion';
import { Brain, Tag, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

const MemoryInsights = ({ memories = [], onMemoryClick }) => {
  if (!memories || memories.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Relevant Memories</h3>
          </div>
          
          <div className="space-y-3">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white transition-all hover:shadow-md"
                onClick={() => onMemoryClick && onMemoryClick(memory)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {memory.content}
                    </p>
                    
                    {memory.tags && memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memory.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {memory.relevance && (
                    <div className="flex items-center gap-1 text-purple-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {memory.relevance}%
                      </span>
                    </div>
                  )}
                </div>
                
                {memory.reason && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {memory.reason}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          
          <p className="text-xs text-purple-600 mt-3 text-center">
            Click on a memory to explore more
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MemoryInsights;
