import { pipe } from 'fp-ts/lib/function';

import { log } from './log';

const add = (x: number) => (y: number) => x + y;

const multiply = (x: number) => (y: number) => x * y;

log('check pipe fn')(pipe(100, add(5), multiply(2)) === 210);
