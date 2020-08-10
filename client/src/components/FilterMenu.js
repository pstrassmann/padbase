import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { connect } from 'react-redux';

const FilterMenu = () => {

  const [filterByMenuActive, setFilterByMenuActive] = useState(false);

  const handleClickDropdown = () => {
    setFilterByMenuActive(!filterByMenuActive);
  };

  const handleClickOption = (optionStr) => {
    // setSearchByType(optionStr);
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
          Filters
          <div className={`filter-by-menu-button__icon ${filterByMenuActive ? 'filter-by-menu-button__icon-active' : '' }`}>
            <i className="fas fa-chevron-down" />
          </div>
        </div>
        <div className={`filter-by-dropdown ${filterByMenuActive ? 'filter-by-dropdown__unhide' : ''}`}>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Sex: Male')}>
            <div>
              <i className="fas fa-signature fa-sm" />
            </div>
            Sex: Male
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Sex: Female')}>
            <div>
              <i className="fas fa-signature fa-sm" />
            </div>
            Sex: Female
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Spay/Neuter: True')}>
            <div>
              <i className="fas fa-signature fa-sm" />
            </div>
            Spay/Neuter: True
          </div>
          <div className="filter-by-dropdown__option" onClick={() => handleClickOption('Spay/Neuter: False')}>
            <div>
              <i className="fas fa-signature fa-sm" />
            </div>
            Spay/Neuter: False
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

const mapStateToProps = (state) => ({
})

export default connect(null, null)(FilterMenu);
