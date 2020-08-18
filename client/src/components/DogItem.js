import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faWindowMinimize } from '@fortawesome/free-solid-svg-icons'

import { formatDate, formatAge } from '../utils/dates';
import {useSpring, animated} from 'react-spring';

import DogItemBody from './DogItemBody';
import { connect } from 'react-redux';

const DogItem = React.forwardRef((props, ref) => {
    const dog = props.dog;
    const DogItem = () => {
      const [bodyExpanded, setBodyExpanded] = useState(false);
      const [bodyInitialized, setBodyInitialized] = useState(false);

      const iconFlip = useSpring({
        transform: bodyExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      })

      const iconDivBorderBottom = useSpring({
        borderBottom: bodyExpanded ? '' : 'none',
        borderBottomLeftRadius: bodyExpanded ? '5px' : '0px'
      })

      const formatWeight = (weight) => {
        if (!weight) return 'N/A';
        return `${weight.toFixed(0)} lbs`;
      };

      const formatIsFixed = (isFixed) => {
        if (isFixed === undefined) return 'N/A';
        return isFixed ? 'Yes' : 'No';
      };

      const getPrimaryStatus = (statusArray) => {
        if (statusArray.length === 0) return ['N/A', 'missing-status'];
        if (statusArray.includes('deceased')) return ['Deceased', 'deceased'];
        if (statusArray.includes('adopted')) return ['Adopted', 'adopted'];
        if (statusArray.includes('fta')) return ['FTA', 'fta'];
        if (statusArray.includes('intake')) return ['Intake', 'intake'];
        if (statusArray.includes('on hold - all')) return ['On Hold', 'onhold'];
        if (statusArray.includes('fostered')) return ['Fostered', 'fostered'];
        if (statusArray.includes('temp foster'))
          return ['Fostered', 'fostered'];
        if (statusArray.includes('temp')) return ['Fostered', 'fostered'];
        return ['N/A', 'missing-status'];
      };

      const getVettingStatus = (statusArray) => {
        if (statusArray.length === 0) return ['N/A', 'missing-status'];
        if (statusArray.includes('deceased')) return ['Deceased', 'deceased'];
        if (statusArray.includes('incomplete'))
          return ['Incomplete', 'vetting-incomplete'];
        if (statusArray.includes('complete'))
          return ['Complete', 'vetting-complete'];
        if (statusArray.includes('pending records'))
          return ['Pend. Recs.', 'pending-records'];
        return ['N/A', 'missing-status'];
      };

      const expandBody = () => {
        if (!bodyInitialized) {
          setBodyInitialized(true)
        }
        setBodyExpanded(!bodyExpanded);
      };
      const name = dog.name;
      const sex = dog.sex || 'N/A';
      const weight = formatWeight(dog.weight);
      const age = formatAge(dog.birthday);
      const fixed = formatIsFixed(dog.isFixed);
      const intakeDate = formatDate(dog.intakeDate);
      const [primaryStatus, statusClassName] = getPrimaryStatus(dog.status);
      const [primaryVettingStatus, vetStatusClassName] = getVettingStatus(
        dog.vettingStatus
      );

      const dogItemHeader = (
        <div className='dog-item-header'>
          <div className="dog-item__name dog-item__header-cell">
            <div className="dog-item__label">Name</div>
            {name}
          </div>
          <div className="dog-item__sex dog-item__header-cell">
            <div className="dog-item__label">Sex</div>
            {sex}
          </div>
          <div className="dog-item__weight dog-item__header-cell">
            <div className="dog-item__label">Weight</div>
            {weight}
          </div>
          <div className="dog-item__age dog-item__header-cell">
            <div className="dog-item__label">Age</div>
            {age}
          </div>
          <div className="dog-item__fixed dog-item__header-cell">
            <div className="dog-item__label">Fixed?</div>
            {fixed}
          </div>
          <div className="dog-item__intake dog-item__header-cell">
            <div className="dog-item__label">Intake</div>
            {intakeDate}
          </div>
          <div className="dog-item__status dog-item__header-cell">
            <div className="dog-item__label">Status</div>
            <span className={`status-pill ${statusClassName}`}>
              {primaryStatus}
            </span>
          </div>
          <div className="dog-item__vstatus dog-item__header-cell">
            <div className="dog-item__label">Vetting Status</div>
            <span className={`status-pill ${vetStatusClassName}`}>
              {primaryVettingStatus}
            </span>
          </div>
        </div>
      );

      return (
        <div className="dog-item" ref={ref} key={dog._id + 'all'}>
          <div className="dog-item-header-wrapper"  onClick={expandBody}>
            { dogItemHeader }
            <animated.div style={iconDivBorderBottom} className="dog-item__headerIcon">
              <animated.div style={ iconFlip }>
                <FontAwesomeIcon icon={ faAngleDown }/>
              </animated.div>
            </animated.div>
          </div>
            { bodyInitialized && <DogItemBody dog={ dog } bodyExpanded={ bodyExpanded }/> }
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
export default connect(null, null, null, {forwardRef: true})(DogItem);

