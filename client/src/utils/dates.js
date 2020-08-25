import moment from 'moment';

const formatDate = (date) => {
  if (date === undefined) return 'N/A';
  return moment(date).format('MM-DD-YY');
};

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

export { formatDate, formatAge };