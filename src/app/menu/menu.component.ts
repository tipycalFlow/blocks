import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared.service';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input()
  menuConfig: Menu;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }

  executeMenuFunction(menuItem) {
    this.sharedService.appModalEvent.next(menuItem);
  }

}
