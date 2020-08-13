import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import SearchByMenu from './SearchByMenu';
import {cacheDogSearchText, searchDogs, resetDogSearch } from '../actions/dogActions';

const SearchBar = ({ searchDogs, resetDogSearch, cacheDogSearchText }) => {
  const [searchText, setSearchText] = useState('');
  const [timer, setTimer] = useState(null);

  const handleSearch = (event) => {
    if (timer)  {
      clearTimeout(timer)
    }
    const text = event.target.value;
    setSearchText(event.target.value);
    if (event.target.value.trim() !== '') {
      searchDogs(event.target.value.trim());
    } else {
      resetDogSearch();
    }
      setTimer(setTimeout(()=> cacheDogSearchText(text.trim()), 500));
  };

  const handleClearSearch = () => {
    setSearchText('');
    resetDogSearch();
    cacheDogSearchText('');
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
            : <FontAwesomeIcon icon={ faTimes } size="sm" className="home-dog-search-bar__search-icon--times" onClick={handleClearSearch}/>}
          </div>
        </div>
        <SearchByMenu />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  searchText: state.dog.searchText,
});

export default connect(mapStateToProps, {cacheDogSearchText, searchDogs, resetDogSearch, })(SearchBar);
