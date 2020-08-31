export const searchCoordinators = async (role, searchStr) => {
  try {
    const response = await fetch('/api/people/search', {
      method: 'GET',
      headers: {
        role: role,
        search_str: searchStr,
      }
    });
    const coordinatorsJSON = await response.json();
    if (coordinatorsJSON.error) {
      console.error(coordinatorsJSON.error);
    } else {
      return coordinatorsJSON;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getFosterContact = async (_id) => {
  try {
    const response = await fetch('/api/people/contact', {
      method: 'GET',
      headers: {
        _id: _id,
      }
    });
    const contactJSON = await response.json();
    if (contactJSON.error) {
      console.error(contactJSON.error);
    } else {
      return contactJSON;
    }
  } catch (err) {
    console.error(err);
  }
};

// Check if email is invalid, unique, or not unique
// returning 'invalid', true, false respectively
export const checkEmail = async (email) => {
  try {
    const response = await fetch('/api/people/email', {
      method: 'GET',
      headers: {
        email: email.toLowerCase(),
      }
    });
    const emailCheckJSON = await response.json();
    if (emailCheckJSON.error) {
      console.error(emailCheckJSON.error);
    } else {
      return emailCheckJSON;
    }
  } catch (err) {
    console.error(err);
  }
};