export const isValidUrl = (value) => {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const ellipsizeMiddle = (text, maxLen = 60) => {
  if (text.length <= maxLen) return text;
  const head = Math.ceil((maxLen - 1) / 2);
  const tail = maxLen - 1 - head;
  return `${text.slice(0, head)}…${text.slice(-tail)}`;
};
