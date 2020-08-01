import React from 'react';
import moment from 'moment';

const DogItem = ({ dog }) => {
  const formatWeight = (weight) => {
    if (!weight) return 'N/A';
    // if (weight % 1 !== 0) {
    //   return `${weight} lbs`;
    // }
    return `${weight.toFixed(0)} lbs`;
  };

  const formatAge = (birthday) => {
    if (!birthday) return 'N/A';
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

  const formatIsFixed = (isFixed) => {
    if (isFixed === undefined) return 'N/A';
    return isFixed ? 'Yes' : 'No';
  };

  const formatDate = (date) => {
    if (date === undefined) return 'N/A';
    return moment(dog.intakeDate).format('MM-DD-YY');
  };

  const getPrimaryStatus = (statusArray) => {
    if (statusArray.length === 0) return ['N/A', 'missing-status'];
    if (statusArray.includes('deceased')) return ['Deceased', 'deceased'];
    if (statusArray.includes('adopted')) return ['Adopted', 'adopted'];
    if (statusArray.includes('fta')) return ['FTA', 'fta'];
    if (statusArray.includes('intake')) return ['Intake', 'intake'];
    if (statusArray.includes('on hold - all')) return ['On Hold', 'onhold'];
    if (statusArray.includes('fostered')) return ['Fostered', 'fostered'];
    if (statusArray.includes('temp foster')) return ['Fostered', 'fostered'];
    if (statusArray.includes('temp')) return ['Fostered', 'fostered'];
    return ['N/A', 'missing-status'];
  };

  const getVettingStatus = (statusArray) => {
    if (statusArray.length === 0) return ['N/A', 'missing-status'];
    if (statusArray.includes('deceased')) return ['Deceased', 'deceased'];
    if (statusArray.includes('incomplete'))
      return ['Incomplete', 'vetting-incomplete'];
    if (statusArray.includes('complete'))
      return ['Complete', 'vetting-complete'];
    if (statusArray.includes('pending records'))
      return ['Pend. Recs.', 'pending-records'];
    return ['N/A', 'missing-status'];
  };

  const name = dog.name;
  const sex = dog.sex || 'N/A';
  const weight = formatWeight(dog.weight);
  const age = formatAge(dog.birthday);
  const fixed = formatIsFixed(dog.isFixed);
  const intakeDate = formatDate(dog.intakeDate);
  const [primaryStatus, statusClassName] = getPrimaryStatus(dog.status);
  const [primaryVettingStatus, vetStatusClassName] = getVettingStatus(
    dog.vettingStatus
  );

  return (
    <div className="dog-item">
      <div className="dog-item-name rel">
        <div className="dog-item-label">Name</div>
        {name}
      </div>
      <div className="dog-item-sex rel">
        <div className="dog-item-label">Sex</div>
        {sex}
      </div>
      <div className="dog-item-weight rel">
        <div className="dog-item-label">Weight</div>
        {weight}
      </div>
      <div className="dog-item-age rel">
        <div className="dog-item-label">Age</div>
        {age}
      </div>
      <div className="dog-item-fixed rel">
        <div className="dog-item-label">Fixed?</div>
        {fixed}
      </div>
      <div className="dog-item-intake rel">
        <div className="dog-item-label">Intake</div>
        {intakeDate}
      </div>
      <div className="dog-item-status rel">
        <div className="dog-item-label">Status</div>
        <span className={`status-pill ${statusClassName}`}>{primaryStatus}</span>
      </div>
      <div className="dog-item-vstatus rel">
        <div className="dog-item-label">Vetting Status</div>
        <span className={`status-pill ${vetStatusClassName}`}>{primaryVettingStatus}</span>
      </div>
    </div>
  );
};

export default DogItem;
