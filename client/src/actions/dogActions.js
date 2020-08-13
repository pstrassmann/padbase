import {
  GET_DOGS,
  SET_LOADING,
  SET_SEARCH_BY_TYPE,
  SEARCH_DOGS,
  RESET_DOGS,
  ADD_DOG_FILTER,
  REMOVE_DOG_FILTER,
  CLEAR_ALL_DOG_FILTERS,
  APPLY_DOG_FILTERS, CACHE_DOG_SEARCH_TEXT
} from './types';

export const getDogs = () => async (dispatch) => {
  try {
    const response = await fetch('/api/dogs', {
      method: 'GET',
    });
    const dogsJSON = await response.json();
    if (dogsJSON.error) {
      console.error(dogsJSON.error);
    } else {
      dispatch({
        type: GET_DOGS,
        payload: dogsJSON,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const setLoading = (loadingBool) => (dispatch) => {
  dispatch({
    type: SET_LOADING,
    payload: loadingBool,
  })
}
export const setSearchByType = (searchByType) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_BY_TYPE,
    payload: searchByType,
  })
}

export const cacheDogSearchText = (text) => (dispatch) => {
  dispatch({
    type: CACHE_DOG_SEARCH_TEXT,
    payload: text,
  });
};

export const searchDogs = (text) => (dispatch) => {
  dispatch({
    type: SEARCH_DOGS,
    payload: text,
  });
};

export const resetDogSearch = () => (dispatch) => {
  dispatch({
    type: RESET_DOGS,
  });
};

export const applyDogFilters = (dispatch) =>  {
  dispatch({
    type: APPLY_DOG_FILTERS,
  });
};

export const addDogFilter = (filter) => (dispatch) => {
  dispatch({
    type: ADD_DOG_FILTER,
    payload: filter,
  });
  applyDogFilters(dispatch);
};

export const removeDogFilter = (filter) => (dispatch) => {
  dispatch({
    type: REMOVE_DOG_FILTER,
    payload: filter,
  });
  applyDogFilters(dispatch);
};

export const clearAllDogFilters = () => (dispatch) => {
  dispatch({
    type: CLEAR_ALL_DOG_FILTERS,
  });
  applyDogFilters(dispatch);

};
