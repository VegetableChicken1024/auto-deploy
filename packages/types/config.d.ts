export interface IConfig {
    [key: string]: string | number;
    host: string;
    username: string;
    password: string;
    port: number;
}