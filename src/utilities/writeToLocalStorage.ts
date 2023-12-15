function writeToLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(`${key}_timestamp`, new Date().getTime().toString());
}