import React, { useState } from 'react';
import { removeSpacesAndPunctuation } from '../../utils/text';

const StatusPillDropdown = ({ options, state, stateSetter, inEditMode }) => {
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

  return (
    <>
      <div
        tabIndex="0"
        onFocus={handleOpenDropdown}
        onMouseDown={handleOpenDropdown}
        onBlur={handleBlurDropdown}
        className={dropdownActive ? 'status-dropdown-label status-dropdown-label--active' : 'status-dropdown-label'}
      >
        <span
          className={`status-pill ${removeSpacesAndPunctuation(state).toLowerCase()} ${
            inEditMode ? 'status-dropdown-label--editable' : ''
          }`}
        >
          {state}
        </span>
        <div className={`status-dropdown ${dropdownActive ? 'status-dropdown__unhide' : ''}`}>
          {options.map((option, index) => (
            <div key={option} className="status-dropdown__option" onClick={() => handleClickOption(option)}>
              <span
                className={`status-pill status-dropdown__option__menuPill ${removeSpacesAndPunctuation(
                  option
                ).toLowerCase()}`}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatusPillDropdown;
