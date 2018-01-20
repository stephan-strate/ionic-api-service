import { Component } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";

import { ApiProvider, ApiEndpoint } from "../../providers/api.service";

export const API = {
    POSTS: ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/posts"),
    USERS: ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/users"),
    COMMENTS: ApiEndpoint.endpoint("http://jsonplaceholder.typicode.com/comments")
};

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
        this.api.enableDebug();

        this.api.get([API.POSTS, API.COMMENTS]).then(data => {
            this.posts = API.POSTS.unwrap(data);
            this.comments = API.COMMENTS.unwrap(data);
        }).catch(error => {
            console.error("Error.")
        });

        this.api.get(API.USERS).then(data => {
            this.users = API.USERS.unwrap(data);
        }).catch(error => {
            console.error("Error.");
        });
    }
}