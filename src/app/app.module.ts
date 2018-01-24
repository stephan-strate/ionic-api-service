import { HttpModule } from "@angular/http";
import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { Demo } from "./app.component";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { ApiProvider } from "../providers/api.service";
import { IonicStorageModule } from "@ionic/storage";

@NgModule({
    declarations: [
      	Demo
    ],
    imports: [
		BrowserModule,
		HttpModule,
        IonicStorageModule.forRoot(),
      	IonicModule.forRoot(Demo)
    ],
    bootstrap: [
        IonicApp
    ],
    entryComponents: [
    	Demo
    ],
    providers: [
      	StatusBar,
      	SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
        ApiProvider
    ]
})

export class AppModule {}