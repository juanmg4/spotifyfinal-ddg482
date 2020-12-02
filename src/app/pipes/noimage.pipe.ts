import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimage',
})
export class NoimagePipe implements PipeTransform {

  transform(images: any[]): string {
    /* Compruebo si el arreglo de imagenes existe o no. Si no existe devuelvo la imagen de que no hay imagen */
    if (!images){
      return 'assets/img/noimage.png';
    /* si existe el arreglo y hay imagenes, devuelvo la que esta en la posicion 0. Si el arrreglo esta vacio y no hay imagenes, devuelvo la imagen de que no hay imagen */
    }else if (images.length > 0) {
      return images[0].url;
    } else {
      return 'assets/img/noimage.png';
    }
  }
}
