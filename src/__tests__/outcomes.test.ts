import { checkBetOutcome } from '../lib/outcomes';
import type { BetResult, RaceResult } from '../types';

function makeBet(overrides: Partial<BetResult>): BetResult {
  return {
    betType: 'Win',
    modifier: 'Straight',
    combinations: 1,
    unitCost: 1,
    totalCost: 1,
    horses: [3],
    combinationList: [[3]],
    ...overrides,
  };
}

function makeResult(
  first: number | null,
  second: number | null = null,
  third: number | null = null,
  fourth: number | null = null,
): RaceResult {
  return { first, second, third, fourth };
}

describe('checkBetOutcome — Win', () => {
  it('returns pending when no result entered', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Win', combinationList: [[3]] }), {})).toBe('pending');
  });

  it('returns win when horse finishes 1st', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Win', combinationList: [[3]] }), { 0: makeResult(3) })).toBe('win');
  });

  it('returns loss when horse does not finish 1st', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Win', combinationList: [[3]] }), { 0: makeResult(5) })).toBe('loss');
  });

  it('Win box wins if any selected horse finishes 1st', () => {
    const entry = makeBet({ betType: 'Win', horses: [3, 5], combinationList: [[3], [5]] });
    expect(checkBetOutcome(entry, { 0: makeResult(5) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(7) })).toBe('loss');
  });
});

describe('checkBetOutcome — Place', () => {
  it('returns pending when 2nd not entered', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Place', combinationList: [[3]] }), { 0: makeResult(5, null) })).toBe('pending');
  });

  it('wins finishing 1st', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Place', combinationList: [[3]] }), { 0: makeResult(3, 5) })).toBe('win');
  });

  it('wins finishing 2nd', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Place', combinationList: [[3]] }), { 0: makeResult(5, 3) })).toBe('win');
  });

  it('loses finishing 3rd', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Place', combinationList: [[3]] }), { 0: makeResult(5, 7, 3) })).toBe('loss');
  });
});

describe('checkBetOutcome — Show', () => {
  it('returns pending when 3rd not entered', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Show', combinationList: [[3]] }), { 0: makeResult(5, 7, null) })).toBe('pending');
  });

  it('wins finishing 1st, 2nd, or 3rd', () => {
    const entry = makeBet({ betType: 'Show', combinationList: [[3]] });
    expect(checkBetOutcome(entry, { 0: makeResult(3, 5, 7) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(5, 3, 7) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(5, 7, 3) })).toBe('win');
  });

  it('loses finishing out of the money', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Show', combinationList: [[3]] }), { 0: makeResult(5, 7, 1) })).toBe('loss');
  });
});

describe('checkBetOutcome — Exacta', () => {
  it('straight: wins with exact order', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Exacta', combinationList: [[3, 5]] }), { 0: makeResult(3, 5) })).toBe('win');
  });

  it('straight: loses when order is reversed', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Exacta', combinationList: [[3, 5]] }), { 0: makeResult(5, 3) })).toBe('loss');
  });

  it('box: wins in either order', () => {
    const entry = makeBet({ betType: 'Exacta', combinationList: [[3, 5], [5, 3]] });
    expect(checkBetOutcome(entry, { 0: makeResult(5, 3) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(3, 5) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(3, 7) })).toBe('loss');
  });
});

describe('checkBetOutcome — Quinella', () => {
  it('wins when horses finish 1st and 2nd in any order', () => {
    const entry = makeBet({ betType: 'Quinella', combinationList: [[3, 5]] });
    expect(checkBetOutcome(entry, { 0: makeResult(3, 5) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(5, 3) })).toBe('win');
  });

  it('loses when neither or only one horse finishes in top 2', () => {
    const entry = makeBet({ betType: 'Quinella', combinationList: [[3, 5]] });
    expect(checkBetOutcome(entry, { 0: makeResult(3, 7) })).toBe('loss');
    expect(checkBetOutcome(entry, { 0: makeResult(7, 9) })).toBe('loss');
  });
});

describe('checkBetOutcome — Trifecta', () => {
  it('straight: wins with exact 1-2-3 order', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Trifecta', combinationList: [[3, 5, 7]] }), { 0: makeResult(3, 5, 7) })).toBe('win');
  });

  it('straight: loses when order differs', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Trifecta', combinationList: [[3, 5, 7]] }), { 0: makeResult(3, 7, 5) })).toBe('loss');
  });

  it('box: wins in any of the covered orders', () => {
    const entry = makeBet({
      betType: 'Trifecta',
      combinationList: [[3,5,7],[3,7,5],[5,3,7],[5,7,3],[7,3,5],[7,5,3]],
    });
    expect(checkBetOutcome(entry, { 0: makeResult(7, 3, 5) })).toBe('win');
    expect(checkBetOutcome(entry, { 0: makeResult(1, 3, 5) })).toBe('loss');
  });

  it('returns pending when 3rd not entered', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Trifecta', combinationList: [[3, 5, 7]] }), { 0: makeResult(3, 5, null) })).toBe('pending');
  });
});

