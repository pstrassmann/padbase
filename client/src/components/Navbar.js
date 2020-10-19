import React from 'react';
import { connect } from 'react-redux';
import {ReactComponent as PadBaseLogo} from '../images/padbase_svg.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ auth }) => {
  return (
    <nav className="navbar">
      <PadBaseLogo className="navbar__logo"/>
      {auth.user.isAuthenticated && (
        <a href="/auth/logout" className="navbar__logout">
          <div className="navbar__logout__text">Sign out</div>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(Navbar);
