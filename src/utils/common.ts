import * as fs from 'fs';

export function checkPath(path: string, isDir = false): boolean {
    try {
        const stat = fs.lstatSync(path);

        if (isDir) {
            return stat.isDirectory();
        }

        return stat.isFile();
    } catch {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

export const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));
