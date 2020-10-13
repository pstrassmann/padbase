export const getUser = async () => {
  try {
    const response = await fetch('/auth/user', {
      method: 'GET',
    });
    const user = await response.json();
    return user;
  } catch (err) {
    console.error(err);
  }
};