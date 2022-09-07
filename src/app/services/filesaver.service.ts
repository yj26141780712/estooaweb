import { Injectable } from '@angular/core';
// import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FilesaverService {

  constructor() { }

  // saveToJsonFile(strJson: string, filename: string) {
  //   const blob = new Blob([strJson], { type: 'text/plain;charset=utf-8' });
  //   saveAs(blob, filename);
  // }

  JsonToBlob(strJson: string) {
    return new Blob([strJson], { type: 'text/plain;charset=utf-8' });
  }
}
