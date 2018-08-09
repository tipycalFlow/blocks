import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { SquareBoardComponent } from './square-board/square-board.component';
import { SelectBoardComponent } from './select-board/select-board.component';
import { TutorialPageComponent } from './tutorial-page/tutorial-page.component';
import { MenuComponent } from './menu/menu.component';
import { SharedService } from './shared.service';

const appRoutes: Routes = [
  { path: 'square-board/:board-name', component: SquareBoardComponent },
  { path: 'select-board', component: SelectBoardComponent },
  { path: '**', component: TutorialPageComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    SquareBoardComponent,
    SelectBoardComponent,
    TutorialPageComponent,
    MenuComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
