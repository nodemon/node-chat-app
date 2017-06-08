const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Mike';
    var text = 'Hello'

    var message = generateMessage(from, text);

    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    expect(message.createdAt).toBeA('number');
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Admin';
    var latitude = 45.478834299999995;
    var longitude = -73.7467638;
    var url = "https://www.google.com/maps?q=45.478834299999995,-73.7467638"

    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.from).toBe(from);
    expect(message.url).toBe(url);
    expect(message.createdAt).toBeA('number');
  })
})
