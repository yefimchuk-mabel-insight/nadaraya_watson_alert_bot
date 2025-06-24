import { checkPairsLoop } from '../services/tracker.js';
import { checkDominanceLoop } from '../services/dominance.js';

export function startLoops() {
    setInterval(checkPairsLoop, 60_000);
    setInterval(checkDominanceLoop, 900_000);

}
