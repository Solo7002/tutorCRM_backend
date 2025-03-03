const moment = require('moment-timezone');

const convertUTCToStandardTimeZone = (timeZone) => {
  const offsetMatch = timeZone.match(/^UTC([+-]\d{1,2})$/);
  if (offsetMatch) {
    const offsetHours = parseInt(offsetMatch[1], 10);
    const utcOffset = `${offsetHours >= 0 ? '+' : '-'}${Math.abs(offsetHours).toString().padStart(2, '0')}:00`;
    return `Etc/GMT${utcOffset.replace('+', '-').replace('-', '+')}`;
  }
  return timeZone;
};

const convertStandardTimeZoneToUTC = (timeZone) => {
  if (timeZone.startsWith('Etc/GMT')) {
    const offset = parseInt(timeZone.substring(7), 10);
    return `UTC${offset < 0 ? '+' : '-'}${Math.abs(offset)}`;
  }
  return timeZone;
};

const isValidTimeZone = (value) => {
  if (!moment.tz.zone(value)) {
    throw new Error('TimeZone must be a valid time zone');
  }
};

module.exports = {
  convertUTCToStandardTimeZone,
  convertStandardTimeZoneToUTC,
  isValidTimeZone,
};