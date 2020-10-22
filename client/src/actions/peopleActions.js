import { GET_FVA_COORDINATORS, GET_ALL_PEOPLE_NAMES } from './types';

import demoPeopleData from '../demo/data/demoPeopleData';

export const getFvaCoordinators = () => async (dispatch) => {
  try {
    const response = await fetch('/api/people/fva-coordinators', {
      method: 'GET',
    });
    const coordinatorsJSON = await response.json();
    if (coordinatorsJSON.error) {
      console.error(coordinatorsJSON.error);
    } else {
      dispatch({
        type: GET_FVA_COORDINATORS,
        payload: coordinatorsJSON,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDemoFvaCoordinators = () => (dispatch) => {
  try {
    // Every person in the demo data has a coordinator role, so we return every person
    const coordinatorsJSON = demoPeopleData.map((person) => {
      return {
        _id: person._id,
        firstName: person.firstName,
        lastName: person.lastName,
        role: person.role,
      };
    });
    dispatch({
      type: GET_FVA_COORDINATORS,
      payload: coordinatorsJSON,
    });
  } catch (err) {
    console.error(err);
  }
};

export const getAllPeopleNames = () => async (dispatch) => {
  try {
    const response = await fetch('/api/people', {
      method: 'GET',
    });
    const peopleJSON = await response.json();
    if (peopleJSON.error) {
      console.error(peopleJSON.error);
    } else {
      dispatch({
        type: GET_ALL_PEOPLE_NAMES,
        payload: peopleJSON,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDemoAllPeopleNames = () => (dispatch) => {
  try {
    const peopleJSON = demoPeopleData.map((person) => {
      return {
        _id: person._id,
        firstName: person.firstName,
        lastName: person.lastName,
      };
    });
    dispatch({
      type: GET_ALL_PEOPLE_NAMES,
      payload: peopleJSON,
    });
  } catch (err) {
    console.error(err);
  }
};
