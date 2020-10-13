import { SET_IS_AUTHENTICATED, SET_UNAUTHORIZED_EMAIL } from './types';

export const setIsAuthenticated = (isAuthenticated) => (dispatch) => {
  dispatch({
    type: SET_IS_AUTHENTICATED,
    payload: isAuthenticated,
  })
}
export const setUnauthorizedEmail = (unauthorizedEmail) => (dispatch) => {
  dispatch({
    type: SET_UNAUTHORIZED_EMAIL,
    payload: unauthorizedEmail,
  })
}