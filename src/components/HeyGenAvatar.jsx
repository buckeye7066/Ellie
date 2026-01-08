import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HeyGenAvatar = ({ isListening = false, isSpeaking = false, onAvatarReady }) => {
  const [isReady, setIsReady] = useState(false);
  
  const avatarUrl = "https://labs.heygen.com/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJLYXR5YV9DYXN1YWxMb29rX3B1YmxpYyIs";

  useEffect(() => {
    // Simulate avatar loading
    const timer = setTimeout(() => {
      setIsReady(true);
      if (onAvatarReady) {
        onAvatarReady();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onAvatarReady]);

  const getStatusMessage = () => {
    if (!isReady) return 'Initializing...';
    if (isListening) return 'Listening...';
    if (isSpeaking) return 'Speaking...';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (!isReady) return 'text-gray-400';
    if (isListening) return 'text-blue-500';
    if (isSpeaking) return 'text-green-500';
    return 'text-purple-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full p-6"
    >
      {/* Avatar Container */}
      <div className="relative">
        <div className="w-[270px] h-[480px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl overflow-hidden">
          <iframe
            src={avatarUrl}
            className="w-full h-full"
            title="HeyGen Avatar"
            allow="camera; microphone; autoplay"
            style={{ border: 'none' }}
          />
        </div>
        
        {/* Status Indicator */}
        <motion.div
          animate={{ scale: isListening || isSpeaking ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: isListening || isSpeaking ? Infinity : 0, duration: 1.5 }}
          className="absolute -top-2 -right-2"
        >
          <div className={cn(
            "w-4 h-4 rounded-full",
            isReady ? "bg-green-500" : "bg-gray-400"
          )} />
        </motion.div>
      </div>

      {/* Avatar Info */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ellie
        </h3>
        <p className={cn("text-sm mt-1 font-medium", getStatusColor())}>
          {getStatusMessage()}
        </p>
      </div>
    </motion.div>
  );
};

// Import cn utility
import { cn } from '../lib/utils';

export default HeyGenAvatar;
