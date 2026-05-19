import {
  ApplicationConfig,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {
  provideAuth
} from '@angular/fire/auth';

import {
  getAuth
} from 'firebase/auth';

import {
  provideFirebaseApp
} from '@angular/fire/app';

import {
  initializeApp
} from 'firebase/app';

import {
  getDatabase,
  provideDatabase
} from '@angular/fire/database';

import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {

  providers: [

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideFirebaseApp(() =>
      initializeApp(environment.firebase)
    ),

    provideAuth(() =>
      getAuth()
    ),

    provideDatabase(() =>
      getDatabase()
    )

  ]
};