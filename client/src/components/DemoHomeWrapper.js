import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Home from './pages/Home';
import InDemoModeMsg from './InDemoModeMsg';
import Spinner from './Spinner';
import { getDemoDogs } from '../actions/dogActions';
import { getDemoAllPeopleNames, getDemoFvaCoordinators } from '../actions/peopleActions';
import { getUser } from '../api/authAPI';
import { setCurrentUser } from '../actions/authActions';
import { setInDemoMode } from '../actions/demoActions';

const DemoHomeWrapper = ({ setInDemoMode, setCurrentUser, dogsStillLoading, getDemoDogs, getDemoAllPeopleNames, getDemoFvaCoordinators }) => {

  useEffect(() => {
    setInDemoMode(true);
    return () => setInDemoMode(false);
  }, [setInDemoMode])

  useEffect(() => {
    getUser().then((user) => {
      if (user !== undefined) {
        setCurrentUser(user);
      }
      getDemoDogs();
      getDemoAllPeopleNames();
      getDemoFvaCoordinators();
    });
  }, [setCurrentUser, getDemoDogs, getDemoAllPeopleNames, getDemoFvaCoordinators]);

  return (
    <div>
      {dogsStillLoading ? (
        <Spinner />
      ) : (
        <>
          <InDemoModeMsg />
          <Home />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  dogsStillLoading: state.dog.loading,
});

export default connect(mapStateToProps, {
  setInDemoMode,
  setCurrentUser,
  getDemoDogs,
  getDemoAllPeopleNames,
  getDemoFvaCoordinators,
})(DemoHomeWrapper);
