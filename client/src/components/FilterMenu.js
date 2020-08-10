import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { connect } from 'react-redux';
import { setSearchByType } from '../actions/dogActions';

const SearchByMenu = ({searchByType, setSearchByType}) => {

  const [searchByMenuActive, setSearchByMenuActive] = useState(false);
digg
  const handleClickDropdown = () => {
    setSearchByMenuActive(!searchByMenuActive);
  };

  const handleClickOption = (optionStr) => {
    setSearchByType(optionStr);
    setSearchByMenuActive(false);
  }

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        if (searchByMenuActive) {
          setSearchByMenuActive(false);
        }
      }}
    >
      <div className="search-by-menu">
        <div className="search-by-selected-label" onClick={handleClickDropdown}>
          {searchByType}
          <div
            className={`search-by-selected-label__icon ${
              searchByMenuActive ? 'search-by-selected-label__icon-active' : ''
            }`}
          >
            <i className="fas fa-chevron-down" />
          </div>
        </div>
        <div
          className={`search-by-dropdown ${
            searchByMenuActive ? 'search-by-dropdown__unhide' : ''
          }`}
        >
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('name')}>
            <div>
              <i className="fas fa-signature fa-sm" />
            </div>
            Name
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('breed')}>
            <div>
              <i className="fas fa-dog fa-sm" />
            </div>
            Breed
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('foster')}>
            <div>
              <i className="fas fa-house-user fa-sm" />
            </div>
            Foster
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('foster coordinator')}>
            <div>
              <i className="fas fa-laptop-house fa-sm" />
            </div>
            Foster Coordinator
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('adoption coordinator')}>
            <div>
              <i className="fas fa-user-check fa-sm" />
            </div>
            Adoption Coordinator
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('vetting coordinator')}>
            <div>
              <i className="fas fa-laptop-medical fa-sm" />
            </div>
            Vetting Coordinator
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

const mapStateToProps = (state) => ({
  searchByType: state.dog.searchByType
});

export default connect(mapStateToProps, { setSearchByType })(SearchByMenu);
