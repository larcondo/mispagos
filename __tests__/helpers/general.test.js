const { isObject, deepEqual } = require('../../helpers/general');

describe('isObject', () => {
  it('are objects', () => {
    const o1 = { id: 0, text: 'hola', valid: true };
    const o2 = { valid: false, text: 'hello' };

    expect(isObject(o1)).toBe(true);
    expect(isObject(o2)).toBe(true);
  });

  it('are not objects', () => {
    const o1 = 'hola';
    const o2 = 100;

    expect(isObject(o1)).toBe(false);
    expect(isObject(o2)).toBe(false);
  });
});

describe('deepEqual', () => {
  it('equal', () => {
    const o1 = { id: 0, text: 'hola', valid: true };
    const o2 = { id: 0, valid: true, text: 'hola' };

    expect(deepEqual(o1, o2)).toBe(true);
  });

  it('not equal', () => {
    const o1 = { id: 0, text: 'hola', valid: true };
    const o2 = { id: 0, valid: false, text: 'hola' };

    expect(deepEqual(o1, o2)).toBe(false);
  });
});