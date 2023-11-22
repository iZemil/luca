import axios, { AxiosError, AxiosResponse } from 'axios';
import { concatAll, concatMap, delay, map, mergeMap, of, tap } from 'rxjs';

import { parse } from './read';
import { writeLog } from './write';

export const luca = (dict: string, getUrl: (word: string) => string) =>
    parse(dict).pipe(
        concatMap((arr) =>
            arr.map((item) =>
                of(getUrl(item)).pipe(
                    delay(500),
                    map((url) => axios.get(url as string)),
                    mergeMap(async (res) => {
                        try {
                            return await res;
                        } catch (error) {
                            return (error as AxiosError).response;
                        }
                    }),
                    map((res) => {
                        return {
                            res: res as AxiosResponse,
                        };
                    }),
                    tap(({ res }) => writeLog(res.config.url as string, res.status))
                )
            )
        ),
        concatAll()
    );
