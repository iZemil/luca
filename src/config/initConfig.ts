import chalk from 'chalk';
import * as fs from 'fs/promises';

import { getConfigPath } from './consts';

export const initConfig = async () => {
    try {
        const config = getConfigPath();

        await fs.writeFile(
            config,
            `module.exports = {
    delay: 500,
    baseUrl: "https://www.npmjs.com/package",
    query: (baseUrl, item) => {
        return \`\${baseUrl}/\${item}\`;
    },
    handler: (response, item) => {
        return {
            status: response.status,
        };
    },
    items: ['foo', 'bar'],
}`
        );

        console.log(chalk.green(`Configuration file was created:\n> ${config}`));
    } catch (e) {
        console.error(e);
    }
};
