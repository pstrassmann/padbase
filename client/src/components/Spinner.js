import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw } from '@fortawesome/free-solid-svg-icons'

const Spinner = () => {
  return (
    <FontAwesomeIcon icon={faPaw} size="2x" spin/>
  )
}

export default Spinner;