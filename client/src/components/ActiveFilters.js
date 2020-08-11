import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { removeDogFilter, clearAllDogFilters } from '../actions/dogActions';

const ActiveFilters = ({ filters, removeDogFilter, clearAllDogFilters }) => {
  const handleRemoveClick = (filter) => {
    removeDogFilter(filter);
  }

  const handleClearAll = () => {
    clearAllDogFilters();
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
});

export default connect(mapStateToProps, { removeDogFilter, clearAllDogFilters })(ActiveFilters);
