import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {
/* Le va a llegar un array de artistas, canciones, nuevos lanzamientos o favoritos */
@Input() items: any[] = [];
/* Para saber cuantas tajetas renderizar en el html, se va incrementando cada vez que le doy click al boton de mostrar mas en el componente padre */
@Input() cantidadTarjetasMostradas:number;
/* Para saber si tengo que renderizar una tarjeta de nuevos lanzamientos, de artistas o de canciones y para saber si renderizar el boton de agregar o eliminar favoritos */
@Input() type:string;
/* Para notificar al componente padre que tiene que agregar o eliminar un favorito */
@Output() favorito= new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
  }

  /* Para saber que tipo de elemento es, y en base a eso renderizar las tarjetas con los estilos correspondientes */
  getElementType(nombre:string){
    if (nombre.includes('favorite')){

      if(nombre.includes('home')){
        return 'home';
      }

      if(nombre.includes('artist')){
        return 'artist';
      }

      if(nombre.includes('track')){
        return 'track';
      }
    }else{
      return nombre;
    }
  }

  isFavorite(nombre:string){
    if(nombre.includes('favorite')){ return true; }
    else { return false; }
  }

  isTrack(nombre:string){
    if(nombre.includes('track')){ return true; }
    else { return false; }
  }

  /* Procesa el favorito y avisa al componente padre si hay que guardarlo o eliminarlo */
  procesarFavorito(item:any){
    this.favorito.emit(item);
  }
}
