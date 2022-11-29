import { AxiosResponse } from 'axios';

export interface TConfig<T = unknown> {
    baseUrl: string;
    items: T[];
    delay: number;
    query: (baseUrl: string, item: T) => string;
    handler: (response: AxiosResponse | null, item: T) => any;
}

export interface THandledData<T = unknown> {
    status: number | null;
    data: T | null;
}
