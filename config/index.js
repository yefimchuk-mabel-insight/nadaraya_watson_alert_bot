import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name) {
    const value = process.env[name];
    if (!value) throw new Error(`❌ Missing required environment variable: ${name}`);
    return value;
}

export const TELEGRAM_TOKEN = requireEnv('TELEGRAM_TOKEN');
export const CHAT_ID = requireEnv('CHAT_ID');

export const TIMEFRAME = parseInt(process.env.TIMEFRAME || '240', 10); // 4h by default
export const SMOOTHING = parseFloat(process.env.SMOOTHING || '5');    // Nadaraya bandwidth
export const DOMINANCE_HIGH = parseFloat(process.env.DOMINANCE_HIGH || '55');
export const DOMINANCE_LOW = parseFloat(process.env.DOMINANCE_LOW || '50');
