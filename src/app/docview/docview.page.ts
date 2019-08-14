import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner/ngx';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import {DocumentViewer , DocumentViewerOptions} from "@ionic-native/document-viewer/ngx"
import { ActionSheetController } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-docview',
  templateUrl: './docview.page.html',
  styleUrls: ['./docview.page.scss']
})
export class DocviewPage implements OnInit {
  doc: any;
  photos = [];
  photosdata = [];
  pdfobject: any = null;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private docscan: DocumentScanner,
    private file: File,
    private photoviewer: PhotoViewer,
    private actionSheetCtrl: ActionSheetController ,
    private documentviewer : DocumentViewer 
  ) {

    this.doc = this.route.snapshot.paramMap.get('doc');
    //alert( this.file.externalDataDirectory  +  this.doc  ) ;
    this.file.listDir(this.file.externalDataDirectory, this.doc).then((l) => {
      this.file.listDir(this.file.externalDataDirectory, this.doc).then((l) => {

        this.photos = l.sort((a, b) => {
          return a.name <= b.name ? -1 : 1;
        });
        this.setphotos([]);

      });

    });

  }

  ngOnInit() {
  }



  setphotos = (p) => {

    let allp = [];
    let path = "";
    let file = "";
    let n = 0;
    this.photos.map((el) => {
      // n = el.imgurl.lastIndexOf("/");
      path = this.file.externalDataDirectory + this.doc;
      file = el.name;
      console.log(path, file);
      allp.push(this.file.readAsDataURL(path, file));
    });


    Promise.all(allp).then((values) => {
      this.photosdata = [];
      values.forEach((data) => {
        this.photosdata.push({
          image: data
        });

      });
      console.log(this.photosdata);


    });

  }

  onImageClick(i) {

    //alert(JSON.stringify(this.photos[i])) ;  
    this.actionSheetCtrl.create({

      header: 'What Do you want to do with This Photo',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deletephoto(this.photos[i]);
            //  this.sqldata.deletephoto(this.photos[i]) ;
            //  alert(JSON.stringify(this.photos[i]));
          }
        },
        {
          text: 'View',
          handler: () => {
            this.viewphoto(this.photos[i].name)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).then(a => a.present());

  }

  taskDate() {

    var d = new Date();
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }


  takePhoto() {
    let opts: DocumentScannerOptions = {};
    this.docscan.scanDoc(opts)
      .then((res: string) => {
        console.log(res);
        var uuid = "" + Math.round(new Date().getTime() / 1000);
        var docname = this.taskDate() + "_" + uuid;
        let n = res.lastIndexOf("/");
        let oldpath = res.substr(0, n);
        let oldfile = res.substr(n + 1);
        let newpath = this.file.externalDataDirectory + this.doc;
        let newfile = "doc_" + docname + '.jpg';
        this.file.moveFile(oldpath, oldfile, newpath, newfile).then((r) => {

          this.file.listDir(this.file.externalDataDirectory, this.doc).then((l) => {

            this.photos = l.sort((a, b) => {
              return a.name <= b.name ? -1 : 1;
            });
            this.setphotos([]);

          });

        });


      });



  }


  viewphoto(photo) {
    let url = this.file.externalDataDirectory + this.doc + "/" + photo;

    this.photoviewer.show(url, 'My image title', { share: false });



  }
  deletephoto(photo) {
    // alert(JSON.stringify(photo)) ;

    this.file.removeFile(this.file.externalDataDirectory + this.doc, photo.name).then((r) => {


      //   this.file.listDir(  this.file.externalDataDirectory + this.doc  ,  ''  ).then( (l) => {
      //   console.log(l) ; 
      //   this.photos = [...l]  ;   

      this.photos = this.photos.filter((el) => el.name !== photo.name);
      this.setphotos([]);




    }).catch(e => console.log(e));
    //this.sqldata.deletedoc(doc) ;
    // delete directory 
  }

  viewpdf() {
    let allp = [];
    let path = "";
    let file = "";
    let n = 0;
    this.photos.map((el) => {
     // n = el.imgurl.lastIndexOf("/");
      path = this.file.externalDataDirectory + this.doc ;
      file = el.name ;
      allp.push(this.file.readAsDataURL(path, file));
    });

    let mcontent = [];
    let _i = 0 ; 
    Promise.all(allp).then((values) => {
      values.forEach( (data) => { 
        _i = _i + 1 ;
        mcontent.push({
          image: data,
          width: 580 
        });
        console.log(this.photos.length , _i) ; 
        if (this.photos.length > _i ) {  
        mcontent.push({text: '', pageBreak: 'before'});
        } 
      });


      var docDefinition = {
        pageSize: {
          width: 595.28,
          height: 'auto'
        } ,
        pageOrientation: 'portrait',
        pageMargins: [0, 0, 0, 0],
        
        content: mcontent
      };
      console.log(docDefinition);
      this.pdfobject = pdfMake.createPdf(docDefinition);
      const options: DocumentViewerOptions = {
        title: 'My PDF',

        email: { enabled: true }
      }
      this.pdfobject.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalDataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.documentviewer.viewDocument(this.file.externalDataDirectory + 'myletter.pdf', 'application/pdf', options);
        })
      });


    });

  }


}
