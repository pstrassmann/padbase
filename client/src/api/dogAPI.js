export const updateDog = async (dogItem) => {
  try {
    const response = await fetch('/api/dogs', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(dogItem),
    });
    const updatedDog = await response.json();
    if (updatedDog.error) {
      console.error(updatedDog.error);
    }
    return updatedDog;
  } catch (err) {
    console.error(err);
  }
};

export const saveNewDog = async (dogItem) => {
  try {
    const response = await fetch('/api/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(dogItem),
    });
    const newDog = await response.json();
    if (newDog.error) {
      console.error(newDog.error);
    }
    return newDog;
  } catch (err) {
    console.error(err);
  }
};
