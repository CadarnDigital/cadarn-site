import { useReducedMotion } from 'framer-motion';

export const EVALUATION_MODE = true;

export const useSkipMotion = (): boolean => {
  const reduced = useReducedMotion();
  return Boolean(reduced) && !EVALUATION_MODE;
};
