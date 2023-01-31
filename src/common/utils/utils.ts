export const randomFromArray = <T = any>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export function delay(callback: () => void, ttd: number): NodeJS.Timeout;
export async function delay(ttd: number): Promise<void>;
export function delay(...args: any[]) {
  const [delay = 1000] = args;
  const [callback, ttd = 1000] = args;

  if (typeof callback === 'function') return setTimeout(callback, ttd);

  return new Promise((resolve) => {
    setTimeout(() => resolve(void 0), delay);
  });
}
