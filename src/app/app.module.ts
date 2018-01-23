import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiProvider } from "../providers/api.service";
import { IonicStorageModule } from "@ionic/storage";

@NgModule({
    declarations: [
      	MyApp
    ],
    imports: [
		BrowserModule,
		HttpModule,
        IonicStorageModule.forRoot(),
      	IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
    	MyApp
    ],
    providers: [
      	StatusBar,
      	SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiProvider
    ]
})

export class AppModule {}