describe('checkBetOutcome — Multi-race', () => {
  it('returns pending in standard mode (no raceNumber)', () => {
    const entry = makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs: [[3, 5], [7]],
      combinationList: [[3, 7], [5, 7]],
    });
    expect(checkBetOutcome(entry, { 1: makeResult(3), 2: makeResult(7) })).toBe('pending');
  });

  it('returns pending when a required race result is missing', () => {
    const entry = makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs: [[3, 5], [7]],
      combinationList: [[3, 7], [5, 7]],
      raceNumber: 3,
    });
    expect(checkBetOutcome(entry, { 3: makeResult(3) })).toBe('pending');
  });

  it('wins when every leg includes the race winner', () => {
    const entry = makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs: [[3, 5], [7]],
      combinationList: [[3, 7], [5, 7]],
      raceNumber: 3,
    });
    expect(checkBetOutcome(entry, { 3: makeResult(3), 4: makeResult(7) })).toBe('win');
  });

  it('loses when any leg does not include the race winner', () => {
    const entry = makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs: [[3, 5], [7]],
      combinationList: [[3, 7], [5, 7]],
      raceNumber: 3,
    });
    expect(checkBetOutcome(entry, { 3: makeResult(1), 4: makeResult(7) })).toBe('loss');
  });

  it('Pick 3 — wins when all three legs cover the winners', () => {
    const entry = makeBet({
      betType: 'Pick 3',
      modifier: '',
      horses: [],
      legs: [[1], [4], [6]],
      combinationList: [[1, 4, 6]],
      raceNumber: 5,
    });
    expect(checkBetOutcome(entry, { 5: makeResult(1), 6: makeResult(4), 7: makeResult(6) })).toBe('win');
  });
});

describe('checkBetOutcome — Across the Board', () => {
  it('returns pending when 3rd not entered', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Across the Board', combinationList: [[4]] }), { 0: makeResult(4, 2, null) })).toBe('pending');
  });

  it('wins finishing 1st', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Across the Board', combinationList: [[4]] }), { 0: makeResult(4, 2, 6) })).toBe('win');
  });

  it('wins finishing 2nd', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Across the Board', combinationList: [[4]] }), { 0: makeResult(1, 4, 6) })).toBe('win');
  });

  it('wins finishing 3rd', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Across the Board', combinationList: [[4]] }), { 0: makeResult(1, 2, 4) })).toBe('win');
  });

  it('loses finishing out of the money', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Across the Board', combinationList: [[4]] }), { 0: makeResult(1, 2, 6) })).toBe('loss');
  });
});

describe('checkBetOutcome — Trifecta Part Wheel (positional)', () => {
  // Positional part-wheel stores legs (per-position selections) AND horses (legs.flat()).
  // Must NOT be treated as multi-race — it's a single-race bet.
  function makePositionalPartWheel(legs: number[][], raceNumber = 5): BetResult {
    const { generatePositionalCombos } = require('../lib/betting');
    return makeBet({
      betType: 'Trifecta',
      modifier: 'Part Wheel',
      horses: legs.flat(),
      legs,
      combinationList: generatePositionalCombos(legs),
      raceNumber,
    });
  }

  it('returns pending when 2nd not entered', () => {
    const bet = makePositionalPartWheel([[1, 2], [3, 4], [5]]);
    expect(checkBetOutcome(bet, { 5: makeResult(1, null) })).toBe('pending');
  });

  it('returns pending when 3rd not entered', () => {
    const bet = makePositionalPartWheel([[1, 2], [3, 4], [5]]);
    expect(checkBetOutcome(bet, { 5: makeResult(1, 3, null) })).toBe('pending');
  });

  it('wins when result matches a valid combination', () => {
    const bet = makePositionalPartWheel([[1, 2], [3, 4], [5]]);
    // valid combos: [1,3,5],[1,4,5],[2,3,5],[2,4,5]
    expect(checkBetOutcome(bet, { 5: makeResult(1, 4, 5) })).toBe('win');
  });

  it('loses when result does not match any combination', () => {
    const bet = makePositionalPartWheel([[1, 2], [3, 4], [5]]);
    expect(checkBetOutcome(bet, { 5: makeResult(1, 3, 6) })).toBe('loss');
  });

  it('is NOT evaluated as multi-race (does not look at race 6 or 7)', () => {
    const bet = makePositionalPartWheel([[1], [2], [3]]);
    // Only race 5 result — should resolve, not stay pending waiting for races 6 & 7
    expect(checkBetOutcome(bet, { 5: makeResult(1, 2, 3) })).toBe('win');
    expect(checkBetOutcome(bet, { 5: makeResult(1, 2, 4) })).toBe('loss');
  });
});

