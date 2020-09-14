import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faEdit } from '@fortawesome/free-solid-svg-icons';
import DogItemBodyTail from './DogItemBodyTail';
import CoordinatorSelect from './dropdowns/CoordinatorSelect';
import { dateMask, formatDate, validatedDate } from '../utils/dates';
import { capitalizeWords, numbersOnly } from '../utils/text';
import default_dog from '../images/default_dog.png';
import { useSpring, animated } from 'react-spring';
import FosterSelect from './dropdowns/FosterSelect';
import ConditionalTextInput from './ConditionalTextInput';
import Dropdown from './dropdowns/Dropdown';
import DogMomSelect from './dropdowns/DogMomSelect';

// Data processing functions
const formatBreed = (breed) => {
  if (!breed || breed.length === 0) return null;
  return capitalizeWords(breed.join(', '));
};

const getCoordinator = (coordinator) => {
  if (coordinator === undefined) return { fullName: null, _id: null };
  const fullName = `${coordinator.firstName ? coordinator.firstName : ''} ${
    coordinator.lastName ? coordinator.lastName : ''
  }`.trim();
  return {
    fullName: fullName,
    _id: coordinator._id,
  };
};

const getFosterInfo = (currentFoster) => {
  if (currentFoster === undefined) {
    return {
      _id: null,
      fullName: null,
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      address: null,
      newFoster: null,
    };
  }
  const firstName = currentFoster.firstName || '';
  const lastName = currentFoster.lastName || '';
  const fosterObj = {};
  fosterObj._id = currentFoster._id;
  fosterObj.fullName = `${firstName} ${lastName}`.trim();
  fosterObj.firstName = firstName.trim();
  fosterObj.lastName = lastName.trim();
  fosterObj.phone = currentFoster.phone || null;
  fosterObj.email = currentFoster.email || null;
  fosterObj.address = currentFoster.address || null;
  return fosterObj;
};

const formatVettingDates = (vettingDates) => {
  if (vettingDates === undefined) return {};
  return Object.fromEntries(Object.entries(vettingDates).map(([key, value]) => [key, formatDate(value)]));
};

// Input is dogState.medical object and property name
const getPosNegStatus = (medical, keyName) => {
  if (medical === undefined || medical[keyName] === undefined) return null;
  if (medical[keyName] === true) {
    return 'positive';
  } else if (medical[keyName] === false) {
    return 'negative';
  }
  return null;
};

