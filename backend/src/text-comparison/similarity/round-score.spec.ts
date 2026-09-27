import { roundScore } from './round-score';

describe('roundScore', () => {
  it('rounds to 4 decimal places', () => {
    expect(roundScore(1 / 3)).toBe(0.3333);
  });

  it('keeps values already rounded unchanged', () => {
    expect(roundScore(0.5)).toBe(0.5);
  });

  it('rounds up correctly at the boundary', () => {
    expect(roundScore(0.123456)).toBe(0.1235);
  });
});
