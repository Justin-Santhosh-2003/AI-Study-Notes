const mongoose = require('mongoose');

const flashcardSetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Flashcard set title is required'],
      trim: true,
    },
    cards: [
      {
        front: { type: String, required: true },
        back: { type: String, required: true },
      },
    ],
    isAiGenerated: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);
