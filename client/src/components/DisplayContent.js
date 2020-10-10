import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setIsAuthenticated } from '../actions/authActions';
import {Redirect } from 'react-router-dom';
import Home from './pages/Home';
import { getAuthStatus } from '../api/authAPI';
import Spinner from './Spinner';

const DisplayContent = ({ auth, setIsAuthenticated }) => {

  useEffect(() => {
    getAuthStatus().then(
      (authStatus) => {
        if (authStatus !== undefined) {
          setIsAuthenticated(authStatus.isAuthenticated)
        }
      },
      (error) => setIsAuthenticated(false)
    );
  }, []);

  return (
    <div>
      { auth.loading
        ? <Spinner />
        : auth.isAuthenticated === true ? <Home /> : <Redirect to="/login" />
      }
    </div>
    )
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setIsAuthenticated })(DisplayContent);
