import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

import { CONFIG_PATH } from './consts';

export const initConfig = async () => {
    try {
        await fs.copyFile(path.resolve('src/config/default.js'), CONFIG_PATH);

        console.log(chalk.green(`Configuration file was created:\n> ${CONFIG_PATH}`));
    } catch (e) {
        console.error(e);
    }
};
