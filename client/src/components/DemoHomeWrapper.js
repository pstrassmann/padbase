import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Home from './pages/Home';
import Spinner from './Spinner';
import { getDemoDogs } from '../actions/dogActions';
import { getDemoAllPeopleNames, getDemoFvaCoordinators } from '../actions/peopleActions';

const DemoHomeWrapper = ({ dogsStillLoading, getDemoDogs, getDemoAllPeopleNames, getDemoFvaCoordinators }) => {
  useEffect(() => {
    getDemoDogs();
    getDemoAllPeopleNames();
    getDemoFvaCoordinators();
  }, [getDemoDogs, getDemoAllPeopleNames, getDemoFvaCoordinators]);

  return <div>{dogsStillLoading ? <Spinner /> : <Home />}</div>;
};

const mapStateToProps = (state) => ({
  dogsStillLoading: state.dog.loading,
});

export default connect(mapStateToProps, {
  getDemoDogs,
  getDemoAllPeopleNames,
  getDemoFvaCoordinators,
})(DemoHomeWrapper);
