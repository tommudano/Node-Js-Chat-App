let moment = require('moment');

// let date = moment();
// date.add(2020, 'y').subtract(9, 'm');
// console.log(date.format('MMM Do, YYYY'));

let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let createdAt = 1234;
let date = moment(createdAt);
console.log(date.format('h:mm a'));
