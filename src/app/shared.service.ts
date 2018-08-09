import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

  appModalEvent = new Subject();

  constructor() { }

}
