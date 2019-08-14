import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { File } from '@ionic-native/file/ngx';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { ImageResizer } from '@ionic-native/image-resizer/ngx';
import { DocumentScanner} from '@ionic-native/document-scanner/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    File ,
    PhotoViewer , 
    DocumentViewer ,
    ImageResizer , 
    DocumentScanner , 
     
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
