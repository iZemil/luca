import { AxiosResponse } from 'axios';

export interface TConfig<T = unknown> {
    baseUrl: string;
    items: T[];
    delay: number;
    query: (baseUrl: string, item: T) => string;
    handler: (response: AxiosResponse | null, item: T) => any;
}
