import React from 'react';
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';

const InDemoModeMsg = () => {
  return (
    <div className="in-demo-mode-msg-wrapper">
      <FontAwesomeIcon icon={faBell} size='lg'/>
    <p className="in-demo-mode-msg">
      You are currently using PadBase in Demo Mode - all data and personal
      information have been generated randomly. <Link to="/login" className="in-demo-mode-msg__signInLink">Sign in</Link> to access the full application.
    </p>
    </div>
  )
}

export default InDemoModeMsg;