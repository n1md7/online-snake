import { Block } from './block';

export const populateEmptyGrid = (rows: number, cols: number): unknown[][] => {
  return Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));
};

export const populateGridBlocks = (rows: number, cols: number): Block[][] => {
  const grid = populateEmptyGrid(rows, cols);
  for (const [rowIdx, row] of grid.entries()) {
    for (const colIdx of row.keys()) {
      grid[rowIdx][colIdx] = new Block();
    }
  }

  return grid as Block[][];
};
