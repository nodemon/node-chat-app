const expect = require('expect');
var {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non string values', () => {
    var num = 123;
    expect(isRealString(num)).toNotExist();


  })
  it('should reject string with only spaces', () => {
    expect(isRealString('   ')).toNotExist();
  })
  it('should allow strings with non space characters', () => {
    expect(isRealString('test   ')).toExist();
  })
})
