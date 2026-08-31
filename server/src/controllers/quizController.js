// Quiz controller — full implementation in Week 3

const getQuizzesByNote = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getQuizzesByNote — to be implemented in Week 3.' });
};

const saveQuiz = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'saveQuiz — to be implemented in Week 3.' });
};

const getQuizById = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getQuizById — to be implemented in Week 3.' });
};

module.exports = { getQuizzesByNote, saveQuiz, getQuizById };
