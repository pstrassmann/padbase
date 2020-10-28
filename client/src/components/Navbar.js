import React from 'react';
import { connect } from 'react-redux';
import { ReactComponent as PadBaseLogo } from '../images/padbase_full_logo_svg.svg';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ auth }) => {
  const location = useLocation();
  const history = useHistory();

  const handleRedirectHome = () => {
    history.push('/');
  }

  return (
    <nav className="navbar">
      <PadBaseLogo className="navbar__logo" onClick={handleRedirectHome}/>
      {auth.user.isAuthenticated ? (
        <a href="/auth/logout" className="navbar__logout">
          <div className="navbar__logout__text">Sign out</div>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      ) : (
        location.pathname !== '/login' && (
          <Link to="/login" className="navbar__logout">
            <div className="navbar__logout__text">Sign in</div>
            <FontAwesomeIcon icon={faSignInAlt} />
          </Link>
        )
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(Navbar);
