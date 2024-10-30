const { Submissions } = require("../models/submissions.model");

const AddSubmissions = async (req, res, next) => {
  try {
    const { officeNumber, userName, phoneNumber, floorNumber } = req.body;

    if (!officeNumber || !userName || !phoneNumber || !floorNumber) {
      return res.status(400).json({ error: "Заполните все поля !" });
    }

    let applicationText = floorNumber === 0 ? "Заявка" : `Этаж ${floorNumber}`;
    let officeText = officeNumber === 0 ? "" : `№${officeNumber} офис`;

    const newSubmission = new Submissions({
      officeNumber,
      userName,
      phoneNumber,
      floorNumber,
      applicationText,
      officeText,
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
