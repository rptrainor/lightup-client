export function readFromLocalStorage<T>(key: string, defaultValue: T): T {
  const storedValue = localStorage.getItem(key);
  const storedTimestamp = localStorage.getItem(`${key}_timestamp`);
  const expiresInDays = 30;

  if (!storedValue || !storedTimestamp) return defaultValue;

  const currentTime = new Date().getTime();
  const expirationTime = new Date(Number(storedTimestamp)).getTime() + expiresInDays * 24 * 60 * 60 * 1000;

  if (currentTime > expirationTime) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
    return defaultValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch (e) {
    return defaultValue;
  }
}