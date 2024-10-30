const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("submissions", async (ctx) => {
  try {
    const { Submissions } = require("../models/submissions.model");
    const submissions = await Submissions.find({});

    if (submissions.length === 0) {
      ctx.reply("Нет заявок.");
      return;
    }

    const submissionsList = submissions
      .map(
        (submission) =>
          `ID: ${submission.submissionsId}, Офис: ${submission.officeNumber}, Этаж: ${submission.floorNumber}, Имя: ${submission.userName}, Телефон: ${submission.phoneNumber}`
      )
      .join("\n");

    ctx.reply(`Заявки:\n${submissionsList}`);
  } catch (error) {
    console.error(error);
    ctx.reply("Произошла ошибка при получении заявок.");
  }
});

// Запуск бота
bot
  .launch()
  .then(() => {
    console.log("Telegram bot is running...");
  })
  .catch((err) => {
    console.error("Failed to start the bot:", err);
  });

module.exports = bot;
