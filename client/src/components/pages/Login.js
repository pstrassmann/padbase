import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {ReactComponent as GoogleGLogo} from '../../images/google_g_logo.svg';
import {ReactComponent as PadBaseIcon} from '../../images/padbase_p_logo.svg';
import { getUser } from '../../api/authAPI';
import { setCurrentUser } from '../../actions/authActions';

const Login = ({ auth, setCurrentUser }) => {

  useEffect(() => {
      getUser().then((user) => {
        if (user !== undefined) {
          setCurrentUser(user);
        }
      });
  }, [setCurrentUser]);

  if (auth.loading) return (<></>);

  if (auth.user.isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <div className="login-content">
          <div className="login-msg">
        {auth.user.unauthorizedEmail ? (
            <p>
              Sorry, <span className="login-msg__unauthorizedEmail">{auth.user.unauthorizedEmail}</span> has not been
              authorized to use PadBase. If you think this is an error, please contact Patrick at The Animal Pad.
            </p>
        ) : (
          <p>
            Sign in with your The Animal Pad gmail address to access PadBase.
          </p>
        )}
          </div>
        <a className="google-btn" href="/auth/google">
          <div className="google-btn__icon-wrapper">
            <GoogleGLogo
              className="google-btn__icon"
              alt="Google 'G' Logo"
            />
          </div>
          <div className="google-btn__text">
            <span>Sign in with Google</span>
          </div>
        </a>
        <p>or</p>
        <a className="demo-btn" href="/demo">
          <div className="demo-btn__icon-wrapper">
            <PadBaseIcon
              className="demo-btn__icon"
              alt="PadBase Logo"
            />
          </div>
          <div className="demo-btn__text">
            <span>View in Demo Mode</span>
          </div>
        </a>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { setCurrentUser })(Login);
