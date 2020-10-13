import React from 'react';
import { connect } from 'react-redux';

const Login = ({ unauthorizedEmail }) => {
  return (
    <div className="login-content">
      {unauthorizedEmail && (
        <div className="unauthorized-msg">
          <p>
            Sorry, <span className="unauthorized-msg__email">{unauthorizedEmail}</span> has not been authorized to use
            PadBase. If you think this is an error, please contact Patrick at The Animal Pad.
          </p>
        </div>
      )}
      <a className="google-btn" href="/auth/google">
        <div className="google-btn__icon-wrapper">
          <img
            className="google-btn__icon"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google 'G' Logo"
          />
        </div>
        <div className="google-btn__text">
          <span>Sign in with Google</span>
        </div>
      </a>
    </div>
  );
};

const mapStateToProps = (state) => ({
  unauthorizedEmail: state.auth.unauthorizedEmail,
});

export default connect(mapStateToProps, null)(Login);
