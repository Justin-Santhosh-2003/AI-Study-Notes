// Flashcard controller — full implementation in Week 3

const getFlashcardsByNote = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getFlashcardsByNote — to be implemented in Week 3.' });
};

const saveFlashcardSet = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'saveFlashcardSet — to be implemented in Week 3.' });
};

const deleteFlashcardSet = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'deleteFlashcardSet — to be implemented in Week 3.' });
};

module.exports = { getFlashcardsByNote, saveFlashcardSet, deleteFlashcardSet };
