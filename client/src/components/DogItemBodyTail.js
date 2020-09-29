import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { capitalizeWords } from '../utils/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimesCircle, faExclamationCircle, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ConditionalTextArea from './ConditionalTextArea';
import ConditionalTextInput from './ConditionalTextInput';
import { updateDog, saveNewDog, deleteDog } from '../api/dogAPI';
import { updateDogInAppState, addDogsToAppState, setIsAddingNewDog, deleteDogInAppState } from '../actions/dogActions';
import useAlerts from '../utils/useAlerts';

const DogItemBodyTail = ({
  dogState,
  setDogState,
  dogHeaderData,
  dogBodyData,
  bodyExpanded,
  bodyTailExpanded,
  inEditMode,
  setInEditMode,
  handleHeaderReset,
  handleBodyReset,
  updateDogInAppState,
  setIsAddingNewDog,
  addDogsToAppState,
  deleteDogInAppState,
}) => {
  const [addAlerts, animatedAlerts] = useAlerts();
  const [inDeleteMode, setInDeleteMode] = useState(false);

  const expand = useSpring({
    overflow: 'hidden',
    from: { opacity: 0 },
    opacity: bodyExpanded && bodyTailExpanded ? 1 : 0,
  });

  const getOtherVetsUsed = (dogMedicalObj) => {
    if (dogMedicalObj === undefined) return null;
    if (dogMedicalObj.allVetsUsed.length === 0) return null;
    const nonPrimaryVets = dogMedicalObj.allVetsUsed.filter((e) => {
      return e !== dogMedicalObj.primaryVet;
    });
    if (nonPrimaryVets.length === 0) return null;
    return nonPrimaryVets.map((e) => capitalizeWords(e)).join(', ');
  };

  const history_init = dogState.history || null;
  const [history, setHistory] = useState(history_init);

  const fleaMedBrand_init =
    dogState.medical && dogState.medical.fleaMedBrand ? capitalizeWords(dogState.medical.fleaMedBrand) : null;
  const [fleaMedBrand, setFleaMedBrand] = useState(fleaMedBrand_init);

  const otherVetsUsed_init = getOtherVetsUsed(dogState.medical);
  const [otherVetsUsed, setOtherVetsUsed] = useState(otherVetsUsed_init);

  const medNotes_init = dogState.medical ? dogState.medical.medNotes || null : null;
  const [medNotes, setMedNotes] = useState(medNotes_init);

  const upcomingVetAppts_init = dogState.medical ? dogState.medical.upcomingVetAppts || null : null;
  const [upcomingVetAppts, setUpcomingVetAppts] = useState(upcomingVetAppts_init);

  const notes_init = dogState.notes || null;
  const [notes, setNotes] = useState(notes_init);

  const handleBodyTailReset = () => {
    setHistory(history_init);
    setOtherVetsUsed(otherVetsUsed_init);
    setFleaMedBrand(fleaMedBrand_init);
    setMedNotes(medNotes_init);
    setUpcomingVetAppts(upcomingVetAppts_init);
    setNotes(notes_init);
  };

  const handleCancelClick = () => {
    if (dogState.newDog !== true) {
      setInEditMode(false);
      handleHeaderReset();
      handleBodyReset();
      handleBodyTailReset();
    } else {
      setIsAddingNewDog(false);
    }
  };

  const dogBodyTailData = {
    history,
    otherVetsUsed,
    fleaMedBrand,
    medNotes,
    upcomingVetAppts,
    notes,
  };

  const validateRequiredFields = () => {
    let formIsValidated = true;
    const newAlerts = [];
    if (!dogHeaderData.name || !dogHeaderData.name.trim()) {
      formIsValidated = false;
      newAlerts.push({ alertMsg: 'Dog name is required', alertClass: 'alertError', alertIcon: faExclamationCircle });
    }
    if (!dogHeaderData.intakeDate) {
      formIsValidated = false;
      newAlerts.push({ alertMsg: 'Intake date is required', alertClass: 'alertError', alertIcon: faExclamationCircle });
    }
    if (
      dogBodyData.fosterInfo.newFoster === true &&
      (!dogBodyData.fosterInfo.email || !dogBodyData.fosterInfo.fullName)
    ) {
      formIsValidated = false;
      newAlerts.push({
        alertMsg: 'Name and email required for adding new foster',
        alertClass: 'alertError',
        alertIcon: faExclamationCircle,
      });
    }
    if (newAlerts.length > 0) addAlerts(newAlerts);
    return formIsValidated;
  };

  const handleCancelDelete = () => {
    setInDeleteMode(false);
  };

  const handleConfirmDelete = async () => {
    const response = await deleteDog({ _id: dogState._id });
    if (!response.error) {
      deleteDogInAppState(dogState._id);
    }
  };

  const handleSaveClick = async () => {
    if (dogState.newDog !== true && validateRequiredFields()) {
      // Updating existing dog
      const dogObj = { dogID: dogState._id, ...dogHeaderData, ...dogBodyData, ...dogBodyTailData };
      const updatedDog = await updateDog(dogObj);
      if (!updatedDog.error) {
        setDogState(updatedDog);
        updateDogInAppState(updatedDog);
        setInEditMode(false);
        addAlerts([
          { alertMsg: `Successfully updated ${dogHeaderData.name}`, alertClass: 'alertSuccess', alertIcon: faCheck },
        ]);
      } else {
        const errorMsg = updatedDog.error;
        addAlerts([{ alertMsg: errorMsg, alertClass: 'alertError', alertIcon: faExclamationCircle }]);
      }
    } else if (validateRequiredFields()) {
      // Adding new dog
      const dogObj = { ...dogHeaderData, ...dogBodyData, ...dogBodyTailData };
      const newDog = await saveNewDog(dogObj);
      if (!newDog.error) {
        addDogsToAppState([newDog]);
        setInEditMode(false);
        setIsAddingNewDog(false);
        // addAlerts([{alertMsg: `Successfully added ${ dogHeaderData.name }`, alertClass: "alertSuccess", alertIcon: faCheck}]);
      } else {
        const errorMsg = newDog.error;
        addAlerts([{ alertMsg: errorMsg, alertClass: 'alertError', alertIcon: faExclamationCircle }]);
      }
    }
  };

  return (
    <>
      <animated.div style={expand}>
        <div className="dog-item-body-tail">
          <div className="dog-item__history dog-item__body-tail-cell">
            <ConditionalTextArea
              label="History Prior to TAP"
              labelClass="dog-item__label"
              placeholder="History..."
              data={history !== null ? history : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setHistory(e.target.value || null)}
            />
          </div>
          <div className="dog-item__otherVets dog-item__body-tail-cell">
            <ConditionalTextInput
              label="Other Vets Used"
              labelClass="dog-item__label"
              placeholder="Other vets..."
              data={otherVetsUsed !== null ? otherVetsUsed : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setOtherVetsUsed(e.target.value ? capitalizeWords(e.target.value) : null)}
            />
          </div>
          <div className="dog-item__fleaMedBrand dog-item__body-tail-cell">
            <ConditionalTextInput
              label="Flea Med Brand"
              labelClass="dog-item__label"
              placeholder="Brand..."
              data={fleaMedBrand !== null ? fleaMedBrand : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => {
                setFleaMedBrand(e.target.value ? capitalizeWords(e.target.value) : null);
              }}
            />
          </div>
          <div className="dog-item__medNotes dog-item__body-tail-cell">
            <ConditionalTextArea
              label="Medical Notes"
              labelClass="dog-item__label"
              placeholder="Medical notes..."
              data={medNotes !== null ? medNotes : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setMedNotes(e.target.value || null)}
            />
          </div>
          <div className="dog-item__vetAppts dog-item__body-tail-cell">
            <ConditionalTextArea
              label="Upcoming Vet Appts"
              labelClass="dog-item__label"
              placeholder="Upcoming vet appts..."
              data={upcomingVetAppts !== null ? upcomingVetAppts : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setUpcomingVetAppts(e.target.value || null)}
            />
          </div>
          <div className="dog-item__notes dog-item__body-tail-cell">
            <ConditionalTextArea
              label="Other Notes"
              labelClass="dog-item__label"
              placeholder="Other notes..."
              data={notes !== null ? notes : 'N/A'}
              inEditMode={inEditMode}
              editClass="dog-item-body__displayText--editable"
              noEditClass="dog-item-body__displayText"
              handleOnChange={(e) => setNotes(e.target.value || null)}
            />
          </div>
        </div>
        <div className="dog-item__alerts">
          {animatedAlerts}
          {inDeleteMode && (
            <div className="alertError">
              <FontAwesomeIcon icon={faExclamationCircle} />
              {`Are you sure you want to delete ${dogState.name}?`}
            </div>
          )}
        </div>
        {inEditMode ? (
          inDeleteMode ? (
            <div className="dog-item__editModeUI">
              <button className="dog-item__editModeUI__cancel" onClick={handleCancelDelete}>
                <FontAwesomeIcon icon={faTimesCircle} />
                Cancel
              </button>
              <button className="dog-item__editModeUI__confirmDelete" onClick={handleConfirmDelete}>
                <FontAwesomeIcon icon={faTrashAlt} />
                Delete forever
              </button>
            </div>
          ) : (
            <div className="dog-item__editModeUI">
              <button className="dog-item__editModeUI__cancel" onClick={handleCancelClick}>
                <FontAwesomeIcon icon={faTimesCircle} />
                {dogState.newDog ? 'Cancel' : 'Cancel edit'}
              </button>
              <button className="dog-item__editModeUI__save" onClick={handleSaveClick}>
                <FontAwesomeIcon icon={faSave} />
                {dogState.newDog ? 'Add new dog' : 'Save dog'}
              </button>
              <button className="dog-item__editModeUI__trashButton" onClick={() => setInDeleteMode(true)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          )
        ) : (
          <></>
        )}
      </animated.div>
    </>
  );
};

export default connect(null, { updateDogInAppState, setIsAddingNewDog, addDogsToAppState, deleteDogInAppState })(
  DogItemBodyTail
);
