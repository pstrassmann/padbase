import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setIsAuthenticated, setCurrentUser } from '../actions/authActions';
import { Redirect } from 'react-router-dom';
import Home from './pages/Home';
import { getUser } from '../api/authAPI';
import Spinner from './Spinner';
import { getDogs } from '../actions/dogActions';
import { getAllPeopleNames, getFvaCoordinators } from '../actions/peopleActions';

const HomeWrapper = ({ auth, dogsStillLoading, setCurrentUser, setIsAuthenticated, getDogs, getAllPeopleNames, getFvaCoordinators }) => {

  useEffect(() => {
    getUser().then(
      (user) => {
        if (user !== undefined) {
          setCurrentUser(user);
          if (user.isAuthenticated === true) {
            getDogs();
            getAllPeopleNames();
            getFvaCoordinators();
          }
        }
      },
      (error) => setIsAuthenticated(false)
    );
  }, [getDogs, getAllPeopleNames, getFvaCoordinators, setCurrentUser, setIsAuthenticated]);

  return (
    <>
      { auth.loading || ( auth.user.isAuthenticated === true && dogsStillLoading)
        ? <Spinner />
        : (auth.user.isAuthenticated === true && !dogsStillLoading)
          ? <Home />
          : <Redirect to="/login" />
      }
    </>
    )
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  dogsStillLoading: state.dog.loading,
});

export default connect(mapStateToProps, { setCurrentUser, setIsAuthenticated, getDogs, getAllPeopleNames, getFvaCoordinators })(HomeWrapper);
