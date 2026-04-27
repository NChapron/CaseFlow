import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  name: string;
  production: boolean;
  apiUrl: string;
  logLevel: 'debug' | 'warn' | 'error';
}

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('APP_ENVIRONMENT');
