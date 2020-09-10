export const saveDog = async (dogItem) => {
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
