//Modulos
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//Servicios
import { HttpClientModule } from '@angular/common/http';

//Pipes
import { NoimagePipe } from './pipes/noimage.pipe';
import { SafeurlPipe } from './pipes/safeurl.pipe';

//IMPORTAR RUTAS
import { ROUTES } from './app.routes';
import { SearchComponent } from './components/search/search.component';

//Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistaComponent } from './components/artista/artista.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { TarjetasComponent } from './components/tarjetas/tarjetas.component';
import { ShowMoreButtonComponent } from './components/shared/show-more-button/show-more-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ArtistaComponent,
    NavbarComponent,
    SearchComponent,
    NoimagePipe,
    SafeurlPipe,
    TarjetasComponent,
    ShowMoreButtonComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
