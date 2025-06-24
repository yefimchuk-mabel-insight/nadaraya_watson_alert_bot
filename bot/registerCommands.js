import { startCommand } from './commands/start.js';
import { trackCommand } from './commands/track.js';
import { untrackCommand } from './commands/untrack.js';
import { listCommand } from './commands/list.js';

export function registerCommands(bot) {
    bot.command('start', startCommand());
    bot.command('track', trackCommand());
    bot.command('untrack', untrackCommand());
    bot.command('list', listCommand());
}
