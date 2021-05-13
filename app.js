"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var dotenv = require("dot-env");
// if (process.env.BOT_TOKEN === undefined) {
//   throw new TypeError('BOT_TOKEN must be provided!')
// }
var keyboard = telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.button.url('❤️', 'http://telegraf.js.org'),
    telegraf_1.Markup.button.callback('Delete', 'delete')
]);
var bot_tok = "1878804532:AAFxT9Y8DyCD3A2eXIDNEM6M85URFByiSRo";
var bot = new telegraf_1.Telegraf(bot_tok);
bot.start(function (ctx) { return ctx.reply('Hello'); });
bot.help(function (ctx) { return ctx.reply('Help message'); });
bot.on('message', function (ctx) { return ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard); });
bot.action('delete', function (ctx) { return ctx.deleteMessage(); });
bot.launch();
// Enable graceful stop
process.once('SIGINT', function () { return bot.stop('SIGINT'); });
process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
