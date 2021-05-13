import { Telegraf, Markup } from 'telegraf'
const dotenv = require("dot-env")

// if (process.env.BOT_TOKEN === undefined) {
//   throw new TypeError('BOT_TOKEN must be provided!')
// }

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('❤️', 'http://telegraf.js.org'),
  Markup.button.callback('Delete', 'delete')
])

const bot_tok = "1878804532:AAFxT9Y8DyCD3A2eXIDNEM6M85URFByiSRo"
const bot = new Telegraf(bot_tok)
bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard))
bot.action('delete', (ctx) => ctx.deleteMessage())
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))