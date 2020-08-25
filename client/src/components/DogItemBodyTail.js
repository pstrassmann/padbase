import React, {useState} from 'react';
import { useSpring, animated } from "react-spring";
import { useMeasure } from "react-use";
import TextareaAutosize from 'react-textarea-autosize';
import { capitalizeWords } from '../utils/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
const DogItemBodyTail = ({dog, bodyExpanded, bodyTailExpanded, inEditMode, setInEditMode, handleHeaderReset, handleBodyReset}) => {

  const [ref, {height}] = useMeasure();

  const expand = useSpring({
    overflow: 'hidden',
    height: bodyExpanded && bodyTailExpanded ? `${height}px` : '0px',
  });

  const getOtherVetsUsed = (dogMedicalObj) => {
    if (dogMedicalObj === undefined) return 'N/A';
    if (dogMedicalObj.allVetsUsed.length === 0) return 'N/A';
    const nonPrimaryVets = dogMedicalObj.allVetsUsed.filter((e) => {
      return e !== dogMedicalObj.primaryVet;
    });
    if (nonPrimaryVets.length === 0) return 'N/A';
    return nonPrimaryVets.map(e => capitalizeWords(e)).join(', ');
  }

  const history_init = dog.history || 'N/A';
  const [history, setHistory] = useState(history_init);

  const fleaMedBrand = dog.medical.fleaMedBrand ? capitalizeWords(dog.medical.fleaMedBrand) : 'N/A';
  const otherVetsUsed = getOtherVetsUsed(dog.medical);
  const medNotes = dog.medical.medNotes || 'N/A';
  const upcomingVetAppts = 'N/A';
  const notes = dog.notes || 'N/A';

  const handleHistoryChange = (e) => {
    setHistory(e.target.value)
  }

  const handleBodyTailReset = () => {
    setHistory(history_init);
  }

  const handleCancelEdit = () => {
    setInEditMode(false);
    handleHeaderReset();
    handleBodyReset();
    handleBodyTailReset();
  }
  const handleSaveEdit = () => {
    setInEditMode(false);
  }

  return (
    <>
    <animated.div style={expand}>
      <div ref={ref}>
      <div className="dog-item-body-tail">
      <div className="dog-item__history dog-item__body-tail-cell">
        <div className="dog-item__label">History Prior to TAP</div>
        <TextareaAutosize
               style={{resize: 'none'}}
               value={ history }
               className={inEditMode ? "dog-item-body__displayText--editable" : "dog-item-body__displayText"}
               readOnly={ !inEditMode }
               onChange={handleHistoryChange}
        />
      </div>
      <div className="dog-item__otherVets dog-item__body-tail-cell">
        <div className="dog-item__label">Other Vets Used</div>
        { otherVetsUsed }
      </div>
      <div className="dog-item__fleaMedBrand dog-item__body-tail-cell">
        <div className="dog-item__label">Flea Med Brand</div>
        { fleaMedBrand }
      </div>
      <div className="dog-item__medNotes dog-item__body-tail-cell">
        <div className="dog-item__label">Medical Notes</div>
        { medNotes }
      </div>
      <div className="dog-item__vetAppts dog-item__body-tail-cell">
        <div className="dog-item__label">Upcoming Vet Appointments</div>
        { upcomingVetAppts }
      </div>
      <div className="dog-item__notes dog-item__body-tail-cell">
        <div className="dog-item__label">Other Notes</div>
        { notes }
      </div>
      </div>
      {inEditMode && (
        <div className="dog-item__editModeUI">
          <div className="dog-item__editModeUI__cancel" onClick={handleCancelEdit}>
            <FontAwesomeIcon icon={faTimesCircle}/>
            Cancel Edit
          </div>
          <div className="dog-item__editModeUI__save" onClick={handleSaveEdit}>
            <FontAwesomeIcon icon={faSave}/>
            Save Dog
          </div>
        </div>
      )}
    </div>
    </animated.div>
    </>
  )
}

export default DogItemBodyTail;
