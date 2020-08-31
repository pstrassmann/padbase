import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import Dropdown from './dropdowns/Dropdown';
import StatusPillDropdown from './dropdowns/StatusPillDropdown';
import { dateMask, validatedDate, formatDate, formatAge } from '../utils/dates';
import { capitalizeWords, numbersOnly } from '../utils/text';
import DogItemBody from './DogItemBody';
import { connect } from 'react-redux';

// Data processing functions
const formatWeight = (weight) => {
  if (!weight) return 'N/A';
  return `${weight.toFixed(0)} lbs`;
};

const formatIsFixed = (isFixed) => {
  if (isFixed === undefined) return 'N/A';
  return isFixed ? 'Yes' : 'No';
};

const getPrimaryStatus = (status) => {
  if (status === undefined) return 'N/A';
  if (status === 'fta') return 'FTA';
  return capitalizeWords(status);
};

const getVettingStatus = (vettingStatus) => {
  if (vettingStatus === undefined) return 'N/A';
  if (vettingStatus === 'pendingrecords') {
    return 'Pend. Recs.';
  }
  return capitalizeWords(vettingStatus);
};

const DogItem = React.forwardRef((props, ref) => {
  const dog = props.dog;

  const DogItem = () => {
    const [inEditMode, setInEditMode] = useState(false);
    const [bodyExpanded, setBodyExpanded] = useState(false);
    const [bodyInitialized, setBodyInitialized] = useState(false);

    // Status modifiers
    const expandBody = () => {
      if (!bodyInitialized) {
        setBodyInitialized(true);
      }
      if (!inEditMode) {
        setBodyExpanded(!bodyExpanded);
      }
    };

    // Dog data

    const name_init = dog.name;
    const [name, setName] = useState(name_init);

    const sex_init = dog.sex || 'N/A';
    const [sex, setSex] = useState(sex_init);

    const weight_init = formatWeight(dog.weight);
    const [weight, setWeight] = useState(weight_init);

    const age_init = formatAge(dog.birthday);
    const [age, setAge] = useState(age_init);
    const birthday_init = formatDate(dog.birthday);
    const [birthday, setBirthday] = useState(birthday_init);

    const fixed_init = formatIsFixed(dog.isFixed);
    const [fixed, setFixed] = useState(fixed_init);

    const intakeDate_init = formatDate(dog.intakeDate);
    const [intakeDate, setIntakeDate] = useState(intakeDate_init);

    const primaryStatus_init = getPrimaryStatus(dog.status);
    const [primaryStatus, setPrimaryStatus] = useState(primaryStatus_init);

    const vettingStatus_init = getVettingStatus(dog.vettingStatus);
    const [vettingStatus, setVettingStatus] = useState(vettingStatus_init);

    const [dogHeaderState, setDogHeaderState] = useState({
      _id: dog._id,
      name: dog.name,
      sex: dog.sex,
      weight: dog.weight,
      birthday: dog.birthday,
      isFixed: dog.isFixed,
      intakeDate: dog.intakeDate,
      status: dog.status, // note this is an array
      vettingStatus: dog.vettingStatus, // note this is an array
    });

    const handleHeaderReset = () => {
      setName(name_init);
      setSex(sex_init);
      setWeight(weight_init);
      setAge(age_init);
      setBirthday(birthday_init);
      setFixed(fixed_init);
      setIntakeDate(intakeDate_init);
      setPrimaryStatus(primaryStatus_init);
      setVettingStatus(vettingStatus_init);
    };

    const handleNameChange = (e) => {
      const input_raw = e.target.value;
      const input_forcedCapitalized = capitalizeWords(input_raw);
      setName(input_forcedCapitalized);
    };

    const handleWeightChange = (e) => {
      const weight_raw = e.target.value;
      const weight_num = numbersOnly(weight_raw);
      setWeight(weight_num);
    };

    const handleWeightBlur = () => {
      const weightAsNumberOnly = numbersOnly(weight);
      if (!weightAsNumberOnly) {
        return setWeight('N/A');
      }
      setWeight(weightAsNumberOnly + ' lbs');
    };

    const handleValidateBirthday = () => {
      const ISODate = validatedDate(birthday);
      if (ISODate === null) {
        setBirthday('');
        setAge('N/A');
      } else {
        setBirthday(formatDate(ISODate));
        setAge(formatAge(ISODate));
      }
    }

    const handleValidateDate = (date, dateSetter) => {
      if (inEditMode) {
        const ISODate = validatedDate(date);
        if (ISODate === null) {
          return dateSetter('N/A');
        } else {
          dateSetter(formatDate(ISODate));
        }
      }
    };

    const dogItemHeader = (
      <div className="dog-item-header">
        <div className="dog-item__name dog-item__header-cell">
          <label className="dog-item__label">Name</label>
          <input
            type="text"
            value={name}
            className={inEditMode ? 'dog-item-header__displayText--editable' : 'dog-item-header__displayText'}
            readOnly={!inEditMode}
            onChange={handleNameChange}
          />
        </div>
        <div className="dog-item__sex dog-item__header-cell">
          <div className="dog-item__label">Sex</div>
          <Dropdown options={['M', 'F', 'N/A']} state={sex} stateSetter={setSex} inEditMode={inEditMode} />
        </div>
        <div className="dog-item__weight dog-item__header-cell">
          <div className="dog-item__label">Weight</div>
          <input
            type="text"
            value={weight}
            className={inEditMode ? 'dog-item-header__displayText--editable' : 'dog-item-header__displayText'}
            readOnly={!inEditMode}
            onChange={handleWeightChange}
            onBlur={handleWeightBlur}
          />
        </div>
        <div className="dog-item__fixed dog-item__header-cell">
          <div className="dog-item__label">Fixed?</div>
          <Dropdown options={['Yes', 'No', 'N/A']} state={fixed} stateSetter={setFixed} inEditMode={inEditMode} />
        </div>
        <div className="dog-item__age dog-item__header-cell">
          <div className="dog-item__label">{inEditMode ? 'Birthday' : 'Age'}</div>
          {!inEditMode ? (
            age
          ) : (
            <input
              type="text"
              value={birthday === 'N/A' ? '' : birthday}
              className="dog-item-header__displayText--editable"
              placeholder="MM-DD-YY"
              onChange={(e) => setBirthday(dateMask(e.target.value))}
              onBlur={handleValidateBirthday}
            />
          )}
        </div>
        <div className="dog-item__intake dog-item__header-cell">
          <div className="dog-item__label">Intake</div>
          <input
            type="text"
            value={intakeDate}
            className={inEditMode ? 'dog-item-header__displayText--editable' : 'dog-item-header__displayText'}
            readOnly={!inEditMode}
            placeholder="MM-DD-YY"
            onChange={(e) => setIntakeDate(dateMask(e.target.value))}
            onBlur={() => handleValidateDate(intakeDate, setIntakeDate)}
          />
        </div>
        <div className="dog-item__status dog-item__header-cell">
          <div className="dog-item__label">Status</div>
          <StatusPillDropdown
            options={['Fostered', 'FTA', 'Adopted', 'Hold', 'Intake', 'Deceased', 'N/A']}
            state={primaryStatus}
            stateSetter={setPrimaryStatus}
            inEditMode={inEditMode}
          />
        </div>
        <div className="dog-item__vstatus dog-item__header-cell">
          <div className="dog-item__label">Vetting Status</div>
          <StatusPillDropdown
            options={['Complete', 'Incomplete', 'Pend. Recs.', 'N/A']}
            state={vettingStatus}
            stateSetter={setVettingStatus}
            inEditMode={inEditMode}
          />
        </div>
      </div>
    );

    return (
      <div className={inEditMode ? 'dog-item dog-item--editMode' : 'dog-item'} ref={ref} key={dog._id + 'item'}>
        <div className="dog-item-header-wrapper" onClick={expandBody}>
          {dogItemHeader}
          <div className="dog-item__headerButton">
            <div className={ bodyExpanded ? "dog-item__headerButton__icon--expanded" : "dog-item__headerButton__icon"}>
              <FontAwesomeIcon icon={ faAngleDown }/>
            </div>
          </div>
        </div>
        {bodyExpanded && (
          <DogItemBody
            dog={dog}
            bodyExpanded={bodyExpanded}
            inEditMode={inEditMode}
            setInEditMode={setInEditMode}
            handleHeaderReset={handleHeaderReset}
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
