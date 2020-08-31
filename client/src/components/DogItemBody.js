import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faEdit } from '@fortawesome/free-solid-svg-icons';
import DogItemBodyTail from './DogItemBodyTail';
import CoordinatorSelect from './dropdowns/CoordinatorSelect';
import { formatDate } from '../utils/dates';
import { capitalizeWords } from '../utils/text';
import default_dog from '../images/default_dog.png';
import { useSpring, animated } from 'react-spring';
import FosterSelect from './dropdowns/FosterSelect';


// Data processing functions
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
  if (currentFoster === undefined) {
    return {
      _id: null,
      fullName: 'N/A',
      phone: 'N/A',
      email: 'N/A',
      address: 'N/A',
    };
  }
  const firstName = currentFoster.firstName || '';
  const lastName = currentFoster.lastName || '';
  const fosterObj = {};
  fosterObj._id = currentFoster._id;
  fosterObj.fullName = `${firstName} ${lastName}`.trim();
  fosterObj.phone = currentFoster.phone || 'N/A';
  fosterObj.email = currentFoster.email || 'N/A';
  fosterObj.address = currentFoster.address || 'N/A';
  return fosterObj;
};

const formatVettingDates = (vettingDates) => {
  if (vettingDates === undefined) return {};
  return Object.fromEntries(Object.entries(vettingDates).map(([key, value]) => [key, formatDate(value)]));
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

// Component definition
const DogItemBody = ({ dog, bodyExpanded, inEditMode, setInEditMode, handleHeaderReset }) => {
  const [bodyTailInitialized, setBodyTailInitialized] = useState(false);
  const [bodyTailExpanded, setBodyTailExpanded] = useState(false);

  const handleClickEditIcon = () => {
    if (!inEditMode) {
      setInEditMode(true);
    }
    if (!bodyTailExpanded) {
      handleExpandBodyTail();
    }
  };

  const expand = useSpring({
    // config: { mass: 0.1, tension: 300, friction: 30 },
    from: {opacity: 0},
    opacity: bodyExpanded ? 1 : 0,
  });

  const doubleDownIconAnimation = useSpring({
    transform: bodyTailExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
  });

  const handleExpandBodyTail = () => {
    if (!bodyTailInitialized) {
      setBodyTailInitialized(true);
    }
    if (inEditMode) {
      setBodyTailExpanded(true);
    } else {
      setBodyTailExpanded(!bodyTailExpanded);
    }
  };

  const breed = formatBreed(dog.breed);
  const primaryVet = capitalizeWords(dog.medical ? dog.medical.primaryVet || 'N/A' : 'N/A');

  const fosterCoordinatorName_init = getCoordinatorName(dog.fosterCoordinator);
  const [fosterCoordinatorName, setFosterCoordinatorName] = useState(fosterCoordinatorName_init);

  const vettingCoordinatorName_init = getCoordinatorName(dog.vettingCoordinator);
  const [vettingCoordinatorName, setVettingCoordinatorName] = useState(vettingCoordinatorName_init);

  const adoptionCoordinatorName_init = getCoordinatorName(dog.adoptionCoordinator);
  const [adoptionCoordinatorName, setAdoptionCoordinatorName] = useState(adoptionCoordinatorName_init);

  const fosterInfo_init = getFosterInfo(dog.currentFoster);
  const [fosterInfo, setFosterInfo] = useState(fosterInfo_init);

  const initialDateWCurrentFoster_init = formatDate(dog.initialDateWithCurrentFoster);
  const [initialDateWCurrentFoster, setInitialDateWCurrentFoster] = useState(initialDateWCurrentFoster_init);

  const originLoc = dog.origin ? capitalizeWords(dog.origin) : 'N/A';
  const groupName = dog.group ? capitalizeWords(dog.group) : 'N/A';
  const mother = dog.parents.length > 0 ? dog.parents[0].name : 'N/A';
  const fee = 'N/A';
  const vettingDates = formatVettingDates(dog.vettingDates);
  const tvtStatus = getPosNegStatus(dog.medical, 'tvt');
  const fourDXStatus = getPosNegStatus(dog.medical, 'fourDX');

  const handleBodyReset = () => {
    setFosterCoordinatorName(fosterCoordinatorName_init);
    setVettingCoordinatorName(vettingCoordinatorName_init);
    setAdoptionCoordinatorName(adoptionCoordinatorName_init);
    setFosterInfo(fosterInfo_init);
  };

  return (
      <animated.div style={expand} className="dog-item-body-wrapper">
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
              <CoordinatorSelect
                inEditMode={inEditMode}
                role="Foster Coordinator"
                coordinatorState={fosterCoordinatorName}
                coordinatorState_init={fosterCoordinatorName_init}
                setCoordinatorState={setFosterCoordinatorName}
              />
            </div>
            <div className="dog-item__vc dog-item__body-cell">
              <div className="dog-item__label">Vetting Coordinator</div>
              <CoordinatorSelect
                inEditMode={inEditMode}
                role="Vetting Coordinator"
                coordinatorState={vettingCoordinatorName}
                coordinatorState_init={vettingCoordinatorName_init}
                setCoordinatorState={setVettingCoordinatorName}
              />
            </div>
            <div className="dog-item__ac dog-item__body-cell">
              <div className="dog-item__label">Adoption Coordinator</div>
              <CoordinatorSelect
                inEditMode={inEditMode}
                role="Adoptions Coordinator"
                coordinatorState={adoptionCoordinatorName}
                coordinatorState_init={adoptionCoordinatorName_init}
                setCoordinatorState={setAdoptionCoordinatorName}
              />
            </div>
            <FosterSelect
              fosterInfo={fosterInfo}
              setFosterInfo={setFosterInfo}
              fosterInfo_init={fosterInfo_init}
              initialDateWCurrentFoster={initialDateWCurrentFoster}
              setInitialDateWCurrentFoster={setInitialDateWCurrentFoster}
              initialDateWCurrentFoster_init={initialDateWCurrentFoster_init}
              inEditMode={inEditMode}
            />
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
          {bodyTailExpanded && (
            <DogItemBodyTail
              dog={dog}
              bodyExpanded={bodyExpanded}
              bodyTailExpanded={bodyTailExpanded}
              inEditMode={inEditMode}
              setInEditMode={setInEditMode}
              handleHeaderReset={handleHeaderReset}
              handleBodyReset={handleBodyReset}
            />
          )}
        </div>
        <div className="dog-item-body__side-panel">
          <div className="dog-item-body__side-panel__editIcon" onClick={handleClickEditIcon}>
            <FontAwesomeIcon icon={faEdit} />
          </div>
          <div className="dog-item-body__side-panel__angleDoubleDownIcon" onClick={handleExpandBodyTail}>
            <animated.div style={doubleDownIconAnimation}>
              <FontAwesomeIcon icon={faAngleDoubleDown} />
            </animated.div>
          </div>
        </div>
      </animated.div>
  );
};

export default DogItemBody;
