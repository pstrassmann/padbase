import React, { useState } from 'react';
import { useSpring, useTransition, animated } from "react-spring";
import { useMeasure } from "react-use";
import { capitalizeWords } from '../utils/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';

const DogItemBodyTail = ({dog}) => {

  const [bodyTailExpanded, setBodyTailExpanded] = useState(false);

  const [ref, {height}] = useMeasure();

  const handleExpandBodyTail = () => {
    setBodyTailExpanded(!bodyTailExpanded);
  }

  const expand = useSpring({
    // config: { friction: 10 },
    overflow: 'hidden',
    height: bodyTailExpanded ? `${height}` : '0px'
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

  const history = dog.history || 'N/A';
  const fleaMedBrand = dog.medical.fleaMedBrand ? capitalizeWords(dog.medical.fleaMedBrand) : 'N/A';
  const otherVetsUsed = getOtherVetsUsed(dog.medical);
  const medNotes = dog.medical.medNotes || 'N/A';
  const upcomingVetAppts = 'N/A';
  const notes = dog.notes || 'N/A';

  return (
    <>
      <div className="dog-item__angleDoubleDown" onClick={handleExpandBodyTail}>
        <FontAwesomeIcon icon={faAngleDoubleDown} size="sm" className="dog-item__angleDoubleDown__icon"/>
      </div>
    <animated.div style={expand}>
      <div ref={ref} className="dog-item-body-tail">
      <div className="dog-item__history dog-item__body-tail-cell">
        <div className="dog-item__label">History Prior to TAP</div>
        { history }
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
    </animated.div>
    </>
  )
}

export default DogItemBodyTail;
