import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Tag, Star, FileText, Mic, Upload, MessageSquare, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useMemories } from '../hooks/useMemories';
import { searchMemoriesWithAI, generateMemorySummary } from '../lib/llm';
import { cn } from '../lib/utils';

const Memories = () => {
  const { memories, getAllTags } = useMemories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchResult, setAiSearchResult] = useState(null);
  const [isAISearching, setIsAISearching] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);

  const allTags = getAllTags();

  const sourceIcons = {
    chat: MessageSquare,
    document: FileText,
    voice: Mic,
    import: Upload,
  };

  // Filter memories
  const filteredMemories = useMemo(() => {
    let filtered = [...memories];

    // Text search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.content.toLowerCase().includes(lowerQuery) ||
        m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(m =>
        selectedTags.some(tag => m.tags.includes(tag))
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }, [memories, searchQuery, selectedTags]);

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return;
    
    setIsAISearching(true);
    const result = await searchMemoriesWithAI(aiSearchQuery, memories);
    setAiSearchResult(result);
    setIsAISearching(false);
  };

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    const result = await generateMemorySummary(memories);
    setSummary(result);
    setIsSummarizing(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getImportanceColor = (importance) => {
    if (importance >= 8) return 'text-red-500';
    if (importance >= 6) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Memories
            </h1>
            <p className="text-gray-600 mt-1">
              {memories.length} memories stored
            </p>
          </div>
          <Button
            onClick={handleGenerateSummary}
            disabled={isSummarizing || memories.length === 0}
            variant="secondary"
          >
            {isSummarizing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate Summary
          </Button>
        </div>

        {/* Summary Display */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Sparkles className="w-5 h-5" />
                  Memory Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{summary.summary}</p>
                {summary.insights && summary.insights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Key Insights:</h4>
                    <ul className="space-y-1">
                      {summary.insights.map((insight, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* AI Search */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ask anything: 'What did I discuss last week?'"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                className="flex-1"
              />
              <Button onClick={handleAISearch} disabled={isAISearching}>
                {isAISearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {aiSearchResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50 rounded-lg"
              >
                <p className="text-sm text-gray-700 mb-2">{aiSearchResult.answer}</p>
                {aiSearchResult.reasoning && (
                  <p className="text-xs text-gray-500 italic">{aiSearchResult.reasoning}</p>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Traditional Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tags:</span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Memories List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMemories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No memories found</p>
            </div>
          ) : (
            filteredMemories.map((memory, index) => {
              const SourceIcon = sourceIcons[memory.source] || FileText;
              
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <SourceIcon className="w-5 h-5 text-purple-600" />
                        <div className={cn("flex items-center gap-1", getImportanceColor(memory.importance))}>
                          {Array.from({ length: Math.min(memory.importance, 10) }).map((_, i) => (
                            i < 3 && <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                          <span className="text-xs font-semibold">{memory.importance}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-4">
                        {memory.content}
                      </p>

                      {memory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {memory.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        {new Date(memory.createdAt).toLocaleDateString()} {new Date(memory.createdAt).toLocaleTimeString()}
                      </p>

                      {memory.relevance && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-purple-600 font-semibold">
                            Relevance: {memory.relevance}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Memories;
