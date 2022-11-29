import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';

import { delay } from '../utils';

import { LOG_PATH } from './consts';
import { openConfig } from './openConfig';

export function isAxiosError(error: any): error is AxiosError {
    if ('response' in error) {
        return true;
    }

    return false;
}

const log = console.log;

const handleRequest = async (url: string, num: number, total: number): Promise<AxiosResponse | null> => {
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

    return response;
};

const writeToLog = async (...strs: string[]) => {
    await fs.appendFile(LOG_PATH, '\n' + strs.join('\n'));
};

// TODO: 429 status - sleep and retry
// TODO: run from last log element
export const runConfig = async (): Promise<void> => {
    try {
        const config = openConfig();
        const { baseUrl, items, query } = config;

        log(chalk.blue('Luca is running...'));
        await writeToLog('Start session', `time: ${new Date()}`);

        const total = items.length;
        let index = 0;
        for (const item of items) {
            const num = (index += 1);

            const url = query(baseUrl, item);
            const response = await handleRequest(url, num, total);

            try {
                await writeToLog(
                    `\nurl: ${url}`,
                    `status: ${response?.status}`,
                    `data: ${response ? JSON.stringify(config.handler(response, item)) : null}`
                );
            } catch (error) {
                console.error('handler error', error);
            } finally {
                await delay(config.delay);
            }
        }

        log(chalk.green(`Finished:\n> ${LOG_PATH}`));
        writeToLog(`\nEnd session`, `time: ${new Date()}`, '');
    } catch (e) {
        log(chalk.red(e));
    }
};
