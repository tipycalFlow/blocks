import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Cell } from '../models/cell.model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { _ } from 'underscore';
import 'jquery';
import * as $ from 'jquery';
import 'bootstrap';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs/Subscription';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-tutorial-page',
  templateUrl: './tutorial-page.component.html',
  styleUrls: ['./tutorial-page.component.css'],
  animations: [
    trigger('invalid', [
      state('1', style({
        boxShadow: 'inset 0px 0px 50px 10px rgba(255, 0, 0, 1.0)',
        transform: 'scale(0.8, 0.8)'
      })),
      state('0', style({
        boxShadow: 'none'
      })),
      transition('0 => 1', animate('400ms ease-in')),
      transition('1 => 0', animate('200ms ease-out'))
    ]),
    trigger('ownerChanged', [
      state('1', style({
        transform: 'scale(0.8, 0.8)'
      })),
      state('0', style({
        transform: 'none'
      })),
      transition('0 => 1', animate('200ms ease-in')),
      transition('1 => 0', animate('200ms ease-out'))
    ])
  ]
})
export class TutorialPageComponent implements OnInit, OnDestroy {

  currentStep = 1;
  currentStepMessage = "";
  arrowDownPosition;
  arrowLeftPosition;
  arrowDownHidden = "d-none";
  arrowLeftHidden = "d-none";
  //menuConfig: Menu = new Menu(undefined, undefined, undefined);
  menuConfig: Menu;
  menuItems = ["SELECT BOARD", "SETTINGS"];
  subscriptions: Subscription = new Subscription();

