// StudyCard Entity Schema
export class StudyCard {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.question = data.question || '';
    this.answer = data.answer || '';
    this.category = data.category || '';
    this.difficulty = data.difficulty || 3; // 1-5
    this.last_reviewed = data.last_reviewed || null;
    this.next_review = data.next_review || new Date().toISOString();
    this.review_count = data.review_count || 0;
    this.success_rate = data.success_rate || 0; // 0-100
  }

  static validate(data) {
    if (!data.question) {
      throw new Error('Question is required');
    }
    if (!data.answer) {
      throw new Error('Answer is required');
    }
    if (data.difficulty && (data.difficulty < 1 || data.difficulty > 5)) {
      throw new Error('Difficulty must be between 1 and 5');
    }
    if (data.success_rate && (data.success_rate < 0 || data.success_rate > 100)) {
      throw new Error('Success rate must be between 0 and 100');
    }
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      question: this.question,
      answer: this.answer,
      category: this.category,
      difficulty: this.difficulty,
      last_reviewed: this.last_reviewed,
      next_review: this.next_review,
      review_count: this.review_count,
      success_rate: this.success_rate,
    };
  }

  // Spaced repetition algorithm
  updateAfterReview(isCorrect) {
    this.review_count += 1;
    this.last_reviewed = new Date().toISOString();
    
    // Update success rate
    const previousTotal = this.success_rate * (this.review_count - 1);
    this.success_rate = Math.round((previousTotal + (isCorrect ? 100 : 0)) / this.review_count);
    
    // Calculate next review date using spaced repetition
    const now = new Date();
    let daysToAdd;
    
    if (isCorrect) {
      // Exponential spacing: 1, 2, 4, 8, 16, 30 (max 30 days)
      daysToAdd = Math.min(Math.pow(2, Math.min(this.review_count - 1, 4)), 30);
    } else {
      // Reset to 1 day on incorrect
      daysToAdd = 1;
    }
    
    now.setDate(now.getDate() + daysToAdd);
    this.next_review = now.toISOString();
    
    return this;
  }

  isDueForReview() {
    return new Date(this.next_review) <= new Date();
  }
}

// Storage helpers for localStorage
export const StudyCardStorage = {
  getAll: () => {
    const data = localStorage.getItem('studyCards');
    if (!data) return [];
    return JSON.parse(data).map(c => new StudyCard(c));
  },

  getById: (id) => {
    const cards = StudyCardStorage.getAll();
    return cards.find(c => c.id === id);
  },

  save: (card) => {
    StudyCard.validate(card);
    const cards = StudyCardStorage.getAll();
    const existingIndex = cards.findIndex(c => c.id === card.id);
    
    if (existingIndex >= 0) {
      cards[existingIndex] = new StudyCard(card);
    } else {
      cards.push(new StudyCard(card));
    }
    
    localStorage.setItem('studyCards', JSON.stringify(cards.map(c => c.toJSON())));
    return card;
  },

  delete: (id) => {
    const cards = StudyCardStorage.getAll();
    const filtered = cards.filter(c => c.id !== id);
    localStorage.setItem('studyCards', JSON.stringify(filtered.map(c => c.toJSON())));
  },

  clear: () => {
    localStorage.removeItem('studyCards');
  },

  getDueCards: () => {
    const cards = StudyCardStorage.getAll();
    return cards.filter(c => c.isDueForReview()).sort((a, b) => 
      new Date(a.next_review) - new Date(b.next_review)
    );
  },

  getByCategory: (category) => {
    const cards = StudyCardStorage.getAll();
    return cards.filter(c => c.category === category);
  },

  getCategories: () => {
    const cards = StudyCardStorage.getAll();
    return [...new Set(cards.map(c => c.category).filter(Boolean))];
  }
};
