import { Telegraf, Markup } from "telegraf";
import firebase from "firebase";
// import "firebase/analytics";
import * as dotenv from "dotenv";
import cron from "node-cron";
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

type Auction = {
  bid: number;
  chatId: string;
  endDate: number;
};

const database = firebase.database();
let auctions: {
  [key: string]: Auction;
};

database.ref("auctions").on("value", (snapshot) => {
  const data = snapshot.val() as Object;
  auctions = data as {
    [key: string]: Auction;
  };
  console.log(auctions);
});

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
bot.command("auction", (ctx) => {
  ctx.reply("Starting auction!");
  const newAuctionRef = database.ref(`auctions`).push();
  newAuctionRef.set({
    endDate: new Date().getTime(),
    chatId: ctx.chat.id,
    bid: 0.123,
  });
});

bot.on("message", (ctx) =>
  ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard)
);
bot.action("delete", (ctx) => ctx.deleteMessage());

bot.launch().then(() => {
  console.log("Started bot");
});

const checkCompletedAuctions = () => {
  // This doesn't cause a multi-access error cause the
  // keys array is a new obj... idk if that's bad code tho lol
  Object.keys(auctions).forEach((auctionId) => {
    const auction = { ...auctions[auctionId] };
    if (auction.endDate < new Date().getTime()) {
      const auctionRef = database.ref(`auctions/${auctionId}`);
      auctionRef.remove();
      bot.telegram.sendMessage(auction.chatId, "Auction ended!");
    }
  });
};

cron.schedule("* * * * *", checkCompletedAuctions);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
