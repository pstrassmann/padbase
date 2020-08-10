import { GET_DOGS, SEARCH_DOGS, SET_LOADING, SET_SEARCH_BY_TYPE, RESET_DOGS } from '../actions/types';

// Escapes special characters from search
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

const initialState = {
  dogs: null,
  dogMatches: null,
  expandedDogCards: [],
  loading: true,
  searchByType: 'name',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DOGS:
      return {
        ...state,
        dogs: action.payload,
        dogMatches: action.payload,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case SET_SEARCH_BY_TYPE:
      return {
        ...state,
        searchByType: action.payload,
      }
    case SEARCH_DOGS:
      return {
        ...state,
        dogMatches: state.dogs.filter((dog) => {
          const regex = new RegExp(escapeRegExp(action.payload), 'gi');
          switch (state.searchByType) {
            case 'name':
              return dog.name.match(regex)
            case 'breed':
              return (dog.breed.length > 0 && dog.breed.some((e) => e.match(regex)))
            case 'foster':
              return (dog.currentFoster !== undefined && `${dog.currentFoster.firstName} ${dog.currentFoster.lastName}`.match(regex))
            case 'foster coordinator':
              return (dog.fosterCoordinator !== undefined && `${dog.fosterCoordinator.firstName} ${dog.fosterCoordinator.lastName}`.match(regex))
            case 'adoption coordinator':
              return (dog.adoptionCoordinator !== undefined && `${dog.adoptionCoordinator.firstName} ${dog.adoptionCoordinator.lastName}`.match(regex))
            case 'vetting coordinator':
              return (dog.vettingCoordinator !== undefined && `${dog.vettingCoordinator.firstName} ${dog.vettingCoordinator.lastName}`.match(regex))
            default:
              return true;
          }
        }),
      };
    case RESET_DOGS:
      return {
        ...state,
        dogMatches: state.dogs,
      }
    default:
      return state;
  }
};
