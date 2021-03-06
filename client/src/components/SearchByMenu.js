import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSignature, faBaby, faLayerGroup, faDog, faHouseUser, faLaptopHouse, faUserCheck, faLaptopMedical } from '@fortawesome/free-solid-svg-icons'
import { setSearchByType, searchDogs } from '../actions/dogActions';

const SearchByMenu = ({searchByType, setSearchByType, searchDogs, cachedDogSearchText}) => {

  const [searchByMenuActive, setSearchByMenuActive] = useState(false);

  const handleClickDropdown = () => {
    setSearchByMenuActive(!searchByMenuActive);
  };

  const handleClickOption = (optionStr) => {
    setSearchByType(optionStr);
    setSearchByMenuActive(false);
    if (cachedDogSearchText !== '') {
      searchDogs(cachedDogSearchText);
    }
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
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        <div
          className={`search-by-dropdown ${
            searchByMenuActive ? 'search-by-dropdown__unhide' : ''
          }`}
        >
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('dog name')}>
            <div>
              <FontAwesomeIcon icon={ faSignature } size="sm" />
            </div>
            Dog Name
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('mom name')}>
            <div>
              <FontAwesomeIcon icon={ faBaby } size="sm" />
            </div>
            Mom's Name
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('group name')}>
            <div>
              <FontAwesomeIcon icon={ faLayerGroup } size="sm" />
            </div>
            Group Name
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('breed')}>
            <div>
              <FontAwesomeIcon icon={ faDog } size="sm" />
            </div>
            Breed
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('foster')}>
            <div>
              <FontAwesomeIcon icon={ faHouseUser } size="sm" />
            </div>
            Foster
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('foster coordinator')}>
            <div>
              <FontAwesomeIcon icon={ faLaptopHouse } size="sm" />
            </div>
            Foster Coordinator
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('adoption coordinator')}>
            <div>
              <FontAwesomeIcon icon={ faUserCheck } size="sm" />
            </div>
            Adoption Coordinator
          </div>
          <div className="search-by-dropdown__option" onClick={() => handleClickOption('vetting coordinator')}>
            <div>
              <FontAwesomeIcon icon={ faLaptopMedical } size="sm" />
            </div>
            Vetting Coordinator
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

const mapStateToProps = (state) => ({
  searchByType: state.dog.searchByType,
  cachedDogSearchText: state.dog.cachedDogSearchText,
});

export default connect(mapStateToProps, { setSearchByType, searchDogs })(SearchByMenu);