describe('checkBetOutcome — Superfecta Part Wheel (positional)', () => {
  function makeSuperPositionalPartWheel(legs: number[][], raceNumber = 3): BetResult {
    const { generatePositionalCombos } = require('../lib/betting');
    return makeBet({
      betType: 'Superfecta',
      modifier: 'Part Wheel',
      horses: legs.flat(),
      legs,
      combinationList: generatePositionalCombos(legs),
      raceNumber,
    });
  }

  it('returns pending when 4th not entered', () => {
    const bet = makeSuperPositionalPartWheel([[1], [2], [3], [4, 5]]);
    expect(checkBetOutcome(bet, { 3: makeResult(1, 2, 3, null) })).toBe('pending');
  });

  it('wins when result matches a valid combination', () => {
    const bet = makeSuperPositionalPartWheel([[1], [2], [3], [4, 5]]);
    expect(checkBetOutcome(bet, { 3: makeResult(1, 2, 3, 4) })).toBe('win');
    expect(checkBetOutcome(bet, { 3: makeResult(1, 2, 3, 5) })).toBe('win');
  });

  it('loses when result does not match', () => {
    const bet = makeSuperPositionalPartWheel([[1], [2], [3], [4, 5]]);
    expect(checkBetOutcome(bet, { 3: makeResult(1, 2, 3, 6) })).toBe('loss');
  });

  it('is NOT evaluated as multi-race', () => {
    const bet = makeSuperPositionalPartWheel([[1], [2], [3], [4]]);
    expect(checkBetOutcome(bet, { 3: makeResult(1, 2, 3, 4) })).toBe('win');
  });
});

describe('checkBetOutcome — Trifecta Key Horse', () => {
  function makeTrifectaKeyHorse(horses: number[], raceNumber = 2): BetResult {
    const { generateCombinationList } = require('../lib/betting');
    return makeBet({
      betType: 'Trifecta',
      modifier: 'Key Horse',
      horses,
      combinationList: generateCombinationList('trifecta', 'key-horse', horses),
      raceNumber,
    });
  }

  it('wins when key horse finishes 1st', () => {
    const bet = makeTrifectaKeyHorse([4, 5, 6, 7]);
    expect(checkBetOutcome(bet, { 2: makeResult(4, 5, 6) })).toBe('win');
  });

  it('wins when key horse finishes 2nd', () => {
    const bet = makeTrifectaKeyHorse([4, 5, 6, 7]);
    expect(checkBetOutcome(bet, { 2: makeResult(5, 4, 6) })).toBe('win');
  });

  it('wins when key horse finishes 3rd', () => {
    const bet = makeTrifectaKeyHorse([4, 5, 6, 7]);
    expect(checkBetOutcome(bet, { 2: makeResult(5, 6, 4) })).toBe('win');
  });

  it('loses when result uses horses not in the ticket', () => {
    const bet = makeTrifectaKeyHorse([4, 5, 6, 7]);
    expect(checkBetOutcome(bet, { 2: makeResult(1, 2, 3) })).toBe('loss');
  });

  it('loses when key horse is not in the result at all', () => {
    const bet = makeTrifectaKeyHorse([4, 5, 6, 7]);
    expect(checkBetOutcome(bet, { 2: makeResult(5, 6, 7) })).toBe('loss');
  });

  it('returns pending when 3rd not entered', () => {
    const bet = makeTrifectaKeyHorse([4, 5, 6, 7]);
    expect(checkBetOutcome(bet, { 2: makeResult(4, 5, null) })).toBe('pending');
  });
});

