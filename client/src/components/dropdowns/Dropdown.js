import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';

const Dropdown = ({ options, state, stateSetter, inEditMode }) => {
  const [dropdownActive, setDropdownActive] = useState(false);


  let angleDownFlip = useSpring({
    config: {tension: 250},
    transform: dropdownActive ? 'rotate(180deg)' : 'rotate(0deg)',
    opacity: dropdownActive ? 0.2 : 1,
  });


  const handleOpenDropdown = () => {
    if (inEditMode) {
      setDropdownActive(true);
    }
  };
  const handleBlurDropdown = () => {
    if (inEditMode) {
      setDropdownActive(false);
    }
  };

  const handleClickOption = (option) => {
    stateSetter(option === 'N/A' ? null : option);
    setDropdownActive(false);
  };

  // @todo add ability to use arrow keys to navigate dropdown
  // let i = 0 // used for calculating dropdown option to select on keydown
  // const getIndex = () => {
  //   const index = i;
  //   i === options.length-1 ? i=0 : i = i+1
  //   return(index);
  // }

  return (
    <>
      <div
        tabIndex="0"
        onFocus={handleOpenDropdown}
        onMouseDown={handleOpenDropdown}
        onBlur={handleBlurDropdown}
        className={dropdownActive ? 'dropdown-label--active' : 'dropdown-label'}
      >
        <div className="dropdown-label__content">
          <div>{state}</div>
            <animated.div style={angleDownFlip}>
              {inEditMode && <FontAwesomeIcon icon={faAngleDown} size="sm" fixedWidth/>}
            </animated.div>
        </div>
        <div className={`dropdown ${dropdownActive ? 'dropdown__unhide' : ''}`}>
          {options.map((option, index) => (
            <div key={option} className="dropdown__option" onClick={() => handleClickOption(option)}>
              {option}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dropdown;
