import chalk from 'chalk';
import { lstatSync } from 'fs';

import { log } from './log';

export function checkPath(path: string, isDir = false): boolean {
    try {
        const stat = lstatSync(path);

        if (isDir) {
            return stat.isDirectory();
        }

        return stat.isFile();
    } catch {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

export const wait = async (ms: number) => new Promise((res) => setTimeout(res, ms));

export function curry(fn: any) {
    const arity = fn.length;

    return function $curry(...args: any[]): any {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }

        return fn.call(null, ...args);
    };
}

export const filter =
    <T>(predicate: (value: T) => boolean) =>
    (list: T[]) =>
        list.filter(predicate);

type TNumStr = string | number;
export const ifSuccessResponse = (status: TNumStr, yes: (status: TNumStr) => string, no: (status: TNumStr) => string) =>
    String(status).startsWith('2') ? yes(status) : no(status);

export const isString = <T>(str: T): boolean => typeof str === 'string';

export const showErrorIf = (condition: boolean, msg: string, submsg = '') => {
    if (condition) {
        log(chalk.red(msg))(submsg);
        process.exit(1);
    }
};
