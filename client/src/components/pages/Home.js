import React from 'react';
import { connect } from 'react-redux';
import SearchBar from '../SearchBar';
import FilterMenu from '../FilterMenu';
import AddDogsMenu from '../AddDogsMenu';
import ActiveFilters from '../ActiveFilters';
import HomeDogCards from '../HomeDogCards';
import AddNewDogGroup from '../add-new/AddNewDogGroup';
import AddNewDogLitter from '../add-new/AddNewDogLitter';
import DogItem from '../DogItem';

const Home = ({isAddingNewDog, isAddingNewDogGroup, isAddingNewDogLitter, getDogs, getAllPeopleNames, getFvaCoordinators }) => {

  return (
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
  );
};

const mapStateToProps = (state) => ({
  isAddingNewDog: state.dog.isAddingNewDog,
  isAddingNewDogGroup: state.dog.isAddingNewDogGroup,
  isAddingNewDogLitter: state.dog.isAddingNewDogLitter,
});

export default connect(mapStateToProps, null)(Home);
