import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import DogItem from './DogItem';
import Spinner from './Spinner';
import { setNumDogsToShow } from '../actions/dogActions';

const HomeDogCards = (props) => {
  const numDogsToAddWhenScrolling = 10;

  const {
    dogState: { dogMatches: dogs, numDogsToShow, loading },
    setNumDogsToShow,
  } = props;

  const observer = useRef();
  const lastDogElementRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (dogs && numDogsToShow >= dogs.length) return;
          if (
            dogs &&
            numDogsToShow + numDogsToAddWhenScrolling >= dogs.length
          ) {
            return setNumDogsToShow(dogs.length);
          }
          setNumDogsToShow(numDogsToShow + numDogsToAddWhenScrolling);
        }
      });
      if (node) observer.current.observe(node);
    },
    [setNumDogsToShow, numDogsToShow, dogs]
  );

  if (dogs === null || loading) {
    return (<Spinner/>);
  } else {
    const dogsToRender = dogs.slice(0, numDogsToShow);
    return (
      <div className="dog-cards-container">
        {dogs.length === 0 ? (
          <p>No matching dogs</p>
        ) : (
          <>
            {dogsToRender.map((dog, index) => {
              if (index === numDogsToShow - 1) {
                return (
                  <DogItem ref={lastDogElementRef} dog={dog} key={dog._id} />
                );
              }
              return <DogItem dog={dog} key={dog._id} />;
            })}
          </>
        )}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  dogState: state.dog,
});

export default connect(mapStateToProps, { setNumDogsToShow })(HomeDogCards);
