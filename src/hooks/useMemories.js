import { useState, useEffect, useCallback } from 'react';
import { MemoryStorage } from '../entities/Memory';

export const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load memories from storage
  const loadMemories = useCallback(() => {
    setIsLoading(true);
    const loaded = MemoryStorage.getAll();
    setMemories(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  // Add or update a memory
  const saveMemory = useCallback((memoryData) => {
    const saved = MemoryStorage.save(memoryData);
    loadMemories();
    return saved;
  }, [loadMemories]);

  // Delete a memory
  const deleteMemory = useCallback((id) => {
    MemoryStorage.delete(id);
    loadMemories();
  }, [loadMemories]);

  // Search memories
  const searchMemories = useCallback((query, field = 'content') => {
    return MemoryStorage.search(query, field);
  }, []);

  // Filter by tags
  const filterByTags = useCallback((tags) => {
    return MemoryStorage.filterByTags(tags);
  }, []);

  // Filter by importance
  const filterByImportance = useCallback((min, max) => {
    return MemoryStorage.filterByImportance(min, max);
  }, []);

  // Get all unique tags
  const getAllTags = useCallback(() => {
    const allTags = new Set();
    memories.forEach(memory => {
      memory.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [memories]);

  return {
    memories,
    isLoading,
    saveMemory,
    deleteMemory,
    searchMemories,
    filterByTags,
    filterByImportance,
    getAllTags,
    refreshMemories: loadMemories,
  };
};
