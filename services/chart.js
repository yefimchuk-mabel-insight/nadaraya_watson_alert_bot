import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.resolve(__dirname, '../templates/chart_template.html');
const OUTPUT_PATH = path.resolve(__dirname, '../assets/chart.png');

export async function generateChartOHLC(ohlc, title = 'Chart') {
    const html = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluate((ohlcData, chartTitle) => {
        window.renderChart(ohlcData, chartTitle);
    }, ohlc, title);

    await page.waitForSelector('#chart-ready');
    const chartElement = await page.$('#container');
    await chartElement.screenshot({ path: OUTPUT_PATH });

    await browser.close();
    return OUTPUT_PATH;
}
