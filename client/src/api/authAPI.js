export const getAuthStatus = async () => {
  try {
    const response = await fetch('/auth/isAuthenticated', {
      method: 'GET',
    });
    const authStatus = await response.json();
    console.log('AUTH STATUS: ', authStatus);
    return authStatus;
  } catch (err) {
    console.error(err);
  }
};