  board;
  invalidMovesCount: number;
  config;
  currentPlayer: string;
  opponentPlayer: string;
  computerPlayer: string;
  p1score: number;
  p2score: number;
  scorePercentage: number;
  cellSize: any;
  boardSize;
  p1Color = '#dc3545';
  p2Color = '#007bff';
  boardBackground = '#C7C0B5';
  gameMode = 0; // could be "vs Computer", "vs another player on same phone" or "vs another player online"

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private sharedService: SharedService) { }

  ngOnInit() {
    this.config = {
      rows: 4,
      cols: 4,
      p1_cells: [[1, 1], [2, 2]],
      p2_cells: [[1, 2], [2, 1]],
      blocked_cells: null,
      name: 'tutorial'
    };
    if (!this.boardSize) { this.boardSize = window.innerWidth; }
    this.refreshGame();
    this.currentStepMessage = "Click to turn blue blocks into yours.";
    this.subscriptions.add(this.sharedService.appModalEvent.subscribe((menuItem) => {
      switch (menuItem) {
        case "SELECT BOARD": {
          $('#app-menu-id').modal('hide');
          this.router.navigate(['/select-board']);
          console.log("Select Board Called");
          break;
        }
        case "SETTINGS": {
          $('#app-menu-id').modal('hide');
          console.log("Settings Called");
          break;
        }
        default: {
          break;
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  refreshGame() {
    this.invalidMovesCount = 0;
    this.currentPlayer = 'p1';
    this.opponentPlayer = 'p2';
    this.computerPlayer = 'p2';
    this.board = _.times(this.config.rows, () => {
      return _.times(this.config.cols, () => {
        return 0;
      });
    });
    _.times(this.config.rows, (row) => {
      _.times(this.config.cols, (col) => {
        this.board[row][col] = new Cell(1, true, 'empty');
      });
    });
    if (this.config.p1_cells) {
      _.each(this.config.p1_cells, (p1_cell) => {
        this.board[p1_cell[0]][p1_cell[1]]['owner'] = 'p1';
      });
    }
    if (this.config.p2_cells) {
      _.each(this.config.p2_cells, (p2_cell) => {
        this.board[p2_cell[0]][p2_cell[1]]['owner'] = 'p2';
      });
    }
    if (this.config.blocked_cells) {
      _.each(this.config.blocked_cells, (blocked_cell) => {
        this.board[blocked_cell[0]][blocked_cell[1]]['enabled'] = false;
        this.board[blocked_cell[0]][blocked_cell[1]]['owner'] = 'blocked';
      });
    }
    this.updateScores();
    this.cellSize = this.sanitizer.bypassSecurityTrustStyle('calc((100vw - 2rem - ' + (2 * this.config.cols) + 'px) / ' + this.config.cols + ')');
    this.arrowDownPosition = this.sanitizer.bypassSecurityTrustStyle('calc(3 * (100vw + 2rem - ' + (2 * this.config.cols) + 'px) / ' + this.config.cols + ')');
    this.arrowLeftPosition = this.sanitizer.bypassSecurityTrustStyle('calc((100vw + 6rem - ' + (2 * this.config.cols) + 'px) / ' + this.config.cols + ')');
    this.board[1][3]['isRippleEnabled'] = true;
    this.arrowDownHidden = "d-block";
  }

  getCellBackground(cell) {
    if (cell.owner === 'p1') {
      return this.p1Color;
    } else if (cell.owner === 'p2') {
      return this.p2Color;
    } else if (cell.owner === 'empty') {
      return this.boardBackground;
    }
    return 'transparent';
  }

  onCellClick = (i: number, j: number) => {
    if (this.currentStep === 1) {
      if (i === 1 && j === 3) {
        this.board[1][3]['isRippleEnabled'] = false;
        this.arrowDownHidden = "d-none";
        this.checkAndRunMove(i, j);
        this.updatePlayerControls();
        this.currentStep = 2;
        setTimeout(() => {
          this.board[0][0]['isRippleEnabled'] = true;
          this.arrowLeftHidden = "d-block";
          this.currentStepMessage = "The AI had its turn! Try moving diagonaly now.";
        }, 1200);
      } else {
        console.log("Not allowed. Follow tutorial steps for now.");
      }
    } else if (this.currentStep === 2) {
      if (i === 0 && j === 0) {
        this.board[0][0]['isRippleEnabled'] = false;
        this.arrowLeftHidden = "d-none";
        this.checkAndRunMove(i, j);
        this.updatePlayerControls();
        this.currentStep = 3;
        this.currentStepMessage = "thats it! its you v/s computer now";
        setTimeout(() => {
          this.currentStepMessage = "";
        }, 2500);
      } else {
        console.log("Not allowed. Follow tutorial steps for now.");
      }
    }
    else if (this.currentStep === 3) {
      this.runClickEvents(i, j);
    }
  }

  runClickEvents(i: number, j: number) {
    const self = this;

    // Check if currentplayer has clicked this cell
    if (self.currentPlayer === self.computerPlayer) {
      self.board[i][j]['invalid'] = true;
      setTimeout(function () {
        self.board[i][j]['invalid'] = false;
      }, 400);
    } else if (self.board[i][j]['owner'] === 'blocked') { // Check if Cell is blocked
      console.log('Cell is Blocked for moves');
    } else if (self.board[i][j]['owner'] !== 'empty') { // Check if Cell already occupied
      self.board[i][j]['invalid'] = true;
      setTimeout(function () {
        self.board[i][j]['invalid'] = false;
      }, 400);
    } else if (!self.checkMove(i, j)) { // Check if move is available here
      self.board[i][j]['invalid'] = true;
      setTimeout(function () {
        self.board[i][j]['invalid'] = false;
      }, 400);
    } else {
      // Run Current Player Move
      self.checkAndRunMove(i, j);

      // Update Player Controls and check next moves
      self.updatePlayerControls();
    }
  }

  endGame() {
    this.refreshGame();
  }

  continueGame() {
    if (this.currentPlayer === this.computerPlayer) {
      this.runComputerMove();
    }
  }

  updatePlayerControls() {
    // Check if next player has moves available
    if (this.checkIfPlayerHasMoves(true)) {
      this.changePlayerControl();
      if (this.currentPlayer === this.computerPlayer) {
        this.runComputerMove();
      }
    } else {
      // Game to continue on click of continue on modal (continueGame() method)
      if (!this.checkIfPlayerHasMoves(false)) {
        setTimeout(() => {
          this.menuConfig = new Menu("Game Over!", undefined, this.menuItems);
          $('#app-menu-id').modal('show');
        }, 500);
      } else {
        if (this.currentPlayer === this.computerPlayer) {
          this.menuConfig = new Menu("No Moves left!", "No moves left for you. Computer will run next move!", undefined);
        } else {
          this.menuConfig = new Menu("No Moves left!", "No moves left for computer. You can run a move again!", undefined);
        }
        $('#app-menu-id').modal('show');
        setTimeout(() => {
          $('#app-menu-id').modal('hide');
          setTimeout(() => {
            if (this.currentPlayer === this.computerPlayer) {
              this.runComputerMove();
            }
          }, 500);
        }, 3000);
      }
    }
  }

  runComputerMove() {
    const self = this;
    setTimeout(function () {
      let movesAvailable = false;
      for (let ii = 0; ii < self.config.rows; ii++) {
        for (let jj = 0; jj < self.config.cols; jj++) {
          if (self.board[ii][jj]['owner'] === 'empty') {
            movesAvailable = self.checkAndRunMove(ii, jj);
            if (movesAvailable) { break; }
          }
        }
        if (movesAvailable) { break; }
      }
      // Update Player Controls and check next moves
      self.updatePlayerControls();
    }, 1000);
  }

  checkIfPlayerHasMoves(isCheckOpponent: boolean) {
    const self = this;
    if (isCheckOpponent) {
      this.changePlayerControl();
    }
    let movesAvailable = false;
    for (let ii = 0; ii < self.config.rows; ii++) {
      for (let jj = 0; jj < self.config.cols; jj++) {
        if (self.board[ii][jj]['owner'] === 'empty') {
          movesAvailable = self.checkMove(ii, jj);
          if (movesAvailable) { break; }
        }
      }
      if (movesAvailable) { break; }
    }
    if (isCheckOpponent) {
      this.changePlayerControl();
    }
    return movesAvailable;
  }

  changePlayerControl() {
    const temp = this.opponentPlayer;
    this.opponentPlayer = this.currentPlayer;
    this.currentPlayer = temp;
    console.log('Current Player is: ' + this.currentPlayer);
  }

  checkMove(i: number, j: number) {
    const k1 = this.checkDirection1(i, j);
    const k2 = this.checkDirection2(i, j);
    const k3 = this.checkDirection3(i, j);
    const k4 = this.checkDirection4(i, j);
    const k5 = this.checkDirection5(i, j);
    const k6 = this.checkDirection6(i, j);
    const k7 = this.checkDirection7(i, j);
    const k8 = this.checkDirection8(i, j);

    return k1 !== -1 || k2 !== -1 || k3 !== -1 || k4 !== -1 || k5 !== -1 || k6 !== -1 || k7 !== -1 || k8 !== -1;
  }

  checkAndRunMove(i: number, j: number) {
    const self = this;
    const k1 = this.checkDirection1(i, j);
    const k2 = this.checkDirection2(i, j);
    const k3 = this.checkDirection3(i, j);
    const k4 = this.checkDirection4(i, j);
    const k5 = this.checkDirection5(i, j);
    const k6 = this.checkDirection6(i, j);
    const k7 = this.checkDirection7(i, j);
    const k8 = this.checkDirection8(i, j);

    for (let q = 0; q < k1; q++) { this.setCellChanges(i, j + q); }
    for (let q = 0; q < k2; q++) { this.setCellChanges(i, j - q); }
    for (let q = 0; q < k3; q++) { this.setCellChanges(i + q, j); }
    for (let q = 0; q < k4; q++) { this.setCellChanges(i - q, j); }
    for (let q = 0; q < k5; q++) { this.setCellChanges(i + q, j + q); }
    for (let q = 0; q < k6; q++) { this.setCellChanges(i - q, j + q); }
    for (let q = 0; q < k7; q++) { this.setCellChanges(i + q, j - q); }
    for (let q = 0; q < k8; q++) { this.setCellChanges(i - q, j - q); }

    this.updateScores();
    // clear change transforms with transition
    setTimeout(function () {
      for (let row = 0; row < self.config.rows; row++) {
        for (let col = 0; col < self.config.cols; col++) {
          self.board[row][col]['changed'] = false;
        }
      }
    }, 200);

    return k1 !== -1 || k2 !== -1 || k3 !== -1 || k4 !== -1 || k5 !== -1 || k6 !== -1 || k7 !== -1 || k8 !== -1;
  }

  setCellChanges(i: number, j: number) {
    this.board[i][j]['owner'] = this.currentPlayer;
    this.board[i][j]['changed'] = true;
  }

  updateScores() {
    const self = this;
    let p1cells = 0;
    let p2cells = 0;
    for (let i = 0; i < self.config.rows; i++) {
      for (let j = 0; j < self.config.cols; j++) {
        if (self.board[i][j]['owner'] === 'p1') {
          p1cells++;
        } else if (self.board[i][j]['owner'] === 'p2') {
          p2cells++;
        }
      }
    }
    self.p1score = p1cells;
    self.p2score = p2cells;
    if (self.p1score === self.p2score) {
      self.scorePercentage = 50;
    } else if (self.p1score === 0 && self.p2score !== 0) {
      self.scorePercentage = 0;
    } else if (self.p2score === 0 && self.p1score !== 0) {
      self.scorePercentage = 100;
    } else if (self.p1score !== 0 && self.p2score !== 0) {
      self.scorePercentage = (self.p1score / (self.p1score + self.p2score)) * 100;
    }
  }

  checkDirection1(i: number, j: number) {
    const self = this;
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; j + k < self.config.cols; k++) {
      if (self.board[i][j + k]['owner'] === self.opponentPlayer) {
        coverage++;
      } else if (self.board[i][j + k]['owner'] === self.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

  checkDirection2(i: number, j: number) {
    const self = this;
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; j - k >= 0; k++) {
      if (self.board[i][j - k]['owner'] === self.opponentPlayer) {
        coverage++;
      } else if (self.board[i][j - k]['owner'] === self.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

  checkDirection3(i: number, j: number) {
    const self = this;
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; i + k < self.config.rows; k++) {
      if (self.board[i + k][j]['owner'] === self.opponentPlayer) {
        coverage++;
      } else if (self.board[i + k][j]['owner'] === self.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

  checkDirection4(i: number, j: number) {
    const self = this;
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; i - k >= 0; k++) {
      if (!(i - k < 0)) {
        if (self.board[i - k][j]['owner'] === self.opponentPlayer) {
          coverage++;
        } else if (self.board[i - k][j]['owner'] === self.currentPlayer && coverage > 0) {
          directionSuccessPoint = k;
          break;
        } else { break; }
      }
    }
    return directionSuccessPoint;
  }

  checkDirection5(i: number, j: number) {
    const self = this;
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; i + k < self.config.rows && j + k < self.config.cols; k++) {
      if (self.board[i + k][j + k]['owner'] === self.opponentPlayer) {
        coverage++;
      } else if (self.board[i + k][j + k]['owner'] === self.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

  checkDirection6(i: number, j: number) {
    const self = this;
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; i - k >= 0 && j + k < self.config.cols; k++) {
      if (self.board[i - k][j + k]['owner'] === self.opponentPlayer) {
        coverage++;
      } else if (self.board[i - k][j + k]['owner'] === self.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

  checkDirection7(i: number, j: number) {
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; i + k < this.config.rows && j - k >= 0; k++) {
      if (this.board[i + k][j - k]['owner'] === this.opponentPlayer) {
        coverage++;
      } else if (this.board[i + k][j - k]['owner'] === this.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

  checkDirection8(i: number, j: number) {
    let coverage = 0;
    let directionSuccessPoint = -1;
    for (let k = 1; i - k >= 0 && j - k >= 0; k++) {
      if (this.board[i - k][j - k]['owner'] === this.opponentPlayer) {
        coverage++;
      } else if (this.board[i - k][j - k]['owner'] === this.currentPlayer && coverage > 0) {
        directionSuccessPoint = k;
        break;
      } else { break; }
    }
    return directionSuccessPoint;
  }

}
