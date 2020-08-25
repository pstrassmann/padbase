import React, { useState } from 'react';

const Dropdown = ({options, state, stateSetter, inEditMode }) => {
  const [dropdownActive, setDropdownActive] = useState(false);

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
    stateSetter(option);
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
        className={
          dropdownActive
            ? 'dropdown-label dropdown-label--active'
            : 'dropdown-label'
        }
      >
        {state}
        <div className={`dropdown ${dropdownActive ? 'dropdown__unhide' : ''}`}>
          {options.map((option, index) => (
            <div
              key={option}
              className="dropdown__option"
              onClick={() => handleClickOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dropdown;
