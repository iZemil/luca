import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';

import { delay } from '../utils';

import { getConfigPath, getResultPath } from './consts';
import { TConfig } from './types';
import { validateConfig } from './validateConfig';

export function isAxiosError(error: any): error is AxiosError {
    if ('response' in error) {
        return true;
    }

    return false;
}

const log = console.log;

// TODO: error retry
// TODO: run from last element
// TODO: clear result
// TODO: validat config - no config
export const runConfig = async (options: TConfig = require(getConfigPath())): Promise<void> => {
    const resultPath = getResultPath();

    try {
        log(chalk.blue('Luca is running...'));

        const config = validateConfig(options);
        const { baseUrl, items, query, handler } = config;

        const total = items.length;
        let index = 0;
        for (const item of items) {
            const num = (index += 1);
            const isFirst = num === 1;
            const isLast = num === total;

            const url = query(baseUrl, item);
            let response: AxiosResponse | null = null;
            let isErroredRequest = false;

            try {
                response = await axios.get(url);
            } catch (e) {
                isErroredRequest = true;

                if (isAxiosError(e) && e.response) {
                    response = e.response;
                }
            } finally {
                log(
                    chalk.blue(`${num}/${total}`),
                    `GET ${chalk[isErroredRequest ? 'red' : 'green'](`(${response?.status})`)}:`,
                    url
                );
            }

            try {
                const data = handler(response, item);

                await fs.appendFile(resultPath, `${isFirst ? '[' : ''}${JSON.stringify(data)}${isLast ? ']' : ','}`);
            } catch (error) {
                console.error('handler error', error);
            } finally {
                await delay(options.delay);
            }
        }

        log(chalk.green(`Finished:\n> ${resultPath}`));
    } catch (e) {
        console.error(e);
    }
};
