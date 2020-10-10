import React from 'react';

const Login = () => {
  return (
    <div>
    <a className="google-btn" href='/auth/google'>
      <div className="google-btn__icon-wrapper">
        <img className="google-btn__icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google 'G' Logo"/>
      </div>
      <div className="google-btn__text"><span>Sign in with Google</span>
      </div>
    </a>
    </div>
  )
}

export default Login;