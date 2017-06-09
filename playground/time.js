var moment = require('moment');


var date = moment();

date.add(100, 'year').subtract(9, 'months');
console.log(date.format('MMM Do, YYYY'));

var createdAt = 1234;
var date = moment(createdAt);   // milliseconds after 1970
console.log(date.format('MMM Do YYYY h:mm:ss a Z'));
