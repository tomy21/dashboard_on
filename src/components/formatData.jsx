export function formatData(number) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)} mio`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)} K`;
  } else {
    return number;
  }
}
