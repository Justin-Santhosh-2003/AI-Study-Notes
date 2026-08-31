// Subject controller — full implementation in Week 3

const getAllSubjects = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'getAllSubjects — to be implemented in Week 3.' });
};

const createSubject = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'createSubject — to be implemented in Week 3.' });
};

const updateSubject = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'updateSubject — to be implemented in Week 3.' });
};

const deleteSubject = async (req, res) => {
  res.status(200).json({ status: 'success', message: 'deleteSubject — to be implemented in Week 3.' });
};

module.exports = { getAllSubjects, createSubject, updateSubject, deleteSubject };
