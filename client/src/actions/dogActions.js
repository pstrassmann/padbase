import { GET_DOGS } from './types';

export const getDogs = () => async (dispatch) => {
  try {
    const response = await fetch('/api/dogs', {
      method: 'GET',
    })
    const dogsJSON = await response.json();
    if (dogsJSON.error) {
      console.error(dogsJSON.error);
    } else {
      // console.log('dispatching');
      console.log(dogsJSON);
      dispatch({
        type: GET_DOGS,
        payload: dogsJSON,
      })
    }
  } catch (err) {
    console.error(err);
  }
}