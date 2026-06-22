const LOCK_EVENT = 'cadarn:lenis-lock';
const UNLOCK_EVENT = 'cadarn:lenis-unlock';

export const lockScroll = (): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.overflow = 'hidden';
  window.dispatchEvent(new Event(LOCK_EVENT));
};

export const unlockScroll = (): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.overflow = '';
  window.dispatchEvent(new Event(UNLOCK_EVENT));
};

export const subscribeLenisLock = (onLock: () => void, onUnlock: () => void): (() => void) => {
  window.addEventListener(LOCK_EVENT, onLock);
  window.addEventListener(UNLOCK_EVENT, onUnlock);
  return () => {
    window.removeEventListener(LOCK_EVENT, onLock);
    window.removeEventListener(UNLOCK_EVENT, onUnlock);
  };
};
