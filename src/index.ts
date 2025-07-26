import { passComponents } from './core/passComponents';
import type { MagicPassOptions } from './types';

export function MagicPass(options: MagicPassOptions) {
  return passComponents(options);
}
