"use strict";

const Telegraf = require("telegraf");
const { Markup } = require("telegraf");
const fetch = require("node-fetch");

const config = require("./config");
const dataService = require("./dataService");

const bot = new Telegraf(config.botToken);

const helpMsg = `Riepilogo comandi:
/start - Avvia il bot
/help - Mostra questa pagina di aiuto
/about - Mostra informazioni sul bot`;

const inputErrMsg = "ðŸ’¥ BOOM... ðŸ”©â˜ ðŸ”§ðŸ”¨âš¡ï¸\nNO!";

const aboutMsg =
  "Questo bot è stato creato da Marco solo per divertimento. \nIl codice sorgente sarà presto disponibile. \nRingrazio chi ha reso disponibile le API qui utilizzate yesno.wtf";

const site = "https://yesno.wtf/api";
const cmd_8ball = "🎱";

const keybord = Markup.keyboard([
  [cmd_8ball], // Row1 with 1 buttons
])
  .oneTime()
  .resize()
  .extra();

//get username for group command handling
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
  console.log("Initialized", botInfo.username);
});

bot.command("start", (ctx) => {
  dataService.registerUser(ctx);
  var m = "Ciao :) \ndigita /help per scoprire come usarmi ;)";
  ctx.reply(m, keybord);
  setTimeout(() => {
    ctx.reply(0);
  }, 50); //workaround to send this message definitely as second message
});

bot.command("stop", (ctx) => {
  var m = "Giuro, ci sto provando! (¬_¬)";
  ctx.reply(m, keybord);
});

bot.command("help", (ctx) => {
  ctx.reply(helpMsg, keybord);
});

bot.command("about", (ctx) => {
  ctx.reply(aboutMsg, keybord);
});

bot.hears(cmd_8ball, (ctx) => {
  fetch(site)
    .then((response) => response.json())
    .then((data) => {
      console.log("Hi");
      ctx.replyWithAnimation(data.image, keybord);
    })
    .catch((err) => {
      console.log(err), ctx.reply(inputErrMsg, keybord);
    });
});

// --------------------- AWS Lambda handler function ---------------------------------------------------------------- //
// https://github.com/telegraf/telegraf/issues/129
exports.handler = (event, context, callback) => {
  bot.handleUpdate(JSON.parse(event.body)); // make Telegraf process that data
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: "OK" }),
  });
};
