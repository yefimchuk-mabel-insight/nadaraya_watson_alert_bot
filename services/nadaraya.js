function gaussian(x) {
  return Math.exp(-0.5 * x * x);
}

export function nadarayaWatson(x, y, h) {
  const smoothed = [];
  for (let i = 0; i < x.length; i++) {
    let weightSum = 0;
    let weightedY = 0;
    for (let j = 0; j < x.length; j++) {
      const weight = gaussian((x[i] - x[j]) / h);
      weightSum += weight;
      weightedY += weight * y[j];
    }
    smoothed.push(weightedY / weightSum);
  }
  return smoothed;
}

export function detectCross(prices, smooth) {
  const n = prices.length;
  const prev = prices[n - 2] - smooth[n - 2];
  const curr = prices[n - 1] - smooth[n - 1];
  if (prev < 0 && curr > 0) return 'up';
  if (prev > 0 && curr < 0) return 'down';
  return null;
}

