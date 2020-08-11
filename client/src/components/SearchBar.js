import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import SearchByMenu from './SearchByMenu';
import {searchDogs, resetDogSearch } from '../actions/dogActions';

const SearchBar = ({ searchDogs, resetDogSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    if (event.target.value.trim() !== '') {
      searchDogs(event.target.value.trim());
    } else {
      resetDogSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    resetDogSearch();
  }

  return (
    <>
      <div className="home-dog-search-bar-wrapper">
        <div className="home-dog-search-bar">
          <input
            type="text"
            value={searchText}
            placeholder="Search by..."
            onChange={handleSearch}
            className="home-dog-search-bar__input"
          />
          <div className="home-dog-search-bar__search-icon">
            {searchText === '' ?
            <FontAwesomeIcon icon={ faSearch } size="sm" />
            : <FontAwesomeIcon icon={ faTimes } size="sm" onClick={handleClearSearch}/>}
          </div>
        </div>
        <SearchByMenu />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {searchDogs, resetDogSearch })(SearchBar);
