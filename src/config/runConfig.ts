import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';

import { wait } from '../utils';

import { LOG_PATH } from './consts';
import { openConfig } from './openConfig';

export function isAxiosError(error: any): error is AxiosError {
    if ('response' in error) {
        return true;
    }

    return false;
}

const log = console.log;

interface IHandleRequest {
    url: string;
    num: number;
    total: number;
    sleepDelay?: number;
    sleepCount?: number;
}
const ONE_MINUTE = 60 * 1000;
const handleRequest = async (options: IHandleRequest): Promise<AxiosResponse | null> => {
    const { url, num, total, sleepDelay = ONE_MINUTE, sleepCount = 0 } = options;

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

    // Handle: Too Many Requests
    if (sleepCount > 3) {
        throw new Error(`Exceeded ${sleepCount} requests`);
    }
    if (response && response.status === 429) {
        log(chalk.grey(`sleep...`));

        await wait(sleepDelay);

        return handleRequest({
            ...options,
            sleepDelay: sleepDelay + ONE_MINUTE,
            sleepCount: sleepCount + 1,
        });
    }

    return response;
};

const writeToLog = async (...strs: string[]) => {
    await fs.appendFile(LOG_PATH, '\n' + strs.join('\n'));
};

// TODO: run from last log element
// TODO: add log name --name
export const runConfig = async (): Promise<void> => {
    try {
        const config = openConfig();
        const { baseUrl, items, query } = config;
        const total = items.length;

        const axmTime = total * (config.delay + 300);
        const axmMin = Math.floor(axmTime / 60000);
        log(chalk.blue('Luca starts a session'), `approximate end in ${axmMin} minutes`);
        await writeToLog('Start session', `time: ${new Date()}`);

        let index = 0;
        for (const item of items) {
            const num = (index += 1);
            const url = query(baseUrl, item);

            try {
                const response = await handleRequest({ url, num, total });

                await writeToLog(
                    `\nurl: ${url}`,
                    `status: ${response?.status}`,
                    `data: ${response ? JSON.stringify(config.handler(response, item)) : null}`
                );
            } catch (error) {
                console.error('handler error', error);
            } finally {
                await wait(config.delay);
            }
        }

        log(chalk.green(`Luca finished:\n> ${LOG_PATH}`));
        writeToLog(`\nEnd session`, `time: ${new Date()}`, '');
    } catch (e) {
        log(chalk.red(e));
    }
};
