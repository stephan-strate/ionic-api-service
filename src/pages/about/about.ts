import { Component } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";

import { ApiProvider } from "../../providers/api.service";

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
        this.api.get([this.api.endpoints.POSTS, this.api.endpoints.COMMENTS]).then(data => {
            this.posts = data[this.api.endpoints.POSTS.getUrl()];
            this.comments = data[this.api.endpoints.COMMENTS.getUrl()];
        }).catch(error => {
            console.error("Error.")
        });

        this.api.get(this.api.endpoints.USERS).then(data => {
            this.users = data[this.api.endpoints.USERS.getUrl()];
        }).catch(error => {
            console.error("Error.");
        });
    }
}