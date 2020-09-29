import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addNewDog } from '../actions/dogActions';
import OutsideClickHandler from 'react-outside-click-handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faPlus, faBabyCarriage } from '@fortawesome/free-solid-svg-icons';

const AddDogsMenu = ({ addNewDog }) => {
  const [dropdownActive, setDropdownActive] = useState(false);

  const handleClickDropdown = () => {
    setDropdownActive(!dropdownActive);
  };

  const handleAddSingleDog = () => {
    addNewDog();
    setDropdownActive(!dropdownActive);
  };

  const handleClickOption = () => {
    setDropdownActive(false);
  }

  return (
    <div className="add-dogs-menu">
    <OutsideClickHandler
      display={'flex'}
      onOutsideClick={() => {

        if (dropdownActive) {
          setDropdownActive(false);
        }
      }}
    >
    <div className="add-dogs-btn-wrapper">
      <div className="add-dogs-btn" onClick={handleClickDropdown}>
        <div> Add Dogs </div>
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon={faDog} transform="down-3 up-2" />
          <FontAwesomeIcon icon={faPlus} transform="shrink-9 left-5 up-7" />
        </span>
      </div>
    </div>
      <div style={{width: '9.5rem', right: 0}} className={`select-dropdown ${dropdownActive ? 'select-dropdown__unhide' : ''}`}>
        <div className="select-dropdown__option" onClick={handleAddSingleDog}>
          <div>
            <FontAwesomeIcon icon={faDog} fixedWidth />
          </div>
          Add Single Dog
        </div>
        <div className="select-dropdown__option" onClick={() => handleClickOption()}>
          <div>
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon={faDog} transform="shrink-6 up-5 left-6" />
              <FontAwesomeIcon icon={faDog} transform="shrink-6 up-5 right-6" />
              <FontAwesomeIcon icon={faDog} transform="shrink-6 down-5 left-6" />
              <FontAwesomeIcon icon={faDog} transform="shrink-6 down-5 right-6" />
            </span>
          </div>
          Add Group of Dogs
        </div>
        <div className="select-dropdown__option" onClick={() => handleClickOption()}>
          <div>
              <FontAwesomeIcon icon={faBabyCarriage} fixedWidth />
          </div>
          Add Litter of Dogs
        </div>
      </div>
    </OutsideClickHandler>
    </div>
  );
};

export default connect(null, { addNewDog })(AddDogsMenu);