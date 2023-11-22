import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { DICT_NAMES, isString, showErrorIf } from '../utils';

import { getUrlMaskExample } from './common';
import { run } from './run';

interface IRunArgs {
    dict: string;
    url: string;
}

/**
 * @docs https://yargs.js.org/docs
 */
export const start = async () =>
    yargs(hideBin(process.argv))
        .usage("Luca's manual")

        // run command
        .command<IRunArgs>({
            command: 'run',
            describe: 'Run mass requests (see examples)',
            handler: (args) => {
                const { dict, url } = args;

                showErrorIf(!isString(dict), '--dict is required', 'example: --dict=1_char');
                showErrorIf(!isString(url), `--url is required', 'example: ${getUrlMaskExample()}`);

                run(dict, url);
            },
        })
        .example(`luca run ${getUrlMaskExample()} --dict=1_char`, `for built-in dictionaries (${DICT_NAMES.join('|')})`)
        .example(`luca run ${getUrlMaskExample()} --dict=./my-dict.txt`, 'for your txt dict path')

        .command({
            command: '*',
            handler: () => void yargs.showHelp(),
        })
        .demandCommand()
        .alias('h', 'help')
        .alias('v', 'version').argv;
