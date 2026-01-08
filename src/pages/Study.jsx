import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useStudyCards } from '../hooks/useStudyCards';
import { cn } from '../lib/utils';

const Study = () => {
  const { cards, reviewCard, getDueCards } = useStudyCards();
  const [dueCards, setDueCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const due = getDueCards();
    setDueCards(due);
  }, [cards, getDueCards]);

  const currentCard = dueCards[currentCardIndex];

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleReview = (isCorrect) => {
    if (!currentCard) return;

    reviewCard(currentCard.id, isCorrect);
    setReviewedCount(prev => prev + 1);
    setShowAnswer(false);

    // Move to next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Refresh due cards after completing all
      const due = getDueCards();
      setDueCards(due);
      setCurrentCardIndex(0);
      setReviewedCount(0);
    }
  };

  const handleReset = () => {
    const due = getDueCards();
    setDueCards(due);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewedCount(0);
  };

  const progress = dueCards.length > 0 ? (reviewedCount / dueCards.length) * 100 : 0;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Study Cards
          </h1>
          <p className="text-gray-600">
            Spaced repetition flashcard system
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{cards.length}</p>
              <p className="text-sm text-gray-600">Total Cards</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-pink-600">{dueCards.length}</p>
              <p className="text-sm text-gray-600">Due for Review</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{reviewedCount}</p>
              <p className="text-sm text-gray-600">Reviewed Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {dueCards.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{reviewedCount} / {dueCards.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Flashcard */}
        {dueCards.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600 mb-4">
                No cards due for review right now. Great job!
              </p>
              {cards.length === 0 && (
                <p className="text-sm text-gray-500">
                  Import some content to create study cards automatically.
                </p>
              )}
            </CardContent>
          </Card>
        ) : currentCard ? (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id + showAnswer}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm min-h-[400px] cursor-pointer hover:shadow-xl transition-all"
                  onClick={handleFlip}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        {currentCard.category && (
                          <Badge variant="secondary">{currentCard.category}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: currentCard.difficulty }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="min-h-[250px] flex flex-col items-center justify-center">
                      <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                        {showAnswer ? 'Answer' : 'Question'}
                      </p>
                      <p className="text-xl text-center text-gray-800 leading-relaxed">
                        {showAnswer ? currentCard.answer : currentCard.question}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-purple-600">
                        {showAnswer ? 'Click to see question' : 'Click to reveal answer'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Review Buttons */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <Button
                  onClick={() => handleReview(false)}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Incorrect
                </Button>
                <Button
                  onClick={() => handleReview(true)}
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Correct
                </Button>
              </motion.div>
            )}

            {/* Card Stats */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-600">Reviews</p>
                    <p className="font-semibold text-purple-600">{currentCard.review_count}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Success Rate</p>
                    <p className="font-semibold text-green-600">{currentCard.success_rate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Review</p>
                    <p className="font-semibold text-blue-600">
                      {new Date(currentCard.next_review).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <div className="text-center">
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Session
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Study;
