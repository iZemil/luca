import { AxiosResponse } from 'axios';

export interface TConfig<T = unknown> {
    baseUrl: string;
    query: (baseUrl: string, item: T) => string;
    /** ms delay after request */
    delay: number;
    handler: (response: AxiosResponse | null, item: T) => any;
    items: T[];
}

export interface THandledData<T = unknown> {
    status: number | null;
    data: T | null;
}
