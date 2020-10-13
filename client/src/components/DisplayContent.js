import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setIsAuthenticated, setUnauthorizedEmail } from '../actions/authActions';
import { Redirect } from 'react-router-dom';
import Home from './pages/Home';
import { getUser } from '../api/authAPI';
import Spinner from './Spinner';
import { getDogs } from '../actions/dogActions';
import { getAllPeopleNames, getFvaCoordinators } from '../actions/peopleActions';

const DisplayContent = ({ auth, dogsStillLoading, setIsAuthenticated, setUnauthorizedEmail, getDogs, getAllPeopleNames, getFvaCoordinators }) => {

  useEffect(() => {
    getUser().then(
      (user) => {
        if (user !== undefined) {
          setIsAuthenticated(user.isAuthenticated)
          setUnauthorizedEmail(user.unauthorizedEmail)
          if (user.isAuthenticated === true) {
            getDogs();
            getAllPeopleNames();
            getFvaCoordinators();
          }
        }
      },
      (error) => setIsAuthenticated(false)
    );
  }, [getDogs, getAllPeopleNames, getFvaCoordinators, setIsAuthenticated, setUnauthorizedEmail]);

  return (
    <div>
      { auth.loading || ( auth.isAuthenticated === true && dogsStillLoading)
        ? <Spinner />
        : (auth.isAuthenticated === true && !dogsStillLoading)
          ? <Home />
          : <Redirect to="/login" />
      }
    </div>
    )
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  dogsStillLoading: state.dog.loading,
});

export default connect(mapStateToProps, { setIsAuthenticated, setUnauthorizedEmail, getDogs, getAllPeopleNames, getFvaCoordinators })(DisplayContent);
