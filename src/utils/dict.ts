import { resolve } from 'path';

import { DICTS_DIR } from './consts';

export const getDict = (name: string) => resolve(DICTS_DIR, `${name}.txt`);
