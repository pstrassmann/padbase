import {
  GET_FVA_COORDINATORS,
  GET_ALL_PEOPLE_NAMES,
} from '../actions/types';

const initialState = {
  fvaCoordinators: null,
  allPeople: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PEOPLE_NAMES:
      return {
        ...state,
        allPeople: action.payload,
      };
    case GET_FVA_COORDINATORS:
      return {
        ...state,
        fvaCoordinators: action.payload,
      };
    default:
      return state;
  }
}