import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Subject, BehaviorSubject, Observable, of, from } from 'rxjs';
import { groupBy, mergeMap, toArray, pluck, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  /* Array que contiene todos los artistas obtenidos por el metodo getArtistas del servicio de spotify, filtrados segun la busqueda */
  artistas: any[] = [];
  /* Array que contiene todas las canciones obtenidas por el metodo getTracks del servicio de spotify, filtrados segun la busqueda */
  canciones: any[] = [];
  /* Numero de inicial de tarjetas de la busqueda que se van a mostrar en pantalla */
  cantidadTarjetasMostradas: number = 8;
  /* Cuantas tarjetas mas mostrar en la busqueda cada vez que apreto el boton de mostrar mas */
  incrementoTarjetasAMostrar:number = 8;
  /* False = busca cancion, True= busca artista */
  buscarArtista: boolean= false;
  /* Si el formulario de busqueda esta vacio no muestra nada, de lo contrario, muestra los elementos que coincidan con la busqueda */
  mostrarContenido: boolean = false;

  /* para el tp */
  //ultimo = new BehaviorSubject(null);
  ultimoGrupo = new BehaviorSubject(null);
  observableCanciones = new Observable();
  observableCancionesMasNuevas = new Observable();

  constructor( private _spotify: SpotifyService, public _favoritos: FavoritosService) { this._spotify.getToken() } //si el servicio es publico, puedo usar sus metodos y atributos directamente en el html

  ngOnInit(): void {
  }

  /* Obtengo la lista de artistas con el servicio de spotify, filtrados segun el contenido de la busqueda */
   buscar(contenidoBusqueda: string){
    console.log(contenidoBusqueda);
    /* Si el contenido de la busqueda no tiene nada, entonces no llamo al servicio que busca los artistas o las canciones, si tiene algo, entonces si lo llamo */
    if(contenidoBusqueda.charAt(0)!==""){
    this.mostrarContenido=true;
    /* cada vez que cambia el valor del formulario, se resetea el boton mostrar mas a su configuracion inicial */
    this.cantidadTarjetasMostradas=8;
    /* si la primera letra del formulario es un arroba busca artistas */
      if(contenidoBusqueda.charAt(0)==="@"){
       if (contenidoBusqueda.length>=2){ /* Que por lo menos despues del @ haya una letra para empezar a buscar (que no se haga una busqueda vacia) */
        this.buscarArtista=true;
       this._spotify.getArtistas( contenidoBusqueda.substring(1) ).then( (data:any) => {
      console.log(data.artists.items);
      this.artistas = data.artists.items;
      });
     }
  }
    /* si la primera letra del formulario no es un arroba busca canciones*/
    else{
      /* Defino a la funcion cargarCancionesBuscadas */
     let cargarCancionesBuscadas = (callback:any)=>{
      this.buscarArtista=false;
        this._spotify.getTracks( contenidoBusqueda ).then( (data:any) => {
        console.log("**** CONTENIDO DE BUSCAR CANCIONES ****");
        console.log(data.tracks.items);
          this.canciones = data.tracks.items;
          /* Una vez que obtenga todas las canciones de la busqueda, va a llamar al callback para modificarle la fecha a esas canciones de 'AAAA/MM/DD' a 'AAAA' y usar los operadores
          de rxjs para el tp */
          callback();
      });

    }

    /* defino lo que hace el callback (llama al metodo que modifica las fechas) */
    let callback = () => {
      console.log ('==== Canciones por año ====');
      this.ModificarFecha();
    }

    /* Llamo a la funcion y le paso el callback */
     cargarCancionesBuscadas(callback);
  }
  }else{ /* Si la busqueda esta vacia, seteo la bandera mostrarContenido en falso para poder mostrar los favoritos */
    this.mostrarContenido=false;
  }
  }
   /* Para ir mostrando los elementos de a 8 por vez */
   increaseShowSearch() {
    this.cantidadTarjetasMostradas += this.incrementoTarjetasAMostrar;
  }


 /* Si el servicio es private */

/*   guardarCancionFavorita(cancionFavorita:any){
    this._favoritos.guardarCancionFavorita(cancionFavorita)
  }

  guardarArtistaFavorito(artistaFavorito:any){
    this._favoritos.guardarArtistaFavorito(artistaFavorito);
  }

  obtenerArtistasFavoritos(): any{
    return this._favoritos.obtenerArtistasFavoritos();
  }

  obtenerCancionesFavoritas(): any{
    return this._favoritos.obtenerCancionesFavoritas();
  } */

eliminarArtistaFavorito(posicionArtistaFavorito:any){
  this._favoritos.obtenerArtistasFavoritos().splice(posicionArtistaFavorito,1);
}
eliminarCancionFavorita(posicionCancionFavorita:any){
  this._favoritos.obtenerCancionesFavoritas().splice(posicionCancionFavorita,1);

}
eliminarNuevoLanzamientoFavorito(posicionNuevoLanzamientoFavorito:any){
  this._favoritos.obtenerNuevosLanzamientosFavoritos().splice(posicionNuevoLanzamientoFavorito,1);
}

ModificarFecha(){
  console.clear();

    /* Hace una copia del arreglo canciones por valor y no por referencia, para que no me modifique el arreglo de canciones original cuando modifico la copia */
    let fechasArregladas:any[] = JSON.parse(JSON.stringify(this.canciones));
    console.log("**** Canciones obtenidas ****");
    console.log(this.canciones);

    /* transformar fecha de aaaa/mm/dd => aaaa */
    for(let i=0;i<fechasArregladas.length;i++){
      //console.log(fechasArregladas[i]['album']['release_date']);
      let fecha:string = fechasArregladas[i]['album']['release_date'];
      fecha = fecha.substring(0,4);
      fechasArregladas[i]['album']['release_date']=fecha;
      //console.log(fechasArregladas[i]);
    }

    console.log("**** Canciones con fecha modificada y ordenadas por año ****")
    console.log(fechasArregladas)
    fechasArregladas.sort(((a, b) => a.album.release_date - b.album.release_date));

    //this.observable = from (this.canciones);
    this.observableCanciones = from (fechasArregladas);
    const grupos = this.observableCanciones.pipe(
    groupBy(key => key['album']['release_date']),
    mergeMap(group$ => group$.pipe(toArray()))
  );

  console.log("==== P-02-02: groupBy + mergeMap - Grupos de canciones por fecha ====");

  let suscripcionGrupos= grupos.subscribe(x => {
    console.log(x);
    this.ultimoGrupo.next(x);
  });
  suscripcionGrupos.unsubscribe();

  let cancionesMasNuevas = this.ultimoGrupo.subscribe(x => {
    console.log("==== P-02-03: BehaviorSubject - Ultimo grupo (canciones mas nuevas) ====");
    console.log(x);
    this.observableCancionesMasNuevas = from(x);
  });
  cancionesMasNuevas.unsubscribe();

 /* pluck solo de las canciones mas nuevas */
  let nombreCancionesMasNuevas = this.observableCancionesMasNuevas.pipe(
    pluck("external_urls"),pluck("spotify")
    //pluck("preview_url")
    );

    /* pluck De todas las canciones */
    /*let nombreCancionesMasNuevas = this.observableCanciones.pipe(
    //pluck("external_urls"),pluck("spotify")
    pluck("preview_url")
    );*/

  //console.log(nombreCancionesMasNuevas);
  console.log("==== P-02-01: pluck - Canciones mas nuevas ====");
  let nombreCancionesMasnuevasSuscripcion = nombreCancionesMasNuevas.subscribe(x => {
  console.log(x);});
  nombreCancionesMasnuevasSuscripcion.unsubscribe();
 }
}
