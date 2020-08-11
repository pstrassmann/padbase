import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMars, faVenus, faCut, faTimes, faCheck, faFileMedical, faSyringe, faBone, faBabyCarriage,
} from '@fortawesome/free-solid-svg-icons'
import { addDogFilter } from '../actions/dogActions';

const FilterMenu = ({ addDogFilter }) => {

  const [filterByMenuActive, setFilterByMenuActive] = useState(false);

  const handleClickDropdown = () => {
    setFilterByMenuActive(!filterByMenuActive);
  };

  const handleClickOption = (filterStr) => {
    addDogFilter(filterStr);
    setFilterByMenuActive(false);
  }

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        if (filterByMenuActive) {
          setFilterByMenuActive(false);
        }
      }}
    >
      <div className="filter-by-menu">
        <div className="filter-by-menu-button" onClick={handleClickDropdown}>
          Add Filter
          <div className={`filter-by-menu-button__icon ${filterByMenuActive ? 'filter-by-menu-button__icon-active' : '' }`}>
            <FontAwesomeIcon icon={ faPlus } />
          </div>
        </div>
        <div className={`filter-by-dropdown ${filterByMenuActive ? 'filter-by-dropdown__unhide' : ''}`}>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Sex: Male')}>
            <div>
              <FontAwesomeIcon icon={ faMars } size="sm" />
            </div>
            Sex: Male
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Sex: Female')}>
            <div>
              <FontAwesomeIcon icon={ faVenus } size="sm" />
            </div>
            Sex: Female
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Spay/Neuter: True')}>
            <div>
              <FontAwesomeIcon icon={ faCut } size="sm" />
            </div>
            Spay/Neuter: True
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Spay/Neuter: False')}>
            <div>
              <FontAwesomeIcon icon={ faCut } size="sm" />
            </div>
            Spay/Neuter: False
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Vetting Status: Incomplete')}>
            <div>
              <FontAwesomeIcon icon={ faTimes } size="sm" />
            </div>
            Vetting Status: Incomplete
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Vetting Status: Complete')}>
            <div>
              <FontAwesomeIcon icon={ faCheck } size="sm" />
            </div>
            Vetting Status: Complete
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Vetting Status: Pending Records')}>
            <div>
              <FontAwesomeIcon icon={ faFileMedical } size="sm" />
            </div>
            Vetting Status: Pending Records
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Needs Rabies Vaccine')}>
            <div>
              <FontAwesomeIcon icon={ faSyringe } size="sm" />
            </div>
            Needs Rabies Vaccine
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Adult dog: Cleared for Adoption')}>
            <div>
              <FontAwesomeIcon icon={ faBone } size="sm" />
            </div>
            Adult dog: Cleared for Adoption
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Puppy: Cleared for Adoption')}>
            <div>
              <FontAwesomeIcon icon={ faBabyCarriage } size="sm" />
            </div>
            Puppy: Cleared for Adoption
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default connect(null, { addDogFilter })(FilterMenu);
