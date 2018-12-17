const moment = require('moment')

exports.timeDurationOfDates = (startDate,endDate) => {
  var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
  var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
  var duration = moment.duration(start_date.diff(end_date));
  return duration;
}

exports.accountSid = 'ACf2cd954af3e5933182b3db725f5af742'

exports.authToken = 'caa67c106842a0ffff1e9972791d24ad'

exports.phoneNumber = '+1 938 444 4456'

exports.listId = 'd960d505c5'

exports.apiKey = 'ad8a4dbd047bb155f8c7e767eee9c0d3-us19'

exports.otptimeout = 5

exports.includeAllLogs = false;

exports.jwtConfig = {
  expireTime : '2h',
  secret : 'panjea'
}

exports.customerAttributes = [
  'id',
  'firstName',
  'lastName',
  'streetNo',
  'cityId',
  'stateId',
  'postalCode',
  'countryId',
  'dateOfBirth',
  'countryCode',
  'phoneNumber',
  'email',
  'deviceType',
  'isVerified'
]

exports.creditAttributes = [
  'id',
  'key',
  'value'
]

exports.countryAttributes = [
  'id',
  'countryName'
]

exports.stateAttributes = [
  'id',
  'stateName',
  'countryId'
]

exports.cityAttributes = [
  'id',
  'cityName',
  'stateId'
]

exports.customerBalanceAttributes = [
  'id',
  'customerId',
  'balance'
]

exports.deviceDetailAttributes = [
  'id',
  'customerId',
  'deviceType',
  'deviceId'
]