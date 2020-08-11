import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SearchBar from '../SearchBar';
import FilterMenu from '../FilterMenu';
import ActiveFilters from '../ActiveFilters';
import HomeDogCards from '../HomeDogCards';
import Spinner from '../Spinner';
import { getDogs } from '../../actions/dogActions';

const Home = ({ loading, getDogs }) => {
  useEffect(() => {
    getDogs();
  }, []);

  return (
    <div className="home-content-wrapper">
      {loading ? (
        <Spinner />
      ) : (
        <div className="home-content">
          <div className="home-content__header">
            <SearchBar />
            <FilterMenu />
          </div>
          <ActiveFilters/>
          <HomeDogCards />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.dog.loading,
});

export default connect(mapStateToProps, { getDogs })(Home);
