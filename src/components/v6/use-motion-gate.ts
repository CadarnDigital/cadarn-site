import { useReducedMotion } from 'framer-motion';

/**
 * Modo avaliação da v4.
 *
 * Com EVALUATION_MODE = true, TODOS os componentes de motion da v4 rodam mesmo
 * que Fabiano tenha "reduzir movimento" ligado no Windows/SO — inclusive Lenis,
 * o ritual de abertura, o ticker e a iluminação de texto. Isso garante que ele
 * consiga avaliar a experiência completa.
 *
 * Em PRODUÇÃO, trocar para false: a v4 volta a respeitar a acessibilidade
 * (prefers-reduced-motion desliga os efeitos).
 */
export const EVALUATION_MODE = true;

/**
 * useSkipMotion — fonte única de verdade para "devo pular o movimento?".
 * Retorna true apenas quando o usuário pediu redução de movimento E não estamos
 * em modo avaliação. Todo componente de motion da v4 consome este hook.
 */
export const useSkipMotion = (): boolean => {
  const reduced = useReducedMotion();
  return Boolean(reduced) && !EVALUATION_MODE;
};
