import { removePair } from '../../services/tracker.js';

export const untrackCommand = () => (ctx) => {
    const [, rawSymbol] = ctx.message.text.trim().split(/\s+/);
    if (!rawSymbol) return ctx.reply('Usage: /untrack SYMBOL');

    const symbol = rawSymbol.toUpperCase();
    removePair(symbol);
    ctx.reply(`❌ Untracked ${symbol}`);
};
