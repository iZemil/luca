import { appendFile } from 'fs/promises';

import { log } from '../utils/log';

export const LUCA_LOG_PATH = 'luca.log';

export const writeLog = async (url: string, status: number) =>
    appendFile(LUCA_LOG_PATH, `\n${JSON.stringify({ url, status })}`)
        .then(() => void 1)
        .catch(log('writeLog error'));
