import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('sidenavHidden', [
      state('0', style({
        left: '0'
      })),
      state('1', style({
        left: '-100%'
      })),
      transition('0 => 1', animate('400ms ease-in')),
      transition('1 => 0', animate('400ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit {

  cellBorderPreference: string;
  sidenavHidden: boolean = true;

  ngOnInit() {
  }

  toggleCellBorderPreference() {
  }

  openSidenav() {
    this.sidenavHidden = false;
  }

  closeSidenav() {
    this.sidenavHidden = true;
  }

}
