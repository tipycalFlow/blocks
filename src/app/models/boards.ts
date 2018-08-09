export const Boards = {
    '1001': {
        rows: 8,
        cols: 8,
        p1_cells: [[3, 3], [4, 4]],
        p2_cells: [[4, 3], [3, 4]],
        blocked_cells: [[1, 1], [1, 6], [6, 1], [6, 6]],
        name: '8x8-diagonal'
    },
    '1002': {
        rows: 8,
        cols: 8,
        p1_cells: [[3, 3], [3, 4]],
        p2_cells: [[4, 3], [4, 4]],
        blocked_cells: undefined,
        name: '8x8-normal'
    },
    '1003': {
        rows: 8,
        cols: 10,
        p1_cells: [[3, 3], [3, 4]],
        p2_cells: [[4, 3], [4, 4]],
        blocked_cells: undefined,
        name: '8x10-normal'
    },
    '1004': {
        rows: 10,
        cols: 10,
        p1_cells: [[3, 3], [3, 4]],
        p2_cells: [[4, 3], [4, 4]],
        blocked_cells: undefined,
        name: '10x10-normal'
    },
    '1005': {
        rows: 10,
        cols: 8,
        p1_cells: [[3, 3], [3, 4]],
        p2_cells: [[4, 3], [4, 4]],
        blocked_cells: undefined,
        name: '10x8-normal'
    },
    '1006': {
        rows: 4,
        cols: 4,
        p1_cells: [[2, 0], [2, 1]],
        p2_cells: [[0, 0], [0, 1], [0, 2], [2, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]],
        blocked_cells: undefined,
        name: 'no-user-moves'
    },
    '1007': {
        rows: 4,
        cols: 4,
        p1_cells: [[0, 0], [0, 1], [0, 2], [2, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]],
        p2_cells: [[2, 0], [2, 1]],
        blocked_cells: undefined,
        name: 'no-computer-moves'
    },
    '1008': {
        rows: 10,
        cols: 10,
        p1_cells: [[0, 0], [0, 1], [0, 2], [2, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]],
        p2_cells: [[2, 0], [2, 1]],
        blocked_cells: undefined,
        name: 'Large One'
    }
};
