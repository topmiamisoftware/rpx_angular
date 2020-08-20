import { Component, OnInit } from '@angular/core';
import { MenuLoggedInComponent } from '../menu-logged-in.component';

@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.css']
})
export class PairingComponent implements OnInit {
  /*
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    const documentBody = document.getElementsByTagName('body')[0];

    const bgColor = localStorage.getItem('spotbie_backgroundColor');
    if (bgColor == '') {
      documentBody.style.backgroundColor = '#353535';
    } else {
      documentBody.style.backgroundColor = bgColor;
    }

    const fontColor = localStorage.getItem('spotbie_fontColor');
    if (fontColor == '') {
      documentBody.style.color = 'white';
    } else {
      documentBody.style.color = fontColor;
    }
    */
   public bg_color : string;

   constructor(private host : MenuLoggedInComponent) { }
 
   closeWindow(){
     this.host.locationPairingWindow.open = false;
   }
 
   ngOnInit() {
     this.bg_color = localStorage.getItem('spotbie_backgroundColor');
   }

}
