let expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Tom';
    let text = 'Hi there!';
    let message = generateMessage(from, text);

    // expect(message.from).toBe(from);
    // expect(message.text).toBe(text);
    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Deb';
    let latitude = 15;
    let longitude = 140;
    let url = 'https://www.google.com/maps?q=15,140';

    let res = generateLocationMessage(from, latitude, longitude);

    expect(res).toInclude({from, url});
    expect(res.createdAt).toBeA('number');

  });
});
