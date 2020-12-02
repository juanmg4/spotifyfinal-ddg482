import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {

  constructor( private _domSanitizer:DomSanitizer ){

  }

  /* Recibe una url y un value (que en este caso es la id del item que le llega) */
  transform( url:string, value: string ): any {
    //const url = 'https://open.spotify.com/embed/album/';
    /* Sanitiza la url + item para que no de error de unsafe value used in a resource URL context */
    return this._domSanitizer.bypassSecurityTrustResourceUrl( url + value );
  }

}
