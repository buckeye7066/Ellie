// Memory Entity Schema
export class Memory {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.content = data.content || '';
    this.source = data.source || 'chat'; // 'chat' | 'document' | 'voice' | 'import'
    this.tags = data.tags || [];
    this.importance = data.importance || 5; // 1-10
    this.context = data.context || '';
    this.embedding = data.embedding || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static validate(data) {
    if (!data.content) {
      throw new Error('Memory content is required');
    }
    if (!['chat', 'document', 'voice', 'import'].includes(data.source)) {
      throw new Error('Invalid memory source');
    }
    if (data.importance && (data.importance < 1 || data.importance > 10)) {
      throw new Error('Importance must be between 1 and 10');
    }
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      source: this.source,
      tags: this.tags,
      importance: this.importance,
      context: this.context,
      embedding: this.embedding,
      createdAt: this.createdAt,
    };
  }
}

// Storage helpers for localStorage
export const MemoryStorage = {
  getAll: () => {
    const data = localStorage.getItem('memories');
    if (!data) return [];
    return JSON.parse(data).map(m => new Memory(m));
  },

  getById: (id) => {
    const memories = MemoryStorage.getAll();
    return memories.find(m => m.id === id);
  },

  save: (memory) => {
    Memory.validate(memory);
    const memories = MemoryStorage.getAll();
    const existingIndex = memories.findIndex(m => m.id === memory.id);
    
    if (existingIndex >= 0) {
      memories[existingIndex] = new Memory(memory);
    } else {
      memories.push(new Memory(memory));
    }
    
    localStorage.setItem('memories', JSON.stringify(memories.map(m => m.toJSON())));
    return memory;
  },

  delete: (id) => {
    const memories = MemoryStorage.getAll();
    const filtered = memories.filter(m => m.id !== id);
    localStorage.setItem('memories', JSON.stringify(filtered.map(m => m.toJSON())));
  },

  clear: () => {
    localStorage.removeItem('memories');
  },

  search: (query, field = 'content') => {
    const memories = MemoryStorage.getAll();
    const lowerQuery = query.toLowerCase();
    return memories.filter(m => 
      m[field]?.toLowerCase().includes(lowerQuery)
    );
  },

  filterByTags: (tags) => {
    const memories = MemoryStorage.getAll();
    return memories.filter(m => 
      tags.some(tag => m.tags.includes(tag))
    );
  },

  filterByImportance: (min, max) => {
    const memories = MemoryStorage.getAll();
    return memories.filter(m => 
      m.importance >= min && m.importance <= max
    );
  }
};
