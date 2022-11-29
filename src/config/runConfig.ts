import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';

import { delay } from '../utils';

import { CONFIG_PATH, LOG_PATH } from './consts';
import { TConfig, THandledData } from './types';
import { validateConfig } from './validateConfig';

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

const writeToLog = async (value: string) => {
    await fs.appendFile(LOG_PATH, value);
};

// TODO: error retry
// TODO: run from last element
// TODO: clear result
// TODO: validat config - no config
export const runConfig = async (options: TConfig = require(CONFIG_PATH)): Promise<void> => {
    try {
        log(chalk.blue('Luca is running...'));

        const config = validateConfig(options);
        const { baseUrl, items, query } = config;

        const total = items.length;
        let index = 0;
        for (const item of items) {
            const num = (index += 1);
            const isFirst = num === 1;
            const isLast = num === total;

            const url = query(baseUrl, item);
            const response = await handleRequest(url, num, total);
            const handleData = (res: AxiosResponse | null): THandledData => {
                if (!res) {
                    return {
                        status: null,
                        data: null,
                    };
                }

                return {
                    status: res.status,
                    data: config.handler(res, item),
                };
            };

            try {
                const { status, data } = handleData(response);

                let txt = '\n';
                txt += `\nurl: ${url}`;
                txt += `\nstatus: ${status}`;
                txt += `\ndata: ${JSON.stringify(data)}`;
                await writeToLog(txt);
            } catch (error) {
                console.error('handler error', error);
            } finally {
                await delay(options.delay);
            }
        }

        log(chalk.green(`Finished:\n> ${LOG_PATH}`));
    } catch (e) {
        console.error(e);
    }
};
