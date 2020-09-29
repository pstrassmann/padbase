import React, { useState } from 'react';
import { connect } from 'react-redux';
import { dateMask, formatDate, validatedDate } from '../../utils/dates';
import { capitalizeWords, numbersOnly } from '../../utils/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faPlusCircle, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { saveDogGroup } from '../../api/dogAPI';
import { addDogsToAppState, setIsAddingNewDogGroup } from '../../actions/dogActions';
import useAlerts from '../../utils/useAlerts';
import { animated, useTransition } from 'react-spring';

const AddNewDogGroup = ( {addDogsToAppState, setIsAddingNewDogGroup} ) => {
  const numDogs_init = 5;
  const maxNumDogs = 50;
  const emptyDogInfoTemplate = { name: null, sex: null };

  const [numDogs, setNumDogs] = useState(numDogs_init);
  const [groupName, setGroupName] = useState(null);
  const [groupIntakeDate, setGroupIntakeDate] = useState(null);
  const [groupOrigin, setGroupOrigin] = useState(null);
  const [dogInfoArray, setDogInfoArray] = useState(new Array(5).fill(emptyDogInfoTemplate));
  const [addAlerts, animatedAlerts] = useAlerts();

  const handleValidateDate = (date, dateSetter) => {
    const ISODate = validatedDate(date);
    if (ISODate === null) {
      return dateSetter(null);
    } else {
      dateSetter(formatDate(ISODate));
    }
  };

  const handleOnDogNameChange = (e, changedDogIndex) => {
    setDogInfoArray(
      dogInfoArray.map((dog, index) => {
        if (index === changedDogIndex) {
          return { ...dog, name: e.target.value ? capitalizeWords(e.target.value) : null };
        } else return dog;
      })
    );
  };

  const handleOnDogNameBlur = (e, changedDogIndex) => {
    setDogInfoArray(
      dogInfoArray.map((dog, index) => {
        if (index === changedDogIndex) {
          return { ...dog, name: e.target.value ? e.target.value.trim() : null };
        } else return dog;
      })
    );
  };

  const maleOrFemaleMask = (e) => {
    const value = e.target.value.trim().toUpperCase().slice(0, 1);
    if (!value) return null;
    const re = /[^MF]/g;
    return value.replace(re, '');
  };

  const handleOnSexChange = (e, changedDogIndex) => {
    setDogInfoArray(
      dogInfoArray.map((dog, index) => {
        if (index === changedDogIndex) {
          return { ...dog, sex: maleOrFemaleMask(e) };
        } else return dog;
      })
    );
  };

  const handleNumDogsChange = (e) => {
    const value = e.target.value;
    if (!value) return setNumDogs(null);
    const valueAsNumber = parseInt(numbersOnly(value));
    if (!valueAsNumber) return setNumDogs(null);
    let setValue;
    if (valueAsNumber < 1) {
      setValue = 1;
    } else if (valueAsNumber > maxNumDogs) {
      setValue = maxNumDogs;
    } else {
      setValue = valueAsNumber;
    }
    setNumDogs(setValue);
  };

  const handleNumDogsBlur = (e) => {
    if (!numDogs) {
      setNumDogs(1);
      return setDogInfoArray([emptyDogInfoTemplate]);
    }
    if (numDogs < dogInfoArray.length) {
      setDogInfoArray(dogInfoArray.slice(0, numDogs));
    } else if (numDogs > dogInfoArray.length) {
      setDogInfoArray([...dogInfoArray, ...Array(numDogs - dogInfoArray.length).fill(emptyDogInfoTemplate)]);
    }
  };

  const handlePlusClick = () => {
    setNumDogs(numDogs + 1);
    setDogInfoArray([...dogInfoArray, emptyDogInfoTemplate]);
  };

  const validateRequiredFields = () => {
    let formIsValidated = true;
    const newAlerts = [];

    if (!groupIntakeDate) {
      formIsValidated = false;
      newAlerts.push({ alertMsg: 'Intake date is required', alertClass: 'alertError', alertIcon: faExclamationCircle });
    }

    if (!dogInfoArray.map((dog) => Boolean(dog.name)).includes(true)) {
      formIsValidated = false;
      newAlerts.push({ alertMsg: 'Dog name is required', alertClass: 'alertError', alertIcon: faExclamationCircle });
    }
    if (newAlerts.length > 0) addAlerts(newAlerts);
    return formIsValidated;
  };

  const handleAddDogsClick = async () => {
    if (validateRequiredFields() === false) return;
    const dogsWithName = dogInfoArray.filter((dog) => Boolean(dog.name));
    const newDogs_commonFieldsAdded = dogsWithName.map((dog) => {
      return {
        ...dog,
        intakeDate: groupIntakeDate,
        group: groupName,
        origin: groupOrigin,
        status: "intake",
        vettingStatus: "incomplete",
      };
    });
    const insertedDogs = await saveDogGroup({ newDogsArray: newDogs_commonFieldsAdded });
    if (!insertedDogs.error) {
      addDogsToAppState(insertedDogs);
      setIsAddingNewDogGroup(false);
    } else {
      const errorMsg = insertedDogs.error;
      addAlerts([{alertMsg: errorMsg, alertClass: "alertError", alertIcon:faExclamationCircle}]);
    }
  };

  const dogFieldTransitions = useTransition(dogInfoArray, {
    trail: 35,
    config: {precision: 0.1},
    from: { transform: 'translateY(-15%)', opacity: 0 },
    enter: { transform: 'translateX(0%)', opacity: 1 },
    leave: { transform: 'translateX(15%)', opacity: 0 },
    keys: dogInfoArray.map((dog, index) => index),
  });

  const animatedDogFields = dogFieldTransitions((style, dog, t, index) => {
    return (
      <animated.div style={style} className="add-new-dog-group__newDogs__dog">
        <span className="add-new-dog-group__newDogs__dog__dogNum">{`${index + 1}.`}</span>
        <input
          type="text"
          placeholder="Name..."
          value={dog.name === null ? '' : dog.name}
          className="plc-hold-red plc-hold-fnt-sz-8 add-new-dog-group__newDogs__dog__nameInput"
          onChange={(e) => handleOnDogNameChange(e, index)}
          onBlur={(e) => handleOnDogNameBlur(e, index)}
        />
        <input
          type="text"
          placeholder="Sex"
          value={dog.sex === null ? '' : dog.sex}
          className="plc-hold-fnt-sz-8 add-new-dog-group__newDogs__dog__sexInput"
          onChange={(e) => handleOnSexChange(e, index)}
        />
      </animated.div>
    );
  });
  return (
    <div className="add-new-dog-group-wrapper">
      <div className="add-new-dog-group">
        <div className="add-new-dog-group__generalInfo">
          <label className="add-new-dog-group__label-wrapper">
            <span className="add-new-dog-group__label"># Dogs</span>
            <input
              type="text"
              placeholder="#"
              value={numDogs === null ? '' : numDogs}
              className="plc-hold-fnt-sz-8 plc-hold-center add-new-dog-group__generalInfo__input"
              style={{ width: '2.5rem' }}
              onChange={(e) => handleNumDogsChange(e)}
              onBlur={(e) => handleNumDogsBlur(e)}
            />
          </label>
          <label className="add-new-dog-group__label-wrapper">
            <span className="add-new-dog-group__label">Group Name</span>
            <input
              type="text"
              value={groupName === null ? '' : groupName}
              placeholder="Group name..."
              className="plc-hold-fnt-sz-8 add-new-dog-group__generalInfo__input"
              style={{ width: '7rem' }}
              onChange={(e) => setGroupName(e.target.value ? e.target.value : null)}
              onBlur={(e) => setGroupName(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </label>
          <label className="add-new-dog-group__label-wrapper">
            <span className="add-new-dog-group__label">Group Intake Date</span>
            <input
              type="text"
              value={groupIntakeDate === null ? '' : groupIntakeDate}
              placeholder="MM-DD-YY"
              className="plc-hold-red plc-hold-center add-new-dog-group__generalInfo__input"
              style={{ width: '6rem' }}
              onChange={(e) => setGroupIntakeDate(e.target.value ? dateMask(e.target.value) : null)}
              onBlur={() => handleValidateDate(groupIntakeDate, setGroupIntakeDate)}
            />
          </label>
          <label className="add-new-dog-group__label-wrapper">
            <span className="add-new-dog-group__label">Group Origin</span>
            <input
              type="text"
              value={groupOrigin === null ? '' : groupOrigin}
              placeholder="Group origin..."
              className="plc-hold-fnt-sz-8 add-new-dog-group__generalInfo__input"
              style={{ width: '7rem' }}
              onChange={(e) => setGroupOrigin(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </label>
        </div>
        <div className="add-new-dog-group__newDogs">
          {animatedDogFields}
          <FontAwesomeIcon icon={faPlusCircle} className="add-new-dog-group__addOneMore" onClick={handlePlusClick} />
          {animatedAlerts}
        </div>
        <div className="dog-item__editModeUI">
          <button className="dog-item__editModeUI__cancel" onClick={() => setIsAddingNewDogGroup(false)}>
            <FontAwesomeIcon icon={faTimesCircle} />
            {'Cancel'}
          </button>
          <button className="dog-item__editModeUI__save" onClick={handleAddDogsClick}>
            <FontAwesomeIcon icon={faSave} />
            {'Add Dogs'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {addDogsToAppState, setIsAddingNewDogGroup})(AddNewDogGroup);
