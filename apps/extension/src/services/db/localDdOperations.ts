export const setChromeLocal = async (
  { key, value }: { key: string; value: unknown }
) => {
  await chrome.storage.local.set({
    [key]: value,
  });
};

export const getChromeLocal = async (key: string) => {
  const result = await chrome.storage.local.get(key);
  return result[key];
}