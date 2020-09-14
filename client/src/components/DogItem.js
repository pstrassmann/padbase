import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import Dropdown from './dropdowns/Dropdown';
import StatusPillDropdown from './dropdowns/StatusPillDropdown';
import { dateMask, validatedDate, formatDate, formatAge } from '../utils/dates';
import { capitalizeWords, numbersOnly } from '../utils/text';
import DogItemBody from './DogItemBody';
import ConditionalTextInput from './ConditionalTextInput';
import { connect } from 'react-redux';

// Data processing functions
const formatWeight = (weight) => {
  if (!weight) return null;
  return `${weight.toFixed(0)} lbs`;
};

const formatIsFixed = (isFixed) => {
  if (isFixed === undefined || isFixed === null) return null;
  return isFixed ? 'Yes' : 'No';
};

const getPrimaryStatus = (status) => {
  if (status === undefined || status === null) return null;
  if (status === 'fta') return 'FTA';
  return capitalizeWords(status);
};

const getVettingStatus = (vettingStatus) => {
  if (vettingStatus === undefined) return null;
  if (vettingStatus === 'pendingrecords') {
    return 'Pend. Recs.';
  }
  return capitalizeWords(vettingStatus);
};

const DogItem = React.forwardRef(({ dog }, ref) => {

  const DogItem = () => {
    const [inEditMode, setInEditMode] = useState(dog.newDog === true );
    const [bodyExpanded, setBodyExpanded] = useState(dog.newDog === true);
    const [dogState, setDogState] = useState(dog);
    const [dogItemAlerts, setDogItemAlerts] = useState([]);

    // Status modifiers
    const expandBody = () => {
      if (!inEditMode) {
        setBodyExpanded(!bodyExpanded);
      }
    };

    // Dog data

    const name_init = dogState.name || null;
    const [name, setName] = useState(name_init);

    const sex_init = dogState.sex || null;
    const [sex, setSex] = useState(sex_init);

    const weight_init = formatWeight(dogState.weight);
    const [weight, setWeight] = useState(weight_init);

    const age_init = formatAge(dogState.birthday);
    const [age, setAge] = useState(age_init);
    const birthday_init = formatDate(dogState.birthday);
    const [birthday, setBirthday] = useState(birthday_init);

    const isFixed_init = formatIsFixed(dogState.isFixed);
    const [isFixed, setIsFixed] = useState(isFixed_init);

    const intakeDate_init = formatDate(dogState.intakeDate);
    const [intakeDate, setIntakeDate] = useState(intakeDate_init);

    const primaryStatus_init = getPrimaryStatus(dogState.status);
    const [primaryStatus, setPrimaryStatus] = useState(primaryStatus_init);

    const vettingStatus_init = getVettingStatus(dogState.vettingStatus);
    const [vettingStatus, setVettingStatus] = useState(vettingStatus_init);

    const dogHeaderData = {
      name,
      sex,
      weight,
      isFixed,
      birthday,
      intakeDate,
      primaryStatus,
      vettingStatus,
    }

    const handleHeaderReset = () => {
      setName(name_init);
      setSex(sex_init);
      setWeight(weight_init);
      setAge(age_init);
      setBirthday(birthday_init);
      setIsFixed(isFixed_init);
      setIntakeDate(intakeDate_init);
      setPrimaryStatus(primaryStatus_init);
      setVettingStatus(vettingStatus_init);
    };

    const handleWeightBlur = () => {
      if (weight === null) return;
      const weightAsNumberOnly = numbersOnly(weight);
      if (!weightAsNumberOnly) {
        return setWeight(null);
      }
      setWeight(weightAsNumberOnly + ' lbs');
    };

    const handleValidateBirthday = () => {
      const ISODate = validatedDate(birthday);
      if (ISODate === null) {
        setBirthday(null);
        setAge(null);
      } else {
        setBirthday(formatDate(ISODate));
        setAge(formatAge(ISODate));
      }
    };

    const handleValidateDate = (date, dateSetter) => {
      if (inEditMode) {
        const ISODate = validatedDate(date);
        if (ISODate === null) {
          return dateSetter(null);
        } else {
          dateSetter(formatDate(ISODate));
        }
      }
    };

    const dogItemHeader = (
      <div className="dog-item-header">
        <div className="dog-item__name dog-item__header-cell">
          <ConditionalTextInput
            label="Name"
            labelClass="dog-item__label"
            placeholder="Name (required)"
            data={name}
            inEditMode={inEditMode}
            editClass="plc-hold-fnt-sz-8 dog-item__fieldRequiredError dog-item-header__displayText--editable"
            noEditClass="dog-item-header__displayText"
            handleOnChange={(e) => setName(e.target.value ? capitalizeWords(e.target.value) : null)}
            handleOnBlur={(e) => !e.target.value && setName(name_init)}
          />
        </div>
        <div className="dog-item__sex dog-item__header-cell">
          <label className="dog-item__label">Sex</label>
          <Dropdown options={['M', 'F', 'N/A']} state={sex || 'N/A'} stateSetter={setSex} inEditMode={inEditMode} />
        </div>
        <div className="dog-item__weight dog-item__header-cell">
          <ConditionalTextInput
            label="Weight"
            labelClass="dog-item__label"
            placeholder="lbs"
            data={weight !== null ? weight : 'N/A'}
            inEditMode={inEditMode}
            editClass="dog-item-header__displayText--editable"
            noEditClass="dog-item-header__displayText"
            handleOnChange={(e) => setWeight(e.target.value ? numbersOnly(e.target.value) : null)}
            handleOnBlur={handleWeightBlur}
          />
        </div>
        <div className="dog-item__isFixed dog-item__header-cell">
          <div className="dog-item__label">Fixed?</div>
          <Dropdown options={['Yes', 'No', 'N/A']} state={isFixed || 'N/A'} stateSetter={setIsFixed} inEditMode={inEditMode} />
        </div>
        <div className="dog-item__age dog-item__header-cell">
          <ConditionalTextInput
            label={ inEditMode ? 'Birthday' : 'Age' }
            labelClass="dog-item__label"
            placeholder="MM-DD-YY"
            data={ inEditMode ? (birthday === null ? '' : birthday) : (age === null ? 'N/A' : age) }
            inEditMode={ inEditMode }
            editClass="dog-item-header__displayText--editable"
            noEditClass="dog-item-header__displayText"
            handleOnChange={ (e) => setBirthday(e.target.value ? dateMask(e.target.value) : null) }
            handleOnBlur={ handleValidateBirthday }
          />
        </div>
        <div className="dog-item__intake dog-item__header-cell">
          <ConditionalTextInput
            label="Intake"
            labelClass="dog-item__label"
            placeholder="MM-DD-YY"
            data={ intakeDate }
            inEditMode={ inEditMode }
            editClass="dog-item__fieldRequiredError dog-item-header__displayText--editable"
            noEditClass="dog-item-header__displayText"
            handleOnChange={ (e) => setIntakeDate(e.target.value ? dateMask(e.target.value) : null) }
            handleOnBlur={ () => handleValidateDate(intakeDate, setIntakeDate) }
          />
        </div>
        <div className="dog-item__status dog-item__header-cell">
          <div className="dog-item__label">Status</div>
          <StatusPillDropdown
            options={['Fostered', 'FTA', 'Adopted', 'Hold', 'Intake', 'Deceased', 'N/A']}
            state={primaryStatus || 'N/A'}
            stateSetter={setPrimaryStatus}
            inEditMode={inEditMode}
          />
        </div>
        <div className="dog-item__vstatus dog-item__header-cell">
          <div className="dog-item__label">Vetting Status</div>
          <StatusPillDropdown
            options={['Complete', 'Incomplete', 'Pend. Recs.', 'N/A']}
            state={vettingStatus || 'N/A'}
            stateSetter={setVettingStatus}
            inEditMode={inEditMode}
          />
        </div>
      </div>
    );

    return (
      <div className={inEditMode ? 'dog-item dog-item--editMode' : 'dog-item'} ref={ref} key={dogState._id + 'item'}>
        <div className="dog-item-header-wrapper" onClick={expandBody}>
          {dogItemHeader}
          <div className={`dog-item__headerButton  ${(inEditMode && 'noVis')}`}>
            <div className={bodyExpanded ? 'dog-item__headerButton__icon--expanded' : 'dog-item__headerButton__icon'}>
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>
        </div>
        {bodyExpanded && (
          <DogItemBody
            dogState={dogState}
            setDogState={setDogState}
            dogHeaderData = {dogHeaderData}
            bodyExpanded={bodyExpanded}
            inEditMode={inEditMode}
            setInEditMode={setInEditMode}
            handleHeaderReset={handleHeaderReset}
            dogItemAlerts={dogItemAlerts}
            setDogItemAlerts={setDogItemAlerts}
          />
        )}
      </div>
    );
  };
  return <DogItem />;
});

// Although store is not being used, connecting to the store
// and setting forwardRef to true prevents expanded cards from collapsing
// whenever ref callback (to load more dogs) is executed. I believe this is
// because setting forwardRef to true causes the instance of the wrapped
// component to be returned rather than the instance of the higher order
// component, which is what is returned with just 'export default DogItem'.
// This prevents the re-rendering due to react thinking there is a mismatch
// between what is currently rendered and what is to-be-rendered.
export default connect(null, null, null, { forwardRef: true })(DogItem);
