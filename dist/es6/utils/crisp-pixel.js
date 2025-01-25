const pixelRatio = typeof window !== 'undefined' && window.devicePixelRatio || 1;
export const crispPixel = size => Math.round(size * pixelRatio) / pixelRatio;
export const crispPercentage = function (el, percentage) {
  let dimension = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'x';
  if (el === null) {
    return percentage;
  }
  const origSize = dimension === 'x' ? el.offsetWidth : el.offsetHeight;
  return crispPixel(percentage / 100 * origSize) / origSize * 100;
};
//# sourceMappingURL=crisp-pixel.js.map