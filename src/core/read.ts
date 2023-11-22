import { pipe } from 'fp-ts/lib/function';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { map, mergeMap, of } from 'rxjs';

import { Empty, filter } from '../utils';
import { log } from '../utils/log';

const getFileContent = (path: string) =>
    readFile(path, { encoding: 'utf8' })
        .catch(log('read error'))
        .then((data) => data ?? null);

const parseLines = (fileContent: Empty<string>): string[] => fileContent?.split('\n') ?? [];

const rmInvalids = filter<string>((val) => val.trim() !== '');

const findUniqs = (list: string[]): string[] => Array.from(new Set(list));

const parseTxt = (content: Empty<string>): string[] => pipe(content, parseLines, findUniqs, rmInvalids);

export const read = (filepath: string) => of(resolve(filepath)).pipe(map(getFileContent));

export const parse = (filepath: string) =>
    read(filepath).pipe(
        mergeMap(async (file) => file),
        map(parseTxt)
    );
