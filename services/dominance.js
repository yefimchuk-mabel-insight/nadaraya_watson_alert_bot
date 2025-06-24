import puppeteer from 'puppeteer';
import { nadarayaWatson, detectCross } from './nadaraya.js';
import { generateChartOHLC } from './chart.js';
import { sendChartImage } from './utils.js';
import { SMOOTHING } from '../config/index.js';

let history = [];
let lastSignal = null;

export async function fetchBTCdominance() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.tradingview.com/symbols/CRYPTOCAP-BTC.D/', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('.last-zoF9r75I.js-symbol-last', { timeout: 15000 });

    const value = await page.$eval('.last-zoF9r75I.js-symbol-last', el => el.innerText.trim());
    
    const numeric = parseFloat(value.replace('%', ''));
    if (isNaN(numeric)) throw new Error('Parsed BTC dominance is NaN');

    return numeric;
  } finally {
    await browser.close();
  }
}

export async function checkDominanceLoop() {
  try {
    const dominance = await fetchBTCdominance();
    history.push(dominance);
    if (history.length > 288) history.shift();
    if (history.length < 20) return;

    const x = history.map((_, i) => i);
    const smooth = nadarayaWatson(x, history, SMOOTHING);
    const signal = detectCross(history, smooth);

    if (signal && signal !== lastSignal) {
      lastSignal = signal;



      const now = Math.floor(Date.now() / 1000);
      const step = 4 * 60 * 60; // 4h
      const ohlc = history.map((v, i) => ({
        time: now - (history.length - i) * step,
        o: v,
        h: v,
        l: v,
        c: v,
      }));

      const filename = await generateChartOHLC(ohlc, 'BTC Dominance');
      await sendChartImage(filename, `BTC Dominance signal: ${signal.toUpperCase()}\n🧠`);
    }
  } catch (err) {
    console.error('Dominance loop error:', err.message);
  }
}
