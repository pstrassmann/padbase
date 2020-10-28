import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';

const InDemoModeMsg = () => {
  return (
    <div className="in-demo-mode-msg-wrapper">
      <FontAwesomeIcon icon={faBell} size='lg'/>
    <p className="in-demo-mode-msg">
      You are currently viewing PadBase in Demo Mode. All data and personal
      information has been generated randomly.
    </p>
    </div>
  )
}

export default InDemoModeMsg;