import D6 from '../src/logic/d6.js';

describe('D6', () => {
  beforeEach(() => {
    D6.construct();
    D6.calculateAll();
  });

  test('should calculate average consumption', () => {
    expect(D6.average.consList).toEqual(expect.any(String));
  });

  test('should calculate measures', () => {
    expect(D6.resMeasure).toEqual(expect.any(Array));
    expect(D6.resMeasure.length).toBeGreaterThanOrEqual(0);
  });

  test('should set person area', () => {
    D6.setPersonArea(2, 100, 200);
    expect(D6.area.persons).toBe(2);
    expect(D6.area.floorArea).toBe(100);
    expect(D6.area.heatedFloorArea).toBe(200);
  });

  // Add more tests for other functions and properties of D6 class

});