// Progress controller — full implementation in Week 3

const submitQuizAttempt = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'submitQuizAttempt — to be implemented in Week 3.' });
};

const getProgressStats = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getProgressStats — to be implemented in Week 3.' });
};

module.exports = { submitQuizAttempt, getProgressStats };
