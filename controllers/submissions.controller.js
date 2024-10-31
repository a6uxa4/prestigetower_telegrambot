const { Submissions } = require("../models/submissions.model");

const AddSubmissions = async (req, res, next) => {
  try {
    const { officeNumber, userName, phoneNumber, floorNumber } = req.body;

    if (!officeNumber || !userName || !phoneNumber || !floorNumber) {
      return res.status(400).json({ error: "Заполните все поля !" });
    }

    let applicationText = floorNumber === 0 ? "Консультация" : floorNumber;
    let officeText = officeNumber === 0 ? "Консультация" : `№${officeNumber}`;

    const newSubmission = new Submissions({
      officeNumber: officeText,
      userName,
      phoneNumber,
      floorNumber: applicationText,
      officeText,
    });

    await newSubmission.save();

    try {
      await global.bot.telegram.sendMessage(
        process.env.GROUP_CHAT_ID,
        `✅ Новая заявка:\n` +
          `--------------------\n` +
          ` 🏢 Этаж: ${applicationText} \n\n` +
          ` 🏢 Офис: ${officeText} \n\n` +
          ` 👤 Имя: ${userName} \n\n` +
          ` 📞 Телефон: ${phoneNumber} \n` +
          `--------------------`
      );
      console.log("Сообщение успешно отправлено в Telegram");
    } catch (telegramError) {
      console.error("Ошибка отправки сообщения в Telegram:", telegramError);
    }

    res
      .status(200)
      .json({ message: "Успешно оставили заявку !", newSubmission });
  } catch (error) {
    next(error);
  }
};

module.exports = { AddSubmissions };
