declare module 'js-cookies' {
    export function set(key: string, value: string, options?: any): void;
    export function get(key: string): string | undefined;
    export function remove(key: string, options?: any): void;
  }
  