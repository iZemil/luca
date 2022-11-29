import { checkPath } from '../utils';

import { CONFIG_PATH } from './consts';
import { TConfig } from './types';

export const openConfig = (): TConfig => {
    if (!checkPath(CONFIG_PATH)) {
        throw new Error(`Config not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(CONFIG_PATH);

    const { baseUrl, items, query, handler } = config;

    if (items.length === 0) {
        throw new Error(`Specify config items, eg: items: ["foo", "bar"]`);
    }
    if (!baseUrl) {
        throw new Error(`Specify config baseUrl`);
    }
    if (!handler) {
        throw new Error(`Specify config handler`);
    }

    return config;
};
