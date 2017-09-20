import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { ApiProvider, API } from '../../providers/api.service';

@IonicPage({
    name: 'AboutPage'
})

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})

export class AboutPage {

    public users: string[];

    constructor(public navCtrl: NavController, private api: ApiProvider) {

    }

    public ionViewDidLoad () {
        this.api.enableDebug();
        //setTimeout(() => {
            this.api.get([API.COMMENTS, API.USERS], '?postId=1').then(data => {
                this.users = data[API.USERS.endpoint];
            }).catch(error => {
                console.error('Fehlgeschlagen.');
            });
        //}, 2000);
    }
}