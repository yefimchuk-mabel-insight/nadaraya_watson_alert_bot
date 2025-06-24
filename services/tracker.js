import fetch from 'node-fetch';
import { TIMEFRAME, SMOOTHING } from '../config/index.js';
import { sendChartImage } from './utils.js';
import { nadarayaWatson, detectCross } from './nadaraya.js';
import { generateChartOHLC } from './chart.js';

let trackedSymbols = [];
const lastSignals = {};

export function addPair(symbol) {
  if (!trackedSymbols.includes(symbol)) trackedSymbols.push(symbol);
}

export function removePair(symbol) {
  trackedSymbols = trackedSymbols.filter(s => s !== symbol);
  delete lastSignals[symbol];
}

export function listPairs() {
  return [...trackedSymbols];
}

export async function isValidSymbol(symbol) {
  try {
    const res = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
    const data = await res.json();
    return data.result.list.some(i => i.symbol === symbol);
  } catch {
    return false;
  }
}

async function fetchCandles(symbol, limit = 100) {
  const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${TIMEFRAME}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result.list
      .map(row => ({
        time: Math.floor(row[0] / 1000),
        o: parseFloat(row[1]),
        h: parseFloat(row[2]),
        l: parseFloat(row[3]),
        c: parseFloat(row[4]),
      }))
      .sort((a, b) => a.time - b.time);
}

export async function checkPairsLoop() {
  for (const symbol of trackedSymbols) {
    try {
      const candles = await fetchCandles(symbol);

      if (!candles.length) {
        console.warn(`⚠️ No candle data for ${symbol}`);
        continue;
      }

      const closes = candles.map(c => c.c);
      const x = candles.map((_, i) => i);
      const smoothed = nadarayaWatson(x, closes, SMOOTHING);
      const signal = detectCross(closes, smoothed);

      if (signal && lastSignals[symbol] !== signal) {
        lastSignals[symbol] = signal;

        const caption = `${symbol} signal: ${signal.toUpperCase()}`;
        const preview = candles.slice(-3);
        console.log(`📈 ${symbol} OHLC preview:`, preview);

        const filename = await generateChartOHLC(candles, symbol);
        await sendChartImage(filename, caption);
      }
    } catch (err) {
      console.error(`❌ ${symbol} error:`, err.message);
    }
  }
}
