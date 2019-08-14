import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner/ngx';
import { File } from '@ionic-native/file/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  doclist$: any;
  filedirs: any[] = [];
  docs: any[] = [];


  constructor(
    private router: Router,
    private docscan: DocumentScanner,
    private file: File

  ) {

    // this.doclist$ = this.sqldata.doclist$.subscribe((r) => this.docs = r);
    //  console.log("In Init") ;
    //  this.sqldata.getdoclist()  ;

  }
  ngOnInit() {

    this.file.listDir(this.file.externalDataDirectory, '').then((l) => {
      l = l.filter((el) => el.isDirectory);

      this.filedirs = l.sort((a, b) => {
        return a.name <= b.name ? -1 : 1;
      });
    });
  }

  showdoc(doc) {
    this.router.navigate(['/docview/' + doc.name]);
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
    // "" + Math.round(new Date().getTime() / 1000) ;


    //alert(this.file.externalDataDirectory) ; 
    //  return ;
    let opts: DocumentScannerOptions = {};
    this.docscan.scanDoc(opts)
      .then((res: string) => {
        console.log(res);
        var uuid = "" + Math.round(new Date().getTime() / 1000);
        var docname = this.taskDate() + "_" + uuid;

        this.file.createDir(this.file.externalDataDirectory, docname, false).then((r) => {
          this.file.listDir(this.file.externalDataDirectory, '').then((l) => {
            l = l.filter((el) => el.isDirectory);

            this.filedirs = l.sort((a, b) => {
              return a.name <= b.name ? -1 : 1;
            });
          });


          let n = res.lastIndexOf("/");
          let oldpath = res.substr(0, n);
          let oldfile = res.substr(n + 1);
          let newpath = this.file.externalDataDirectory + docname;
          let newfile = "doc_" + docname + '.jpg';
          this.file.moveFile(oldpath, oldfile, newpath, newfile).then((r) => console.log("Moved"));
        });

      });
  }

  deletephoto(doc) {
    console.log(doc);
    //   this.file.removeRecursively()
    this.file.removeRecursively(this.file.externalDataDirectory, doc.name).then((r) => {


      this.file.listDir(this.file.externalDataDirectory, '').then((l) => {
        l = l.filter((el) => el.isDirectory);
        this.filedirs = l.sort((a, b) => {
          return a.name <= b.name ? -1 : 1;
        });


      });

    });

  }


}
