import moment from 'moment';

import {
  GET_DOGS,
  CACHE_DOG_SEARCH_TEXT,
  SEARCH_DOGS,
  SET_LOADING,
  SET_SEARCH_BY_TYPE,
  RESET_DOGS,
  ADD_DOG_FILTER,
  REMOVE_DOG_FILTER,
  CLEAR_ALL_DOG_FILTERS,
  APPLY_DOG_FILTERS,
} from '../actions/types';

// Escapes special characters from search
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

const initialState = {
  dogs: null,
  dogMatches: null,
  filteredDogs: null,
  loading: true,
  searchByType: 'dog name',
  cachedDogSearchText: '',
  filters: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DOGS:
      return {
        ...state,
        dogs: action.payload,
        filteredDogs: action.payload,
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
    case CACHE_DOG_SEARCH_TEXT:
      return {
        ...state,
        cachedDogSearchText: action.payload,
      }
    case SEARCH_DOGS:
      return {
        ...state,
        dogMatches: state.filteredDogs.filter((dog) => {
          const regex = new RegExp(escapeRegExp(action.payload), 'gi');
          switch (state.searchByType) {
            case 'dog name':
              return dog.name.match(regex)
            case 'parent name':
              return (
                dog.parents.length > 0 && dog.parents.some(e => e.name.match(regex))
              )
            case 'group name':
              return (dog.group !== undefined && dog.group.match(regex));
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
        dogMatches: state.filteredDogs,
      }
    case ADD_DOG_FILTER:
      if (state.filters.includes(action.payload)) {
        return state;
      } else return {
        ...state,
        filters: [...state.filters, action.payload],
      }
    case REMOVE_DOG_FILTER:
        return {
        ...state,
        filters: state.filters.filter(e => e !== action.payload),
      }
    case CLEAR_ALL_DOG_FILTERS:
        return {
        ...state,
        filters: [],
      }
    case APPLY_DOG_FILTERS:
      let tempFilteredDogs = state.dogs;
      state.filters.forEach((filter) => {
        switch (filter) {
          case 'Sex: Male':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return dog.sex === 'M';
            })
            break;
          case 'Sex: Female':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return dog.sex === 'F';
            })
            break;
          case 'Spay/Neuter: True':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (dog.isFixed !== undefined && dog.isFixed === true);
            })
            break;
          case 'Spay/Neuter: False':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (dog.isFixed === undefined || dog.isFixed === false);
            })
            break;
          case 'Vetting Status: Incomplete':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (dog.vettingStatus.length === 0 || dog.vettingStatus.includes('incomplete'));
            })
            break;
          case 'Vetting Status: Complete':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (dog.vettingStatus.length > 0 && dog.vettingStatus.includes('complete'));
            })
            break;
          case 'Vetting Status: Pending Records':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (dog.vettingStatus.length > 0 && dog.vettingStatus.includes('pending records'));
            })
            break;
          case 'Needs Rabies Vaccine':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (dog.vettingDates === undefined || dog.vettingDates.rabies === undefined || moment(dog.vettingDates.rabies).isAfter(Date.now()));
            })
            break;
          case 'Adult Dog: Cleared for Adoption':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (
                dog.vettingDates !== undefined &&
                dog.vettingDates.dhpp1 !== undefined &&
                dog.vettingDates.rabies !== undefined &&
                dog.birthday !== undefined &&
                moment(Date.now()).diff(dog.birthday, 'months') >= 4 &&
                (dog.status.length === 0 || !dog.status.includes('on hold - all')) &&
                (dog.status.length === 0 || !dog.status.includes('adopted')) &&
                (dog.status.length === 0 || !dog.status.includes('fta')) &&
                (dog.status.length === 0 || (dog.status.includes('fostered')) || dog.status.includes('intake'))
              )
            })
            break;
          case 'Puppy: Cleared for Adoption':
            tempFilteredDogs = tempFilteredDogs.filter((dog) => {
              return (
                dog.vettingDates !== undefined &&
                dog.vettingDates.dhpp1 !== undefined &&
                dog.birthday !== undefined &&
                moment(Date.now()).diff(dog.birthday, 'months') < 4 &&
                (dog.status.length === 0 || !dog.status.includes('on hold - all')) &&
                (dog.status.length === 0 || !dog.status.includes('adopted')) &&
                (dog.status.length === 0 || !dog.status.includes('fta')) &&
                (dog.status.length === 0 || (dog.status.includes('fostered')) || dog.status.includes('intake'))
              )
            })
            break;
        }
      })
        return {
        ...state,
        filteredDogs: tempFilteredDogs,
        dogMatches: tempFilteredDogs,
      }
    default:
      return state;
  }
};
