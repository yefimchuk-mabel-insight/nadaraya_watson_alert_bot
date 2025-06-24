import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';
import { TELEGRAM_TOKEN, CHAT_ID } from '../config/index.js';

export async function sendMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });
}

export async function sendChartImage(filePath, caption) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;
  const form = new FormData();
  form.append('chat_id', CHAT_ID);
  form.append('caption', caption);
  form.append('photo', fs.createReadStream(filePath));

  await fetch(url, { method: 'POST', body: form });
}
