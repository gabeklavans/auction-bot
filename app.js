"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var dotenv = __importStar(require("dotenv"));
dotenv.config();
if (process.env.BOT_TOKEN === undefined) {
    throw new TypeError('BOT_TOKEN must be provided!');
}
var keyboard = telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.button.url("❤️", "http://telegraf.js.org"),
    telegraf_1.Markup.button.callback("Delete", "delete"),
]);
var bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start(function (ctx) { return ctx.reply("Hello"); });
bot.help(function (ctx) { return ctx.reply("Help message"); });
bot.on("message", function (ctx) {
    return ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard);
});
bot.action("delete", function (ctx) { return ctx.deleteMessage(); });
bot.launch();
// Enable graceful stop
process.once("SIGINT", function () { return bot.stop("SIGINT"); });
process.once("SIGTERM", function () { return bot.stop("SIGTERM"); });
