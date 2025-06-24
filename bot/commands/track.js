import { addPair, isValidSymbol } from '../../services/tracker.js';

export const trackCommand = () => async (ctx) => {
    const [, rawSymbol] = ctx.message.text.trim().split(/\s+/);
    if (!rawSymbol) return ctx.reply('Usage: /track SYMBOL (e.g., BTCUSDT)');

    const symbol = rawSymbol.toUpperCase();
    if (!(await isValidSymbol(symbol)))
        return ctx.reply(`❌ Symbol ${symbol} not found on Bybit`);

    addPair(symbol);
    ctx.reply(`✅ Tracking ${symbol}`);
};
