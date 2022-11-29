import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { initConfig } from '../config/initConfig';
import { runConfig } from '../config/runConfig';

/**
 * @docs https://yargs.js.org/docs
 */
export const run = async () =>
    yargs(hideBin(process.argv))
        .usage('Lib usage')
        .command('init', 'Create config file', (args) => {
            initConfig();
        })
        .command('run', 'Run configuration', (args) => {
            runConfig();
        })
        .command({
            command: '*',
            handler() {
                yargs.showHelp();
            },
        })
        .demandCommand()
        .alias('h', 'help')
        .alias('v', 'version').argv;
