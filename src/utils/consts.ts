import { readdirSync } from 'fs';
import { resolve } from 'path';

export const DICTS_DIR = resolve('dicts');

export const DICTS = (() => {
    const files = readdirSync(DICTS_DIR);

    return files;
})();

export const DICT_NAMES = DICTS.map((d) => d.split('.')[0]);