// Component definition
const DogItemBody = ({
  dogState,
  setDogState,
  dogHeaderData,
  bodyExpanded,
  inEditMode,
  setInEditMode,
  handleHeaderReset,
  dogItemAlerts,
  setDogItemAlerts,
}) => {
  const [bodyTailExpanded, setBodyTailExpanded] = useState(inEditMode);

  const handleClickEditIcon = () => {
    if (!inEditMode) {
      setInEditMode(true);
    }
    if (!bodyTailExpanded) {
      handleExpandBodyTail();
    }
  };

  const expand = useSpring({
    from: { opacity: 0 },
    opacity: bodyExpanded ? 1 : 0,
  });

  const doubleDownIconAnimation = useSpring({
    transform: bodyTailExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
  });

  const handleExpandBodyTail = () => {
    if (inEditMode) {
      setBodyTailExpanded(true);
    } else {
      setBodyTailExpanded(!bodyTailExpanded);
    }
  };

  const validateVettingDate = (date) => {
    const ISODate = validatedDate(date);
    if (ISODate === null) {
      return null;
    } else {
      return formatDate(ISODate);
    }
  };

  const breed_init = formatBreed(dogState.breed);
  const [breed, setBreed] = useState(breed_init);

  const primaryVet_init = dogState.medical && dogState.medical.primaryVet ? capitalizeWords(dogState.medical.primaryVet) : null;
  const [primaryVet, setPrimaryVet] = useState(primaryVet_init);

  const fosterCoordinator_init = getCoordinator(dogState.fosterCoordinator);
  const [fosterCoordinator, setFosterCoordinator] = useState(fosterCoordinator_init);

  const vettingCoordinator_init = getCoordinator(dogState.vettingCoordinator);
  const [vettingCoordinator, setVettingCoordinator] = useState(vettingCoordinator_init);

  const adoptionCoordinator_init = getCoordinator(dogState.adoptionCoordinator);
  const [adoptionCoordinator, setAdoptionCoordinator] = useState(adoptionCoordinator_init);

  const fosterInfo_init = getFosterInfo(dogState.currentFoster);
  const [fosterInfo, setFosterInfo] = useState(fosterInfo_init);

  const initialDateWCurrentFoster_init = formatDate(dogState.initialDateWCurrentFoster);
  const [initialDateWCurrentFoster, setInitialDateWCurrentFoster] = useState(initialDateWCurrentFoster_init);

  const origin_init = dogState.origin ? capitalizeWords(dogState.origin) : null;
  const [origin, setOrigin] = useState(origin_init);

  const groupName_init = dogState.group ? capitalizeWords(dogState.group) : null;
  const [groupName, setGroupName] = useState(groupName_init);

  const mother_init =
    dogState.parents && dogState.parents.length > 0
      ? {
          _id: dogState.parents[0]._id || null,
          name: dogState.parents[0].name || null,
        }
      : {
          _id: null,
          name: null,
        };
  const [mother, setMother] = useState(mother_init);

  const fee_init = dogState.fee || null;
  const [fee, setFee] = useState(fee_init);

  const vettingDates_init = formatVettingDates(dogState.vettingDates);
  const [vettingDates, setVettingDates] = useState(vettingDates_init);

  const tvtStatus_init = getPosNegStatus(dogState.medical, 'tvt');
  const [tvtStatus, setTvtStatus] = useState(tvtStatus_init);

  const fourDXStatus_init = getPosNegStatus(dogState.medical, 'fourDX');
  const [fourDXStatus, setFourDXStatus] = useState(fourDXStatus_init);

  const dogBodyData = {
    fosterCoordinator,
    vettingCoordinator,
    adoptionCoordinator,
    fosterInfo,
    initialDateWCurrentFoster,
    breed,
    mother,
    primaryVet,
    origin,
    groupName,
    fee,
    vettingDates,
    tvtStatus,
    fourDXStatus,
  }

  const handleBodyReset = () => {
    setFosterCoordinator(fosterCoordinator_init);
    setVettingCoordinator(vettingCoordinator_init);
    setAdoptionCoordinator(adoptionCoordinator_init);
    setFosterInfo(fosterInfo_init);
    setBreed(breed_init);
    setMother(mother_init);
    setPrimaryVet(primaryVet_init);
    setOrigin(origin_init);
    setGroupName(groupName_init);
    setFee(fee_init);
    setVettingDates(vettingDates_init);
    setTvtStatus(tvtStatus_init);
    setFourDXStatus(fourDXStatus_init);
  };

  return (
    <animated.div style={expand} className="dog-item-body-wrapper">
      <div className="dog-item-body-all">
        <div className="dog-item-body">
          <div className="dog-item__pic">
            <img src={default_dog} alt="Default dog pic" />
          </div>
          <div className="dog-item__fc dog-item__body-cell">
            <CoordinatorSelect
              inEditMode={inEditMode}
              role="Foster Coordinator"
              coordinatorState={fosterCoordinator}
              coordinatorState_init={fosterCoordinator_init}
              setCoordinatorState={setFosterCoordinator}
            />
          </div>
          <div className="dog-item__vc dog-item__body-cell">
            <CoordinatorSelect
              inEditMode={inEditMode}
              role="Vetting Coordinator"
              coordinatorState={vettingCoordinator}
              coordinatorState_init={vettingCoordinator_init}
              setCoordinatorState={setVettingCoordinator}
            />
          </div>
          <div className="dog-item__ac dog-item__body-cell">
            <CoordinatorSelect
              inEditMode={inEditMode}
              role="Adoptions Coordinator"
              coordinatorState={adoptionCoordinator}
              coordinatorState_init={adoptionCoordinator_init}
              setCoordinatorState={setAdoptionCoordinator}
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
          <div className="dog-item__breed dog-item__body-cell">
            <ConditionalTextInput
              label="Breed"
              labelClass="dog-item__label"
              placeholder="Breed..."
              data={breed !== null ? breed : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setBreed(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </div>
          <div className="dog-item__mother dog-item__body-cell">
            <DogMomSelect state_init={mother_init} state={mother} setState={setMother} inEditMode={inEditMode} />
          </div>
          <div className="dog-item__vetName dog-item__body-cell">
            <ConditionalTextInput
              label="Primary Vet"
              labelClass="dog-item__label"
              placeholder="Primary vet..."
              data={primaryVet !== null ? primaryVet : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setPrimaryVet(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </div>
          <div className="dog-item__origin dog-item__body-cell">
            <ConditionalTextInput
              label="Origin"
              labelClass="dog-item__label"
              placeholder="Origin..."
              data={origin !== null ? origin : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setOrigin(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </div>
          <div className="dog-item__groupName dog-item__body-cell">
            <ConditionalTextInput
              label="Group Name"
              labelClass="dog-item__label"
              placeholder="Group name..."
              data={groupName !== null ? groupName : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setGroupName(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </div>
          <div className="dog-item__fee dog-item__body-cell">
            <ConditionalTextInput
              label="Fee"
              labelClass="dog-item__label"
              placeholder="Fee..."
              data={fee !== null ? fee : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setFee(e.target.value ? numbersOnly(e.target.value) : null)}
            />
          </div>
          <div className="dog-item__vetd">
            <div>
              <ConditionalTextInput
                label="Rabies"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.rabies || '' : vettingDates.rabies || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, rabies: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, rabies: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="DHPP1"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.dhpp1 || '' : vettingDates.dhpp1 || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, dhpp1: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, dhpp1: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="DHPP2"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.dhpp2 || '' : vettingDates.dhpp2 || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, dhpp2: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, dhpp2: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="DHLPP3"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.dhlpp3 || '' : vettingDates.dhlpp3 || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, dhlpp3: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, dhlpp3: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="Bordetella"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.bordetella || '' : vettingDates.bordetella || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, bordetella: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, bordetella: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="Microchip"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.microchip || '' : vettingDates.microchip || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, microchip: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, microchip: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="Flea"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.flea || '' : vettingDates.flea || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, flea: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, flea: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="Dewormer"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.dewormer || '' : vettingDates.dewormer || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, dewormer: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, dewormer: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div>
              <ConditionalTextInput
                label="Fixed"
                labelClass="dog-item__inline-label"
                placeholder="MM-DD-YY"
                data={inEditMode ? vettingDates.fixed || '' : vettingDates.fixed || 'N/A'}
                inEditMode={inEditMode}
                editClass="dog-item-body__displayText--editable--vettingDate"
                noEditClass="dog-item-body__displayText"
                handleOnChange={(e) =>
                  setVettingDates({ ...vettingDates, fixed: e.target.value ? dateMask(e.target.value) : null })
                }
                handleOnBlur={(e) => {
                  setVettingDates({ ...vettingDates, fixed: validateVettingDate(e.target.value) });
                }}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <span className="dog-item__inline-label">TVT</span>
              <Dropdown
                options={['positive', 'negative', 'N/A']}
                state={tvtStatus || 'N/A'}
                stateSetter={setTvtStatus}
                inEditMode={inEditMode}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <span className="dog-item__inline-label">4Dx</span>
              <Dropdown
                options={['positive', 'negative', 'N/A']}
                state={fourDXStatus || 'N/A'}
                stateSetter={setFourDXStatus}
                inEditMode={inEditMode}
              />
            </div>
          </div>
        </div>
        {bodyTailExpanded && (
          <DogItemBodyTail
            dogState={dogState}
            setDogState={setDogState}
            dogHeaderData={dogHeaderData}
            dogBodyData={dogBodyData}
            bodyExpanded={bodyExpanded}
            bodyTailExpanded={bodyTailExpanded}
            inEditMode={inEditMode}
            setInEditMode={setInEditMode}
            handleHeaderReset={handleHeaderReset}
            handleBodyReset={handleBodyReset}
            dogItemAlerts={dogItemAlerts}
            setDogItemAlerts={setDogItemAlerts}
          />
        )}
      </div>
      <div className="dog-item-body__side-panel">
        <div className={`dog-item-body__side-panel__editIcon ${inEditMode && 'noVis'}`} onClick={handleClickEditIcon}>
          <FontAwesomeIcon icon={faEdit} fixedWidth />
        </div>
        <div
          className={`dog-item-body__side-panel__angleDoubleDownIcon ${inEditMode && 'noVis'}`}
          onClick={handleExpandBodyTail}
        >
          <animated.div style={doubleDownIconAnimation}>
            <FontAwesomeIcon icon={faAngleDoubleDown} />
          </animated.div>
        </div>
      </div>
    </animated.div>
  );
};

export default DogItemBody;
