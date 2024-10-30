const { Submissions } = require("../models/submissions.model");

const AddSubmissions = async (req, res, next) => {
  try {
    const { submissionsId, officeNumber, userName, phoneNumber } = req.body;

    if (!submissionsId || !officeNumber || !userName || !phoneNumber) {
      return res.status(400).json({ error: "Заполните все поля !" });
    }

    const newSubmission = new Submissions({
      submissionsId,
      officeNumber,
      userName,
      phoneNumber,
    });

    await newSubmission.save();
    res
      .status(200)
      .json({ message: "Успешно оставили заявку !", newSubmission });
  } catch (error) {
    next(error);
  }
};

module.exports = { AddSubmissions };
