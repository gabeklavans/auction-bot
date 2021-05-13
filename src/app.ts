import { Telegraf, Markup } from "telegraf";
import firebase from "firebase";
// import "firebase/analytics";
import * as dotenv from "dotenv";
const Graceful = require("@ladjs/graceful");
const Bree = require("bree");
const Cabin = require("cabin");
dotenv.config();

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError("BOT_TOKEN must be provided!");
}

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: process.env.PROJECT_ID,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
// database.ref(`users/hewwo`).set({
//   user: `hewwo`,
//   pass: `1234`,
// });

const bree = new Bree({
  logger: new Cabin(),
  jobs: [
    {
      name: "notify",
      cron: "*/1 * * * *",
    },
  ],
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();
bree.start();

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
