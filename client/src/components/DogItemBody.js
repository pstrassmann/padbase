import React from 'react';
import { formatDate } from '../utils/dates';
import default_dog from '../images/default_dog.png';

const DogItemBody = ({ dog }) => {
  const formatBreed = (breed) => {
    if (breed.length === 0) return 'N/A';
    return capitalizeWords(breed.join(', '));
  };

  const capitalizeWords = (s) => {
    const re = /(\b[a-z](?!\s))/g;
    const capitalized = s.replace(re, (x) => x.toUpperCase());
    return capitalized;
  };

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
  };

  const breed = formatBreed(dog.breed);
  const primaryVet = capitalizeWords(
    dog.medical ? dog.medical.primaryVet || 'N/A' : 'N/A'
  );
  const fosterCoordinatorName = getCoordinatorName(dog.fosterCoordinator);
  const adoptionCoordinatorName = getCoordinatorName(dog.adoptionCoordinator);
  const vettingCoordinatorName = getCoordinatorName(dog.vettingCoordinator);
  const fosterInfo = getFosterInfo(dog.currentFoster);
  const vettingDates = formatVettingDates(dog.vettingDates);
  const tvtStatus = getPosNegStatus(dog.medical, 'tvt');
  const fourDXStatus = getPosNegStatus(dog.medical, 'fourDX');

  return (
    <div className="dog-item-body">
      <div className="dog-item__pic">
        <img src={default_dog} alt="Default dog pic" />
      </div>
      <div className="dog-item__breed dog-item__body-cell">
        <div className="dog-item__label">Breed</div>
        {breed}
      </div>
      <div className="dog-item__vetname dog-item__body-cell">
        <div className="dog-item__label">Primary Vet</div>
        {primaryVet}
      </div>
      <div className="dog-item__fc dog-item__body-cell">
        <div className="dog-item__label">Foster Coordinator</div>
        {fosterCoordinatorName}
      </div>
      <div className="dog-item__ac dog-item__body-cell">
        <div className="dog-item__label">Adoption Coordinator</div>
        {adoptionCoordinatorName}
      </div>
      <div className="dog-item__vc dog-item__body-cell">
        <div className="dog-item__label">Vetting Coordinator</div>
        {vettingCoordinatorName}
      </div>
      <div className="dog-item__foster dog-item__body-cell">
        <div className="dog-item__label">Foster</div>
        {fosterInfo.name === 'N/A' ? (
          <div>N/A</div>
        ) : (
          <>
            <div>{fosterInfo.fullName}</div>
            <div>
              <i className="dog-item__foster-icon fas fa-phone fa-sm" />
              {fosterInfo.phone}
            </div>
            <div>
              <i className="dog-item__foster-icon far fa-envelope fa-sm" />
              {fosterInfo.email}
            </div>
            <div>
              <i className="dog-item__foster-icon fas fa-home fa-sm" />
              {fosterInfo.address}
            </div>
          </>
        )}
      </div>
      <div className="dog-item__vetd">
        <div>
          <span className="dog-item__inline-label">Rabies</span>
          {vettingDates.rabies || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">DHPP1</span>
          {vettingDates.dhpp1 || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">DHPP2</span>
          {vettingDates.dhpp2 || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">DHLPP3</span>
          {vettingDates.dhlpp3 || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">Bordetella</span>
          {vettingDates.bordetella || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">Microchip</span>
          {vettingDates.microchip || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">Flea</span>
          {vettingDates.flea || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">Dewormer</span>
          {vettingDates.dewormer || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">Spay/Neuter</span>
          {vettingDates.fixed || 'N/A'}
        </div>
        <div>
          <span className="dog-item__inline-label">TVT</span>
          {tvtStatus}
        </div>
        <div>
          <span className="dog-item__inline-label">4Dx</span>
          {fourDXStatus}
        </div>
      </div>
    </div>
  );
};

export default DogItemBody;
