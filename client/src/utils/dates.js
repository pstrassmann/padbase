import moment from 'moment';
import { numbersOnly } from './text';

const dateMask = (input) => {
  return input.replace(/[^0-9-]/g, '').slice(0,8);
}

const formatDate = (date) => {
  if (date === undefined || date === null) return 'N/A';
  return moment(date).format('MM-DD-YY');
}

const validatedDate = (dateMMDDYY) => {
  if (dateMMDDYY === undefined) return undefined;
  const momentDate = moment(dateMMDDYY, 'MM-DD-YY').format();
  if (momentDate === 'Invalid date') {
    return null
  } else {
    return momentDate;
  }
}

// Expects date object or properly formatted ISO Date e.g 2020-08-18
const formatAge = (birthday) => {
  if (!birthday || birthday === 'Invalid date') return 'N/A';
  if (moment(birthday).isAfter(Date.now())) return 'Err';
  const nowMoment = moment(Date.now());
  const monthAge = nowMoment.diff(birthday, 'months');
  if (monthAge === 0) {
    return `${nowMoment.diff(birthday, 'days')} days`;
  }
  if (monthAge < 12) {
    return `${monthAge} mo`;
  }
  return `${Math.floor(monthAge / 12)}y ${monthAge % 12}m`;
};

export { dateMask, validatedDate, formatDate, formatAge };
