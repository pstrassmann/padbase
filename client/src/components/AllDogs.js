import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DogItem from './DogItem';
import { getDogs } from '../actions/dogActions';

const AllDogs = (props) => {
  const {
    dogState: { dogs },
    getDogs,
  } = props;

  useEffect(() => {
    getDogs();
  }, []);

  const loading = <p>Loading...</p>;

  if (dogs === null) {
    return loading;
  } else {
    return (
      <div className="dog-data-wrapper">
        {dogs.length === 0 ? (
          <p>No matching dogs</p>
        ) : (
          <div className="dog-data-container">
            {dogs.map((dog) => (
              <DogItem dog={dog} key={dog._id} />
            ))}
          </div>
        )}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  dogState: state.dog,
});

export default connect(mapStateToProps, { getDogs })(AllDogs);
