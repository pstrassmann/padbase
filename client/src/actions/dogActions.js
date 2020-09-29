import {
  GET_DOGS,
  SET_LOADING,
  SET_SEARCH_BY_TYPE,
  SEARCH_DOGS,
  RESET_DOGS,
  ADD_DOG_FILTER,
  REMOVE_DOG_FILTER,
  CLEAR_ALL_DOG_FILTERS,
  APPLY_DOG_FILTERS,
  CACHE_DOG_SEARCH_TEXT,
  SET_NUM_DOGS_TO_SHOW,
  UPDATE_DOG_IN_APP_STATE,
  SET_IS_ADDING_NEW_DOG,
  SET_IS_ADDING_NEW_DOG_GROUP,
  SET_IS_ADDING_NEW_DOG_LITTER,
  ADD_DOGS_TO_APP_STATE,
  DELETE_DOG, DELETE_DOG_IN_APP_STATE
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

export const setIsAddingNewDog = (isAddingNewDog) => (dispatch) => {
  dispatch({
    type: SET_IS_ADDING_NEW_DOG,
    payload: isAddingNewDog,
  })
}

export const setIsAddingNewDogGroup = (isAddingNewDogGroup) => (dispatch) => {
  dispatch({
    type: SET_IS_ADDING_NEW_DOG_GROUP,
    payload: isAddingNewDogGroup,
  })
}
export const setIsAddingNewDogLitter = (isAddingNewDogLitter) => (dispatch) => {
  dispatch({
    type: SET_IS_ADDING_NEW_DOG_LITTER,
    payload: isAddingNewDogLitter,
  })
}

export const updateDogInAppState = (updatedDog) => async (dispatch) => {
  dispatch({
    type: UPDATE_DOG_IN_APP_STATE,
    payload: updatedDog,
  });
};

export const deleteDogInAppState = (deletedDogID) => async (dispatch) => {
  dispatch({
    type: DELETE_DOG_IN_APP_STATE,
    payload: deletedDogID,
  });
};

export const addDogsToAppState = (newDogs) => async (dispatch) => {
  // newDogs: array of dog documents
  dispatch({
    type: ADD_DOGS_TO_APP_STATE,
    payload: newDogs,
  });
};


export const setLoading = (loadingBool) => (dispatch) => {
  dispatch({
    type: SET_LOADING,
    payload: loadingBool,
  });
};
export const setSearchByType = (searchByType) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_BY_TYPE,
    payload: searchByType,
  });
};

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

export const applyDogFilters = (dispatch) => {
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

export const setNumDogsToShow = (numDogsToShow) => (dispatch) => {
  dispatch({
    type: SET_NUM_DOGS_TO_SHOW,
    payload: numDogsToShow,
  });
};
