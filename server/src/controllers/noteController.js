// Note controller — full implementation in Week 3

const getAllNotes = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getAllNotes — to be implemented in Week 3.' });
};

const createNote = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'createNote — to be implemented in Week 3.' });
};

const getNoteById = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getNoteById — to be implemented in Week 3.' });
};

const updateNote = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'updateNote — to be implemented in Week 3.' });
};

const deleteNote = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'deleteNote — to be implemented in Week 3.' });
};

module.exports = { getAllNotes, createNote, getNoteById, updateNote, deleteNote };
