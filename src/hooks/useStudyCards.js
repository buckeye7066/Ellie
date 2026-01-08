import { useState, useEffect, useCallback } from 'react';
import { StudyCardStorage } from '../entities/StudyCard';

export const useStudyCards = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cards from storage
  const loadCards = useCallback(() => {
    setIsLoading(true);
    const loaded = StudyCardStorage.getAll();
    setCards(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Add or update a card
  const saveCard = useCallback((cardData) => {
    const saved = StudyCardStorage.save(cardData);
    loadCards();
    return saved;
  }, [loadCards]);

  // Delete a card
  const deleteCard = useCallback((id) => {
    StudyCardStorage.delete(id);
    loadCards();
  }, [loadCards]);

  // Get due cards
  const getDueCards = useCallback(() => {
    return StudyCardStorage.getDueCards();
  }, []);

  // Get cards by category
  const getByCategory = useCallback((category) => {
    return StudyCardStorage.getByCategory(category);
  }, []);

  // Get all categories
  const getCategories = useCallback(() => {
    return StudyCardStorage.getCategories();
  }, []);

  // Update card after review
  const reviewCard = useCallback((cardId, isCorrect) => {
    const card = StudyCardStorage.getById(cardId);
    if (card) {
      card.updateAfterReview(isCorrect);
      StudyCardStorage.save(card);
      loadCards();
    }
  }, [loadCards]);

  return {
    cards,
    isLoading,
    saveCard,
    deleteCard,
    getDueCards,
    getByCategory,
    getCategories,
    reviewCard,
    refreshCards: loadCards,
  };
};
