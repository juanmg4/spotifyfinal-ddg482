import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { interval } from "rxjs";
import { startWith } from "rxjs/operators";

/* Este nuevo Injectable, con providedIn, importa automaticamente el servicio en app.module.ts */
@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  /* Token para poder obtener los datos de la api de spotify */
  token: string = "";
  /* Observable que emite valores cada un segundo, empezando desde 0 */
  temporizador: any;
  /* Variable que va almacenando el valor actual del temporizador */
  valorTemporizador: number;
  /* Variable que va indicando cuando hay que pedir un nuevo token, arranca en 3300 segundos (55 minutos), superado ese tiempo se pide un token nuevo y se actualiza el valor de la variable*/
  segundos: number = 3300;

  constructor(private http: HttpClient) {
    this.temporizador = interval(1000)
      .pipe(startWith(0))
      .subscribe(segundos => {
        this.valorTemporizador = segundos;
        //console.log(this.valorTemporizador);
        //console.log(this.token);
      });
  }

  /* OBTENER TOKEN AUTOMATICAMENTE */
  getToken() {
    const pedirTokenCadaSegundos: number = 3300; //Indica cada cuanto tiempo pedir un token, se pide cada 55 minutos cuando el token expira
    const clientId = "2902b4731c884fcb8e19abcc925e4e38";
    const clientSecret = "179e6d64b5724695b8738d37ec0e4622";
    const body = new HttpParams()
      .append("grant_type", "client_credentials")
      .append("client_id", clientId)
      .append("client_secret", clientSecret);
    return this.http
      .post("https://accounts.spotify.com/api/token", body)
      .toPromise()
      .then(
        (token: any) => {
          if (this.token === "" || this.valorTemporizador >= this.segundos) {
            // Si el temporizador supero el tiempo limite de vida del token, se pide uno nuevo
            this.segundos = this.valorTemporizador + pedirTokenCadaSegundos; // Toma el minuto en el que expiro el token y le agrega 55 minutos mas para saber cuando vence el proximo token y pedir uno nuevo
            console.log("Token expirado. Nuevo token:");
            this.token = `Bearer ${token["access_token"]}`;
            //console.log('estoy en el getToken');
            console.log(this.token);
          } else {
            /* console.log("Token activo. No hay que pedir token"); */
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  /* las peticiones que hago en postman, pero aca en Angular */
  // Obtener nuevos lanzamientos
  async getNewReleases() {
    await this.getToken();
    const headers = new HttpHeaders({
      //autorizacion para poder recibir los datos en la peticion get. Tengo que mandar el token
      Authorization: this.token
    });
    //Por defecto la api de spotify me devuelve 20 registros. Puedo cambiar eso agregando al final de la url ?limit=5
    return this.http
      .get("https://api.spotify.com/v1/browse/new-releases?limit=24", {
        headers
      })
      .toPromise();
  }

  // Obtener Artistas
  async getArtistas(contenidoBusqueda: string) {
    await this.getToken();
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    /* Solo cambia la parte que va desde q= hasta &type */
    return this.http
      .get(
        `https://api.spotify.com/v1/search?q=${contenidoBusqueda}&type=artist&limit=16`,
        { headers }
      )
      .toPromise();
  }

  // Obtener Canciones
  async getTracks(contenidoBusqueda: string) {
    await this.getToken();
    const headers = new HttpHeaders({
      Authorization: this.token
    });
    /* Solo cambia la parte que va desde q= hasta &type */
    return this.http
      .get(
        `https://api.spotify.com/v1/search?q=${contenidoBusqueda}&type=track&limit=12`,
        { headers }
      )
      .toPromise();
  }
}

/* Enlace de busqueda por artista obtenido desde la pagina de spotify*/
/* https://api.spotify.com/v1/search?q=ricardo%20arjona&type=artist&limit=10 */
