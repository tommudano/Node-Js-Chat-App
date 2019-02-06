const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    let value = isRealString(89);

    expect(value).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let value = isRealString('     ');

    expect(value).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    let value = isRealString('  Hi there   l ');

    expect(value).toBe(true);
  });
});
