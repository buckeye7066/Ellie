import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import HeyGenAvatar from '../components/HeyGenAvatar';
import MemoryInsights from '../components/MemoryInsights';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/input';
import { useMemories } from '../hooks/useMemories';
import { findRelevantMemories, getChatResponse } from '../lib/llm';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [relevantMemories, setRelevantMemories] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const { memories, saveMemory } = useMemories();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Find relevant memories
    const relevant = await findRelevantMemories(userMessage, memories);
    setRelevantMemories(relevant);

    // Get AI response with context
    const recentMemories = memories.slice(-5);
    const response = await getChatResponse(userMessage, recentMemories, relevant);

    // Add bot message to chat
    const botMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      relevantMemories: relevant,
    };
    setMessages(prev => [...prev, botMessage]);

    // Save conversation as memory
    saveMemory({
      content: `User: ${userMessage}\nEllie: ${response}`,
      source: 'chat',
      tags: ['conversation'],
      importance: 5,
      context: `Conversation on ${new Date().toLocaleDateString()}`,
    });

    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMemoryClick = (memory) => {
    setInput(`Tell me more about: ${memory.content.substring(0, 50)}...`);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Avatar */}
      <div className="w-[400px] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-r-2 border-purple-200">
        <HeyGenAvatar isSpeaking={isSpeaking} />
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <div className="p-6 border-b bg-white/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chat with Ellie
          </h1>
          <p className="text-gray-600 mt-1">Your AI assistant with memory</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <div key={message.id}>
                {/* Show relevant memories for user messages */}
                {message.role === 'user' && message.relevantMemories && message.relevantMemories.length > 0 && (
                  <MemoryInsights 
                    memories={message.relevantMemories} 
                    onMemoryClick={handleMemoryClick}
                  />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3 shadow-md",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-800"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      message.role === 'user' ? "text-purple-200" : "text-gray-500"
                    )}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>

                {/* Show relevant memories for bot responses */}
                {message.role === 'assistant' && message.relevantMemories && message.relevantMemories.length > 0 && (
                  <div className="ml-4 mt-2">
                    <MemoryInsights 
                      memories={message.relevantMemories} 
                      onMemoryClick={handleMemoryClick}
                    />
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t bg-white/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
