import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMars,
  faVenus,
  faCut,
  faTimes,
  faCheck,
  faFileMedical,
  faSyringe,
  faBone,
  faBabyCarriage,
} from '@fortawesome/free-solid-svg-icons';
import { addDogFilter, searchDogs } from '../actions/dogActions';

const FilterMenu = ({ addDogFilter, searchDogs, cachedDogSearchText }) => {
  const [filterByMenuActive, setFilterByMenuActive] = useState(false);

  const handleClickDropdown = () => {
    setFilterByMenuActive(!filterByMenuActive);
  };

  const handleClickOption = (filterStr) => {
    addDogFilter(filterStr);
    setFilterByMenuActive(false);
    if (cachedDogSearchText !== '') {
      searchDogs(cachedDogSearchText);
    }
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        if (filterByMenuActive) {
          setFilterByMenuActive(false);
        }
      }}
    >
      <div className="select-menu">
        <div className="select-menu-button" onClick={handleClickDropdown}>
          Add Filter
          <div
            className={`select-menu-button__icon ${filterByMenuActive ? 'select-menu-button__icon-active' : undefined}`}
          >
            <FontAwesomeIcon icon={faPlus} transform='shrink-3' fixedWidth/>
          </div>
        </div>
        <div style={{width: '14rem', left: 0}} className={`select-dropdown ${filterByMenuActive ? 'select-dropdown__unhide' : ''}`}>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Sex: Male')}>
            <div>
              <FontAwesomeIcon icon={faMars} fixedWidth/>
            </div>
            Sex: Male
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Sex: Female')}>
            <div>
              <FontAwesomeIcon icon={faVenus} fixedWidth/>
            </div>
            Sex: Female
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Spay/Neuter: True')}>
            <div>
              <FontAwesomeIcon icon={faCut} fixedWidth/>
            </div>
            Spay/Neuter: True
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Spay/Neuter: False')}>
            <div>
              <FontAwesomeIcon icon={faCut} fixedWidth/>
            </div>
            Spay/Neuter: False
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Vetting Status: Incomplete')}>
            <div>
              <FontAwesomeIcon icon={faTimes} fixedWidth/>
            </div>
            Vetting Status: Incomplete
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Vetting Status: Complete')}>
            <div>
              <FontAwesomeIcon icon={faCheck} fixedWidth/>
            </div>
            Vetting Status: Complete
          </div>
          <div
            className="select-dropdown__option"
            onClick={() => handleClickOption('Vetting Status: Pending Records')}
          >
            <div>
              <FontAwesomeIcon icon={faFileMedical} fixedWidth/>
            </div>
            Vetting Status: Pending Records
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Needs Rabies Vaccine')}>
            <div>
              <FontAwesomeIcon icon={faSyringe} fixedWidth/>
            </div>
            Needs Rabies Vaccine
          </div>
          <div
            className="select-dropdown__option"
            onClick={() => handleClickOption('Adult Dog: Cleared for Adoption')}
          >
            <div>
              <FontAwesomeIcon icon={faBone} fixedWidth/>
            </div>
            Adult Dog: Cleared for Adoption
          </div>
          <div className="select-dropdown__option" onClick={() => handleClickOption('Puppy: Cleared for Adoption')}>
            <div>
              <FontAwesomeIcon icon={faBabyCarriage} fixedWidth/>
            </div>
            Puppy: Cleared for Adoption
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

const mapStateToProps = (state) => ({
  cachedDogSearchText: state.dog.cachedDogSearchText,
});

export default connect(mapStateToProps, { addDogFilter, searchDogs })(FilterMenu);