describe('checkBetOutcome — Superfecta Key Horse', () => {
  function makeSuperKeyHorse(horses: number[], raceNumber = 1): BetResult {
    const { generateCombinationList } = require('../lib/betting');
    return makeBet({
      betType: 'Superfecta',
      modifier: 'Key Horse',
      horses,
      combinationList: generateCombinationList('superfecta', 'key-horse', horses),
      raceNumber,
    });
  }

  it('wins when key horse finishes 1st', () => {
    const bet = makeSuperKeyHorse([1, 2, 3, 4, 5]);
    expect(checkBetOutcome(bet, { 1: makeResult(1, 2, 3, 4) })).toBe('win');
  });

  it('wins when key horse finishes 4th', () => {
    const bet = makeSuperKeyHorse([1, 2, 3, 4, 5]);
    expect(checkBetOutcome(bet, { 1: makeResult(2, 3, 4, 1) })).toBe('win');
  });

  it('loses when key horse is not in the result', () => {
    const bet = makeSuperKeyHorse([1, 2, 3, 4, 5]);
    expect(checkBetOutcome(bet, { 1: makeResult(2, 3, 4, 5) })).toBe('loss');
  });

  it('returns pending when 4th not entered', () => {
    const bet = makeSuperKeyHorse([1, 2, 3, 4, 5]);
    expect(checkBetOutcome(bet, { 1: makeResult(1, 2, 3, null) })).toBe('pending');
  });
});

describe('checkBetOutcome — Quinella Wheel / Part Wheel', () => {
  function makeQuinellaWheel(horses: number[], raceNumber = 4): BetResult {
    const { generateCombinationList } = require('../lib/betting');
    return makeBet({
      betType: 'Quinella',
      modifier: 'Wheel',
      horses,
      combinationList: generateCombinationList('quinella', 'wheel', horses),
      raceNumber,
    });
  }

  it('wins when key horse and any with-horse finish in top 2 (any order)', () => {
    const bet = makeQuinellaWheel([3, 1, 2, 4]);
    // key=3, with=[1,2,4]: combos are [3,1],[3,2],[3,4]
    expect(checkBetOutcome(bet, { 4: makeResult(3, 1) })).toBe('win');
    expect(checkBetOutcome(bet, { 4: makeResult(1, 3) })).toBe('win');
    expect(checkBetOutcome(bet, { 4: makeResult(3, 4) })).toBe('win');
    expect(checkBetOutcome(bet, { 4: makeResult(4, 3) })).toBe('win');
  });

  it('loses when key horse is not in top 2', () => {
    const bet = makeQuinellaWheel([3, 1, 2, 4]);
    expect(checkBetOutcome(bet, { 4: makeResult(1, 2) })).toBe('loss');
  });

  it('loses when key horse is in top 2 but with-horse is not', () => {
    const bet = makeQuinellaWheel([3, 1, 2]);
    // key=3, with=[1,2]: combos [3,1],[3,2] — horse 5 is not covered
    expect(checkBetOutcome(bet, { 4: makeResult(3, 5) })).toBe('loss');
  });

  it('returns pending when 2nd not entered', () => {
    const bet = makeQuinellaWheel([3, 1, 2]);
    expect(checkBetOutcome(bet, { 4: makeResult(3, null) })).toBe('pending');
  });
});

describe('isBetVisibleAtRace', () => {
  const { isBetVisibleAtRace } = require('../lib/outcomes');

  const multiRaceBet = (raceNumber: number, legs: number[][], payout?: number) =>
    makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs,
      combinationList: legs[0].flatMap((a) => legs[1].map((b) => [a, b])),
      raceNumber,
      payout,
    });

  it('standard bet visible only at its race', () => {
    const bet = makeBet({ raceNumber: 3 });
    expect(isBetVisibleAtRace(bet, 3, {})).toBe(true);
    expect(isBetVisibleAtRace(bet, 4, {})).toBe(false);
    expect(isBetVisibleAtRace(bet, 2, {})).toBe(false);
  });

  it('multi-race bet visible at its starting race', () => {
    const bet = multiRaceBet(1, [[1], [2]]);
    expect(isBetVisibleAtRace(bet, 1, {})).toBe(true);
  });

  it('multi-race bet visible within its range', () => {
    const bet = multiRaceBet(1, [[1], [2]]);
    expect(isBetVisibleAtRace(bet, 2, {})).toBe(true);
  });

  it('multi-race bet not visible after range if it lost', () => {
    const bet = multiRaceBet(1, [[1], [2]]);
    const results = { 1: makeResult(5), 2: makeResult(5) };
    expect(isBetVisibleAtRace(bet, 3, results)).toBe(false);
  });

  it('multi-race bet visible after range if won and unpaid', () => {
    const bet = multiRaceBet(1, [[1], [2]]);
    const results = { 1: makeResult(1), 2: makeResult(2) };
    expect(isBetVisibleAtRace(bet, 3, results)).toBe(true);
  });

  it('multi-race bet not visible after range if won and paid', () => {
    const bet = multiRaceBet(1, [[1], [2]], 40);
    const results = { 1: makeResult(1), 2: makeResult(2) };
    expect(isBetVisibleAtRace(bet, 3, results)).toBe(false);
  });

  it('Pick 3 visible across all three races', () => {
    const bet = makeBet({
      betType: 'Pick 3',
      modifier: '',
      horses: [],
      legs: [[1], [4], [6]],
      combinationList: [[1, 4, 6]],
      raceNumber: 5,
    });
    expect(isBetVisibleAtRace(bet, 5, {})).toBe(true);
    expect(isBetVisibleAtRace(bet, 6, {})).toBe(true);
    expect(isBetVisibleAtRace(bet, 7, {})).toBe(true);
    expect(isBetVisibleAtRace(bet, 8, {})).toBe(false);
  });
});

