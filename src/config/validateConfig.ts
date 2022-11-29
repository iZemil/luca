import { TConfig } from './types';

export const validateConfig = (config: TConfig) => {
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
};
