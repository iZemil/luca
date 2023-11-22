import chalk from 'chalk';
import { resolve } from 'path';

import { luca } from '../core';
import { LUCA_LOG_PATH } from '../core/write';
import { DICT_NAMES, getDict, ifSuccessResponse, log } from '../utils';

import { WORD_PATTERN } from './common';

// [x] Github username
// [x] Npm package
// [ ] Telegram username/botname
// [ ] Whois small size domains

const formatUrl = (urlMask: string) => {
    if (!['http', 'https'].includes(urlMask)) {
        return `https://${urlMask}`;
    }

    return urlMask;
};

const getUrlByMask = (urlMask: string) => (word: string) => {
    const formatted = formatUrl(urlMask);

    if (formatted.includes(WORD_PATTERN)) {
        return formatted.replace(WORD_PATTERN, word);
    }

    return `${formatted}/${word}`;
};

export const run = (dict: string, urlMask: string) => {
    const isBuiltInDict = DICT_NAMES.includes(dict);
    const dictPath = isBuiltInDict ? getDict(dict) : resolve(dict);

    luca(dictPath, getUrlByMask(urlMask)).subscribe({
        next: ({ res }) => log(`${ifSuccessResponse(res.status, chalk.green, chalk.red)} ${res.config.url}`)(),
        complete: log(`\n${chalk.green('Luca finished')} ${resolve(LUCA_LOG_PATH)}`),
    });
};
