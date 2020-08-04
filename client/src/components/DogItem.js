import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import moment from 'moment';
import default_dog from '../images/default_dog.png';

const DogItem = ({ dog }) => {

  const [expanded, setExpanded] = useState(false);

  const capitalizeWords = (s) => {
    const re = /(\b[a-z](?!\s))/g;
    const capitalized = s.replace(re, x => x.toUpperCase() );
    return capitalized;
  }

  const formatWeight = (weight) => {
    if (!weight) return 'N/A';
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

  const formatBreed = (breed) => {
    if (breed.length === 0) return 'N/A';
    return capitalizeWords(breed.join(', '));
  }

  const getCoordinatorName = (coordinator) => {
    if (coordinator === undefined) return 'N/A';
    if (coordinator.firstName && coordinator.lastName) {
      return `${coordinator.firstName} ${coordinator.lastName}`;
    }
    if (coordinator.firstName) return coordinator.firstName;
    if (coordinator.lastName) return coordinator.lastName;
  };

  const getFosterInfo = (currentFoster) => {
    if (currentFoster === undefined) return { name: 'N/A' };
    const firstName = currentFoster.firstName || '';
    const lastName = currentFoster.lastName || '';
    const fosterObj = {};
    fosterObj.fullName = `${firstName} ${lastName}`.trim();
    fosterObj.phone = currentFoster.phone || 'N/A';
    fosterObj.email = currentFoster.email || 'MISSING EMAIL';
    fosterObj.address = currentFoster.address || 'N/A';
    return fosterObj;
  };

  const formatVettingDates = (vettingDates) => {
    if (vettingDates === undefined) return {};
    return Object.fromEntries(
      Object.entries(vettingDates).map(([key, value]) => [
        key,
        formatDate(value),
      ])
    );
  };

  // Input is dog.medical object and property name
  const getPosNegStatus = (medical, keyName) => {
    if (medical === undefined || medical[keyName] === undefined) return 'N/A';
    if (medical[keyName] === true) {
      return 'positive';
    } else if (medical[keyName] === false) {
      return 'negative';
    }
    return 'Err';
  }


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
  const breed = formatBreed(dog.breed);
  const primaryVet = capitalizeWords(dog.medical ? dog.medical.primaryVet || 'N/A' : 'N/A');
  const fosterCoordinatorName = getCoordinatorName(dog.fosterCoordinator);
  const adoptionCoordinatorName = getCoordinatorName(dog.adoptionCoordinator);
  const vettingCoordinatorName = getCoordinatorName(dog.vettingCoordinator);
  const fosterInfo = getFosterInfo(dog.currentFoster);
  const vettingDates = formatVettingDates(dog.vettingDates);
  const tvtStatus = getPosNegStatus(dog.medical, 'tvt');
  const fourDXStatus = getPosNegStatus(dog.medical, 'fourDX');
  // const altStatuses = ...

  // pic breed vetname fc vc ac vetd foster altstatus

  const dogItemHeader = (
    <div key={dog._id + 'header'} className="dog-item-header" onClick={() => setExpanded(!expanded)}>
      <div className="dog-item-name dog-item-header-cell">
        <div className="dog-item-label">Name</div>
        {name}
      </div>
      <div className="dog-item-sex dog-item-header-cell">
        <div className="dog-item-label">Sex</div>
        {sex}
      </div>
      <div className="dog-item-weight dog-item-header-cell">
        <div className="dog-item-label">Weight</div>
        {weight}
      </div>
      <div className="dog-item-age dog-item-header-cell">
        <div className="dog-item-label">Age</div>
        {age}
      </div>
      <div className="dog-item-fixed dog-item-header-cell">
        <div className="dog-item-label">Fixed?</div>
        {fixed}
      </div>
      <div className="dog-item-intake dog-item-header-cell">
        <div className="dog-item-label">Intake</div>
        {intakeDate}
      </div>
      <div className="dog-item-status dog-item-header-cell">
        <div className="dog-item-label">Status</div>
        <span className={`status-pill ${statusClassName}`}>
          {primaryStatus}
        </span>
      </div>
      <div className="dog-item-vstatus dog-item-header-cell">
        <div className="dog-item-label">Vetting Status</div>
        <span className={`status-pill ${vetStatusClassName}`}>
          {primaryVettingStatus}
        </span>
      </div>
    </div>
  );

  const dogItemBody = (
    <div key={dog._id + 'body'} className="dog-item-body">
      <div className="dog-item-pic">
        <img
          src={default_dog}
          alt="Default dog pic"
        />
      </div>
      <div className="dog-item-breed dog-item-body-cell">
        <div className="dog-item-label">Breed</div>
        {breed}
      </div>
      <div className="dog-item-vetname dog-item-body-cell">
        <div className="dog-item-label">Primary Vet</div>
        {primaryVet}
      </div>
      <div className="dog-item-fc dog-item-body-cell">
        <div className="dog-item-label">Foster Coordinator</div>
        {fosterCoordinatorName}
      </div>
      <div className="dog-item-ac dog-item-body-cell">
        <div className="dog-item-label">Adoption Coordinator</div>
        {adoptionCoordinatorName}
      </div>
      <div className="dog-item-vc dog-item-body-cell">
        <div className="dog-item-label">Vetting Coordinator</div>
        {vettingCoordinatorName}
      </div>
      <div className="dog-item-foster dog-item-body-cell">
        <div className="dog-item-label">Foster</div>
        {fosterInfo.name === 'N/A' ? (<div>N/A</div>) : (
          <>
            <div>
              {fosterInfo.fullName}
            </div>
            <div>
              <i className="foster-icon fas fa-phone fa-sm"/>
              {fosterInfo.phone}
            </div>
            <div>
              <i className="foster-icon far fa-envelope fa-sm"/>
              {fosterInfo.email}</div>
            <div>
              <i className="foster-icon fas fa-home fa-sm"/>
              {fosterInfo.address}
            </div>
          </>
        )}
      </div>
      <div className="dog-item-vetd">
      <div><span className="dog-item-inline-label">Rabies</span>{vettingDates.rabies || 'N/A'}</div>
      <div><span className="dog-item-inline-label">DHPP1</span>{vettingDates.dhpp1 || 'N/A'}</div>
      <div><span className="dog-item-inline-label">DHPP2</span>{vettingDates.dhpp2 || 'N/A'}</div>
      <div><span className="dog-item-inline-label">DHLPP3</span>{vettingDates.dhlpp3 || 'N/A'}</div>
      <div><span className="dog-item-inline-label">Bordetella</span>{vettingDates.bordetella || 'N/A'}</div>
      <div><span className="dog-item-inline-label">Microchip</span>{vettingDates.microchip || 'N/A'}</div>
      <div><span className="dog-item-inline-label">Flea</span>{vettingDates.flea || 'N/A'}</div>
      <div><span className="dog-item-inline-label">Dewormer</span>{vettingDates.dewormer || 'N/A'}</div>
      <div><span className="dog-item-inline-label">Spay/Neuter</span>{vettingDates.fixed || 'N/A'}</div>
      <div><span className="dog-item-inline-label">TVT</span>{tvtStatus}</div>
      <div><span className="dog-item-inline-label">4Dx</span>{fourDXStatus}</div>
      </div>
    </div>
  );

  const dogItem = expanded ? [dogItemHeader, dogItemBody] : [dogItemHeader];

  return <div className="dog-item">{[dogItem]}</div>;
};

export default DogItem;
