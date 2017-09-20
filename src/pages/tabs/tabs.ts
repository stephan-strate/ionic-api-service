import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage({
    name: 'TabsPage'
})

@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {

    public home: any = 'HomePage';
    public about: any = 'AboutPage';
    public contact: any = 'ContactPage';

    constructor() {

    }
}