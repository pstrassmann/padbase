import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faHome,
  faAngleDoubleDown,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import DogItemBodyTail from './DogItemBodyTail';
import { formatDate } from '../utils/dates';
import { capitalizeWords } from '../utils/text';
import default_dog from '../images/default_dog.png';
import { useSpring, animated } from 'react-spring';
import { useMeasure } from 'react-use';

const DogItemBody = ({ dog, bodyExpanded }) => {
  const [bodyTailInitialized, setBodyTailInitialized] = useState(false);
  const [bodyTailExpanded, setBodyTailExpanded] = useState(false);

  const [ref, { height }] = useMeasure();

  const expand = useSpring({
    overflow: 'hidden',
    height: bodyExpanded ? `${height}px` : '0px',
  });

  const doubleDownIconAnimation = useSpring({
    // opacity: bodyExpanded ? 1 : 0,
    transform: bodyTailExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
  });

  const handleExpandBodyTail = () => {
    if (!bodyTailInitialized) {
      setBodyTailInitialized(true);
    }
    setBodyTailExpanded(!bodyTailExpanded);
  };

  const formatBreed = (breed) => {
    if (breed.length === 0) return 'N/A';
    return capitalizeWords(breed.join(', '));
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
  const initialDateWCurrentFoster = formatDate(
    dog.initialDateWithCurrentFoster
  );
  const originLoc = dog.origin ? capitalizeWords(dog.origin) : 'N/A';
  const groupName = dog.group ? capitalizeWords(dog.group) : 'N/A';
  const mother = dog.parents.length > 0 ? dog.parents[0].name : 'N/A';
  const fee = 'N/A';
  const vettingDates = formatVettingDates(dog.vettingDates);
  const tvtStatus = getPosNegStatus(dog.medical, 'tvt');
  const fourDXStatus = getPosNegStatus(dog.medical, 'fourDX');

  return (
    <animated.div style={expand}>
    <div ref={ref}  className="dog-item-body-wrapper">
      <div className="dog-item-body-all">
        <div className="dog-item-body">
            <div className="dog-item__pic">
              <img src={default_dog} alt="Default dog pic" />
            </div>
            <div className="dog-item__breed dog-item__body-cell">
              <div className="dog-item__label">Breed</div>
              {breed}
            </div>
            <div className="dog-item__origin dog-item__body-cell">
              <div className="dog-item__label">Origin</div>
              {originLoc}
            </div>
            <div className="dog-item__mother dog-item__body-cell">
              <div className="dog-item__label">Mama Name</div>
              {mother}
            </div>
            <div className="dog-item__groupName dog-item__body-cell">
              <div className="dog-item__label">Group Name</div>
              {groupName}
            </div>
            <div className="dog-item__fee dog-item__body-cell">
              <div className="dog-item__label">Fee</div>
              {fee}
            </div>
            <div className="dog-item__vetName dog-item__body-cell">
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
            {fosterInfo.name === 'N/A' ? (
              <div className="dog-item__fosterName dog-item__body-cell">
                <div className="dog-item__label">Foster</div>
                N/A
              </div>
            ) : (
              <>
                <div className="dog-item__fosterName dog-item__body-cell">
                  <div className="dog-item__label">Foster</div>
                  {fosterInfo.fullName}
                </div>
                <div className="dog-item__fosterDate dog-item__body-cell">
                  <div className="dog-item__label">Initial Date w/ Foster</div>
                  {initialDateWCurrentFoster}
                </div>
                <div className="dog-item__fosterInfo">
                  <div>
                    <FontAwesomeIcon
                      icon={faPhone}
                      size="sm"
                      className="dog-item__foster-icon"
                    />
                    {fosterInfo.phone}
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      size="sm"
                      className="dog-item__foster-icon"
                    />
                    {fosterInfo.email}
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faHome}
                      size="sm"
                      className="dog-item__foster-icon"
                    />
                    {fosterInfo.address}
                  </div>
                </div>
              </>
            )}
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
        {bodyTailInitialized && (<DogItemBodyTail dog={dog} bodyExpanded={bodyExpanded} bodyTailExpanded={bodyTailExpanded}/>)}
      </div>
      <div className="dog-item-body__side-panel">
        <div className="dog-item__edit">
          <FontAwesomeIcon
            icon={faEdit}
            className="dog-item__edit__icon"
          />
        </div>
        <div className="dog-item__angleDoubleDown" onClick={handleExpandBodyTail}>
          <animated.div style={doubleDownIconAnimation}>
            <FontAwesomeIcon
              icon={faAngleDoubleDown}
              className="dog-item__angleDoubleDown__icon"
            />
          </animated.div>
        </div>
      </div>
    </div>
    </animated.div>
  );
};

export default DogItemBody;
