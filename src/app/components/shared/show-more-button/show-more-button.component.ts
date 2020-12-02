import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-more-button',
  templateUrl: './show-more-button.component.html',
  styleUrls: ['./show-more-button.component.css']
})
export class ShowMoreButtonComponent implements OnInit {
@Input() type:string; /* Para saber donde posicionar el boton, si es la home se posiciona en tales coordenadas, si es search, se posiciona en otras */
@Output() mostrarMasTarjetas = new EventEmitter(); /* Avisa al padre que tiene que mostrar mas elementos en la vista */

  constructor() {}

  ngOnInit(): void {
  }

  /* Cuando el boton de mostrar mas recibe un click, avisa al componente padre que tiene que mostrar mas tarjetas en la vista */
  showMore(){
    this.mostrarMasTarjetas.emit();
  }
}
