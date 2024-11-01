const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
const { Submissions } = require("../models/submissions.model");

dotenv.config();

const initBot = () => {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  const authorizedUsers = [];

  bot.command("start", (ctx) => {
    ctx.reply(
      "Привет! Я бот для управления заявками.\n\n" +
        "Доступные команды:\n" +
        "/submissions - показать все заявки (только после авторизации)\n" +
        "/authorize - ввести код для доступа\n" +
        "/help - показать справку"
    );
  });

  bot.command("authorize", (ctx) => {
    const [_, code] = ctx.message.text.split(" ");
    if (code === "7789") {
      if (!authorizedUsers.includes(ctx.from.id)) {
        authorizedUsers.push(ctx.from.id);
        ctx.reply(
          "Вы успешно авторизованы и теперь можете использовать команду /submissions."
        );
      } else {
        ctx.reply("Вы уже авторизованы.");
      }
    } else {
      ctx.reply("Неверный код. Пожалуйста, попробуйте снова.");
    }
  });

  bot.command("help", (ctx) => {
    ctx.reply(
      "Список команд:\n" +
        "/submissions - показать все заявки (только после авторизации)\n" +
        "/authorize - ввести код для доступа\n" +
        "/help - показать это сообщение\n\n" +
        "При поступлении новой заявки я автоматически отправлю уведомление в группу."
    );
  });

  bot.command("submissions", async (ctx) => {
    if (!authorizedUsers.includes(ctx.from.id)) {
      return ctx.reply(
        "❌ У вас нет доступа. Пожалуйста, используйте команду /authorize и введите код."
      );
    }

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
