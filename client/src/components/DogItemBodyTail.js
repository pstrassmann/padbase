import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useSpring, useTransition, animated } from 'react-spring';
import { v4 as uuidv4 } from 'uuid';
import { capitalizeWords } from '../utils/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimesCircle, faExclamationCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import ConditionalTextArea from './ConditionalTextArea';
import ConditionalTextInput from './ConditionalTextInput';
import { saveDog } from '../api/dogAPI';
import { updateDogInAppState } from '../actions/dogActions';

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
  dogItemAlerts,
  setDogItemAlerts,
}) => {
  const alertsRef = useRef(dogItemAlerts);

  useEffect(() => {
    alertsRef.current = dogItemAlerts;
  });

  useEffect(() => {
    // Clear any unfinished timeouts on component unmount
    return () => {
      alertsRef.current.forEach((alertObj) => {
        clearTimeout(alertObj.timer);
      });
    };
  }, []);

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

  const fleaMedBrand_init = dogState.medical.fleaMedBrand ? capitalizeWords(dogState.medical.fleaMedBrand) : null;
  const [fleaMedBrand, setFleaMedBrand] = useState(fleaMedBrand_init);

  const otherVetsUsed_init = getOtherVetsUsed(dogState.medical);
  const [otherVetsUsed, setOtherVetsUsed] = useState(otherVetsUsed_init);

  const medNotes_init = dogState.medical.medNotes || null;
  const [medNotes, setMedNotes] = useState(medNotes_init);

  const upcomingVetAppts_init = dogState.medical.upcomingVetAppts || null;
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

  const handleCancelEdit = () => {
    setInEditMode(false);
    handleHeaderReset();
    handleBodyReset();
    handleBodyTailReset();
  };

  const dogBodyTailData = {
    history,
    otherVetsUsed,
    fleaMedBrand,
    medNotes,
    upcomingVetAppts,
    notes,
  };

  const setAlert = (alertMsg, alertClass, alertIcon) => {
    const uid = uuidv4();
    const timeoutDur = 4000;
    const timer = setTimeout(
      () => setDogItemAlerts(alertsRef.current.filter((alertObj) => alertObj.uid !== uid)),
      timeoutDur
    );
    setDogItemAlerts([...alertsRef.current, { uid: uid, timer: timer, msg: alertMsg, class: alertClass, icon: alertIcon }]);
  };

  const handleSaveEdit = async () => {
    const dogObj = { dogID: dogState._id, ...dogHeaderData, ...dogBodyData, ...dogBodyTailData };
    const updatedDog = await saveDog(dogObj);
    if (!updatedDog.error) {
      setDogState(updatedDog);
      updateDogInAppState(updatedDog);
      setInEditMode(false);
      setAlert(`Successfully updated ${dogState.name}`, "dog-item__alerts__alertSuccess", faCheck);

    } else {
      const errorMsg = updatedDog.error;
      setAlert(errorMsg, "dog-item__alerts__alertError", faExclamationCircle);
    }
  };

  const alertTransitions = useTransition(dogItemAlerts, {
    from: {transform: 'translateX(-15%)', opacity: 0},
    enter: {transform: 'translateX(0px)', opacity: 1},
    leave: {transform: 'translateX(50%)', opacity: 0},
    keys: alertObj => alertObj.uid,
  })

  const animatedAlerts = alertTransitions((style, alertObj) => {
    return (
    <animated.div style={style} className={alertObj.class}>
      <FontAwesomeIcon icon={alertObj.icon}/>
      {alertObj.msg}
    </animated.div>
    )
  })

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
            { animatedAlerts }
          </div>
        {inEditMode && (
          <div className="dog-item__editModeUI">
            <div className="dog-item__editModeUI__cancel" onClick={handleCancelEdit}>
              <FontAwesomeIcon icon={faTimesCircle} />
              Cancel Edit
            </div>
            <div className="dog-item__editModeUI__save" onClick={handleSaveEdit}>
              <FontAwesomeIcon icon={faSave} />
              Save Dog
            </div>
          </div>
        )}
      </animated.div>
    </>
  );
};

export default connect(null, { updateDogInAppState })(DogItemBodyTail);
