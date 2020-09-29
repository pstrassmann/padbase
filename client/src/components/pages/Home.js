import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SearchBar from '../SearchBar';
import FilterMenu from '../FilterMenu';
import AddDogsMenu from '../AddDogsMenu';
import ActiveFilters from '../ActiveFilters';
import HomeDogCards from '../HomeDogCards';
import AddNewDogGroup from '../add-new/AddNewDogGroup';
import AddNewDogLitter from '../add-new/AddNewDogLitter';
import Spinner from '../Spinner';
import { getDogs } from '../../actions/dogActions';
import { getAllPeopleNames, getFvaCoordinators } from '../../actions/peopleActions';
import DogItem from '../DogItem';

const Home = ({ loading, isAddingNewDog, isAddingNewDogGroup, isAddingNewDogLitter, getDogs, getAllPeopleNames, getFvaCoordinators }) => {
  useEffect(() => {
    getDogs();
    getAllPeopleNames();
    getFvaCoordinators();
  }, [getDogs, getAllPeopleNames, getFvaCoordinators]);

  return (
    <div className="home-content-wrapper">
      {loading ? (
        <Spinner />
      ) : (
        <div className="home-content">
          <div className="home-content__header">
            <SearchBar />
            <FilterMenu />
            <AddDogsMenu />
          </div>
          <ActiveFilters/>
          { isAddingNewDogGroup && <AddNewDogGroup/> }
          { isAddingNewDogLitter && <AddNewDogLitter/> }
          { isAddingNewDog && <DogItem dog={ {newDog: true} } /> }
          <HomeDogCards />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.dog.loading,
  isAddingNewDog: state.dog.isAddingNewDog,
  isAddingNewDogGroup: state.dog.isAddingNewDogGroup,
  isAddingNewDogLitter: state.dog.isAddingNewDogLitter,
});

export default connect(mapStateToProps, { getDogs, getAllPeopleNames, getFvaCoordinators })(Home);
