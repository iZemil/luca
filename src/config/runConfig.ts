import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';

import { delay } from '../utils';

import { getConfigPath, getResultPath } from './consts';
import { TConfig } from './types';
import { validateConfig } from './validateConfig';

function isAxiosError(error: any): error is AxiosError {
    if ('response' in error) {
        return true;
    }

    return false;
}

const log = console.log;

export const runConfig = async (options: TConfig = require(getConfigPath())): Promise<void> => {
    const resultPath = getResultPath();

    try {
        validateConfig(options);

        log(chalk.blue('Luca is running...'));

        const { baseUrl, items, query, handler } = options;

        const total = items.length;
        let index = 0;
        for (const item of items) {
            const url = query(baseUrl, item);

            let status = undefined;
            let response: AxiosResponse | null = null;
            try {
                response = (await axios.get(url)) as AxiosResponse;

                status = response.status;
            } catch (e) {
                if (isAxiosError(e) && e.response) {
                    status = e.response.status;
                }
            }

            log(chalk.blue(`${index + 1}/${total}`), `GET ${url} (${status})`);

            try {
                const data = handler(response, item);
                const isFirst = index === 0;
                const isLast = index + 1 === total;

                await fs.appendFile(resultPath, `${isFirst ? '[' : ''}${JSON.stringify(data)}${isLast ? ']' : ','}`);
            } catch (error) {
                console.error('handler error', error);
            } finally {
                index += 1;

                await delay(options.delay);
            }
        }

        log(chalk.green(`Finished:\n> ${resultPath}`));
    } catch (e) {
        console.error(e);
    }
};
