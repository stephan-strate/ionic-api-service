import { Component } from "@angular/core";
import { Platform } from "ionic-angular";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { ApiEndpoint, ApiProvider } from "../providers/api.service";

@Component({
  	templateUrl: "app.html"
})

export class MyApp {

    public rootPage: any = "TabsPage";

    constructor (public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public api: ApiProvider) {
      	platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();

			// Settings for api.service provider.
            // Declaring endpoints and customizing messages etc.
			api.enableDebug();
            api.endpoints.POSTS = ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/posts");
            api.endpoints.USERS = ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/users");
            api.endpoints.COMMENTS = ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/comments");
    	});
  	}
}