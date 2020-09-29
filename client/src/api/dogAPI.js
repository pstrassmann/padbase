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

export const saveDogGroup = async (dogGroup) => {
  try {
    const response = await fetch('/api/dogs/group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(dogGroup),
    });
    const insertedDogs = await response.json();
    if (insertedDogs.error) {
      console.error(insertedDogs.error);
    }
    return insertedDogs;
  } catch (err) {
    console.error(err);
  }
};

export const deleteDog = async (dogID) => {
  try {
    const response = await fetch('api/dogs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(dogID),
    });
    const deletedDog = await response.json();
    if (deletedDog.error) {
      console.error(deletedDog.error);
    }
    return deletedDog;
  } catch (err) {
    console.error(err);
  }
}
