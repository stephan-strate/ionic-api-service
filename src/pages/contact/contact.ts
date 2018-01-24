import { Component } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";

@IonicPage({
  	name: "ContactPage"
})

@Component({
    selector: "page-contact",
    templateUrl: "contact.html"
})

export class ContactPage {

	constructor (public navCtrl: NavController) {

  	}

  	public ionViewDidLoad () {
		
  	}
}