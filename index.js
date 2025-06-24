import { Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN } from './config/index.js';
import { registerCommands } from './bot/registerCommands.js';
import { startLoops } from './bot/loops.js';

const bot = new Telegraf(TELEGRAM_TOKEN);

registerCommands(bot);
bot.launch().then(() => console.log('✅ Bot started.'));

startLoops();
