import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { removeDogFilter, clearAllDogFilters, searchDogs } from '../actions/dogActions';

const ActiveFilters = ({ filters, removeDogFilter, clearAllDogFilters, cachedDogSearchText, searchDogs }) => {
  const handleRemoveClick = (filter) => {
    removeDogFilter(filter);
    if (cachedDogSearchText !== '') {
      searchDogs(cachedDogSearchText);
    }
  }

  const handleClearAll = () => {
    clearAllDogFilters();
    if (cachedDogSearchText !== '') {
      searchDogs(cachedDogSearchText);
    }
  }

  if (filters.length === 0) return <></>;
  return (
    <div className="dog-filters-wrapper">
      <div className="dog-filters-pre-text">
        {`Filters (${filters.length}):`}
      </div>
      {filters.map((filter) => (
        <div key={filter} className="dog-active-filter">
          <FontAwesomeIcon icon={faTimesCircle} className="dog-active-filter__icon" onClick={ () => handleRemoveClick(filter)}/>
          {filter}
        </div>
      ))}
      <div className="dog-filter-clear-button" onClick={handleClearAll}>
        Clear all
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  filters: state.dog.filters,
  cachedDogSearchText: state.dog.cachedDogSearchText,
});

export default connect(mapStateToProps, { removeDogFilter, clearAllDogFilters, searchDogs, })(ActiveFilters);
