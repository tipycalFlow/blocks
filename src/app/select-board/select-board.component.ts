import { Component, OnInit } from '@angular/core';
import { Boards } from '../models/boards';
import { _ } from 'underscore';
import { Cell } from '../models/cell.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-board',
  templateUrl: './select-board.component.html',
  styleUrls: ['./select-board.component.css']
})
export class SelectBoardComponent implements OnInit {

  constructor(private router: Router) { }

  boards;

  cellBorderPreference = 'stop';
  board;
  config;
  p1Color = '#40C0CB';
  p2Color = '#AEE239';
  boardBackground = '#C7C0B5';
  cellSize = '0.85rem';

  ngOnInit() {
    this.boards = [];
    _.each(Boards, (board, key) => {
      this.boards.push(this.generateBoardObject(board, key));
    });
  }

  generateBoardObject(config, key) {
    let board = {};
    board = _.times(config.rows, () => {
      return _.times(config.cols, () => {
        return 0;
      });
    });
    _.times(config.rows, (row) => {
      _.times(config.cols, (col) => {
        board[row][col] = new Cell(1, true, 'empty');
      });
    });
    if (config.p1_cells) {
      _.each(config.p1_cells, (p1_cell) => {
        board[p1_cell[0]][p1_cell[1]]['owner'] = 'p1';
      });
    }
    if (config.p2_cells) {
      _.each(config.p2_cells, (p2_cell) => {
        board[p2_cell[0]][p2_cell[1]]['owner'] = 'p2';
      });
    }
    if (config.blocked_cells) {
      _.each(config.blocked_cells, (blocked_cell) => {
        board[blocked_cell[0]][blocked_cell[1]]['enabled'] = false;
        board[blocked_cell[0]][blocked_cell[1]]['owner'] = 'blocked';
      });
    }
    return { "name": config.name, "config": board, "key": key };
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

  playWithBoard(key) {
    this.router.navigate(['square-board', key]);
  }
}
