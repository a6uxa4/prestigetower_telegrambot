const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
const { Submissions } = require("../models/submissions.model"); // Исправленный путь

dotenv.config();

const initBot = () => {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  // Команда start
  bot.command("start", (ctx) => {
    ctx.reply(
      "Привет! Я бот для управления заявками.\n\n" +
        "Доступные команды:\n" +
        "/submissions - показать все заявки\n" +
        "/help - показать справку"
    );
  });

  // Команда help
  bot.command("help", (ctx) => {
    ctx.reply(
      "Список команд:\n" +
        "/submissions - показать все заявки\n" +
        "/help - показать это сообщение\n\n" +
        "При поступлении новой заявки я автоматически отправлю уведомление в группу."
    );
  });

  bot.command("submissions", async (ctx) => {
    try {
      const submissions = await Submissions.find({});

      if (submissions.length === 0) {
        await ctx.reply("Нет заявок.");
        return;
      }

      const submissionsList = submissions
        .map(
          (submission) =>
            `ID: ${submission.submissionsId}  ✅\n` +
            `--------------------\n` +
            `🏢 Офис: ${submission.officeNumber} \n\n` +
            `🏢 Этаж: ${submission.floorNumber} \n\n` +
            `👤 Имя: ${submission.userName} \n\n` +
            `📞 Телефон: ${submission.phoneNumber} \n` +
            `--------------------`
        )
        .join("\n");

      await ctx.reply(`📋 Список заявок:\n\n${submissionsList}`);
    } catch (error) {
      console.error(error);
      await ctx.reply("❌ Произошла ошибка при получении заявок.");
    }
  });

  return bot;
};

module.exports = initBot;
