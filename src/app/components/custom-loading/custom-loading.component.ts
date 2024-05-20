import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-loading',
  templateUrl: './custom-loading.component.html',
  styleUrls: ['./custom-loading.component.scss']
})
export class CustomLoadingComponent {

  dots = ".";
  cDots = 0;

  constructor() {
    setInterval(()=> {
      if (this.cDots == 2) {
        this.dots = ".";
        this.cDots = 0;
      } else {
        this.dots += ".";
        this.cDots++;
      }
    }, 800);
  }
}
