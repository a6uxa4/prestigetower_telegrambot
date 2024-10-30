const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./public/swagger.json");

const SubmissionsRoute = require("./routes/submissions.route");
const initBot = require("./controllers/bot");

dotenv.config();
const app = express();
const bot = initBot();

global.bot = bot;

// Запуск бота
bot
  .launch()
  .then(() => {
    console.log("Telegram bot is running...");
  })
  .catch((err) => {
    console.error("Failed to start the bot:", err);
  });

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.use(
  cors({
    origin: ["http://localhost:3000", "https://prestigetower.kg"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ROUTE
app.use("/submissions", SubmissionsRoute);

// SWAGGER
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

mongoose.set("debug", true);
