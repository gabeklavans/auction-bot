import { Telegraf, Markup } from "telegraf";
import firebase from "firebase"
import "firebase/analytics"
import "firebase/database"
import * as dotenv from "dotenv";
dotenv.config();

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError("BOT_TOKEN must be provided!");
}

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
  projectId: process.env.PROJECT_ID,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

const keyboard = Markup.inlineKeyboard([
  Markup.button.url("❤️", "http://telegraf.js.org"),
  Markup.button.callback("Delete", "delete"),
]);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Hello"));
bot.help((ctx) => ctx.reply("Help message"));
bot.command("timer", (ctx) => {
  ctx.reply("Starting timer!");
  setTimeout(() => {
    ctx.reply("Timer done!");
  }, 3000);
});
bot.on("message", (ctx) =>
  ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard)
);
bot.action("delete", (ctx) => ctx.deleteMessage());

bot.launch();
console.log("Started bot");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
