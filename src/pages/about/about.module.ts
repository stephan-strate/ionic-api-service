import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';

import { ApiProvider } from './../../providers/api.service';
import { IonicStorageModule } from '@ionic/storage';
 
@NgModule({
    declarations: [
        AboutPage
    ],
    imports: [
        IonicPageModule.forChild(AboutPage),
        IonicStorageModule.forRoot()
    ],
    exports: [
        AboutPage
    ],
    providers: [
        ApiProvider
    ]
})

export class AboutPageModule {}