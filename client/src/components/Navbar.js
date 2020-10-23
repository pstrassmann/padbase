import React from 'react';
import { connect } from 'react-redux';
import { ReactComponent as PadBaseLogo } from '../images/padbase_full_logo_svg.svg';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ auth }) => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <PadBaseLogo className="navbar__logo" />
      {auth.user.isAuthenticated ? (
        <a href="/auth/logout" className="navbar__logout">
          <div className="navbar__logout__text">Sign out</div>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      ) : (
        location.pathname !== '/login' && (
          <a href="/login" className="navbar__logout">
            <div className="navbar__logout__text">Sign in</div>
            <FontAwesomeIcon icon={faSignInAlt} />
          </a>
        )
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(Navbar);