describe('isBetScratchConflict', () => {
  const { isBetScratchConflict } = require('../lib/outcomes');

  it('returns false when no scratches', () => {
    const bet = makeBet({ raceNumber: 2, horses: [3, 5] });
    expect(isBetScratchConflict(bet, 2, [])).toBe(false);
  });

  it('detects scratch conflict in standard bet horses array', () => {
    const bet = makeBet({ raceNumber: 2, horses: [3, 5] });
    expect(isBetScratchConflict(bet, 2, [3])).toBe(true);
    expect(isBetScratchConflict(bet, 2, [7])).toBe(false);
  });

  it('no conflict when scratch is at a different race', () => {
    const bet = makeBet({ raceNumber: 2, horses: [3, 5] });
    expect(isBetScratchConflict(bet, 3, [3])).toBe(false);
  });

  it('detects scratch conflict in multi-race leg 0 (starting race)', () => {
    const bet = makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs: [[3, 5], [7]],
      combinationList: [[3, 7], [5, 7]],
      raceNumber: 1,
    });
    expect(isBetScratchConflict(bet, 1, [3])).toBe(true);
    expect(isBetScratchConflict(bet, 1, [7])).toBe(false);
  });

  it('detects scratch conflict in multi-race leg 1 (future race)', () => {
    const bet = makeBet({
      betType: 'Daily Double',
      modifier: '',
      horses: [],
      legs: [[3, 5], [7]],
      combinationList: [[3, 7], [5, 7]],
      raceNumber: 1,
    });
    expect(isBetScratchConflict(bet, 2, [7])).toBe(true);
    expect(isBetScratchConflict(bet, 2, [3])).toBe(false);
  });

  it('detects scratch in any Pick 3 leg', () => {
    const bet = makeBet({
      betType: 'Pick 3',
      modifier: '',
      horses: [],
      legs: [[1], [4], [6]],
      combinationList: [[1, 4, 6]],
      raceNumber: 5,
    });
    expect(isBetScratchConflict(bet, 5, [1])).toBe(true);
    expect(isBetScratchConflict(bet, 6, [4])).toBe(true);
    expect(isBetScratchConflict(bet, 7, [6])).toBe(true);
    expect(isBetScratchConflict(bet, 7, [4])).toBe(false);
    expect(isBetScratchConflict(bet, 8, [6])).toBe(false);
  });
});

describe('checkBetOutcome — Superfecta', () => {
  it('returns pending when no results', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Superfecta', combinationList: [[1, 2, 3, 4]] }), {})).toBe('pending');
  });

  it('returns pending when fourth is null', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Superfecta', combinationList: [[1, 2, 3, 4]] }), { 0: makeResult(1, 2, 3) })).toBe('pending');
  });

  it('wins when straight combo matches all 4 positions', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Superfecta', combinationList: [[1, 2, 3, 4]] }), { 0: makeResult(1, 2, 3, 4) })).toBe('win');
  });

  it('loses when 4th place does not match', () => {
    expect(checkBetOutcome(makeBet({ betType: 'Superfecta', combinationList: [[1, 2, 3, 4]] }), { 0: makeResult(1, 2, 3, 5) })).toBe('loss');
  });

  it('wins box when combo list includes the matching order', () => {
    const entry = makeBet({
      betType: 'Superfecta',
      combinationList: [[1,2,3,4],[1,2,4,3],[1,3,2,4],[1,3,4,2],[1,4,2,3],[1,4,3,2]],
    });
    expect(checkBetOutcome(entry, { 0: makeResult(1, 4, 2, 3) })).toBe('win');
  });
});
