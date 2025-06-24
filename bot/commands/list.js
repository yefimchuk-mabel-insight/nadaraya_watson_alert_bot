import { listPairs } from '../../services/tracker.js';

export const listCommand = () => (ctx) => {
    const tracked = listPairs();
    const msg = tracked.length ? `📊 Tracking: ${tracked.join(', ')}` : '📊 No pairs tracked.';
    ctx.reply(msg);
};
