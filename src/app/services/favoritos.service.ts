/*
    Servicio para compartir los favoritos entre la home y el search
*/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private cancionesFavoritas: any[] = [];

  private artistasFavoritos: any[] = [];

  private nuevosLanzamientosFavoritos: any[] = [];

  constructor() { }

  guardarCancionFavorita(cancionFavorita:any){
    console.log(cancionFavorita);
    this.cancionesFavoritas.push(cancionFavorita)
  }

  obtenerCancionesFavoritas():any{
    return this.cancionesFavoritas;
  }

  guardarArtistaFavorito(artistaFavorito:any){
    console.log(artistaFavorito);
    this.artistasFavoritos.push(artistaFavorito)
  }

  obtenerArtistasFavoritos():any[]{
    return this.artistasFavoritos;
  }

  guardarNuevoLanzamientoFavorito(nuevoLanzamientoFavorito:any){
    console.log(nuevoLanzamientoFavorito);
    this.nuevosLanzamientosFavoritos.push(nuevoLanzamientoFavorito)
  }

  obtenerNuevosLanzamientosFavoritos():any{
    return this.nuevosLanzamientosFavoritos;
  }

}
