import { Component } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";

import { ApiProvider, Endpoints } from "../../providers/api.service";

@IonicPage({
    name: "AboutPage"
})

@Component({
    selector: "page-about",
    templateUrl: "about.html"
})
export class AboutPage {

    public posts: string;
    public comments: string;

    public users: string;

    constructor(public navCtrl: NavController, private api: ApiProvider) {

    }

    public ionViewDidLoad () {
        this.api.get([Endpoints.POSTS, Endpoints.COMMENTS]).then(data => {

        }).catch(error => {
            console.error("Error.")
        });

        this.api.get(Endpoints.USERS).then(data => {

        }).catch(error => {
            console.error("Error.");
        });
    }
}