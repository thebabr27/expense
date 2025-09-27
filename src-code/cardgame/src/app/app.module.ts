import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from './environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { HomeComponent } from './core/components/home/home.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './core/components/login/login.component';
import { GamesComponent } from './feature/games/games.component';
import { IconLinkListComponent } from './shared/components/lists/icon-link-list/icon-link-list.component';
import { DosComponent } from './feature/dos/dos.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    GamesComponent,
    IconLinkListComponent,
    DosComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule ,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
