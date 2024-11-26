export function throttle<T extends unknown[], R>(
  func: (...args: T) => R,
  duration: number,
) {
  let throttled = false;

  return (...args: T) => {
    if (throttled) return;

    func(...args);
    throttled = true;

    setTimeout(() => {
      throttled = false;
    }, duration);
  };
}
