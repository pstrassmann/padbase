import React, { useState } from 'react';
import { connect } from 'react-redux';
import { escapeRegExp, capitalizeWords } from '../../utils/text';
import ConditionalTextInput from '../ConditionalTextInput';

const DogMomSelect = ({ state, setState, state_init, inEditMode, dogs }) => {
  const [dogMatches, setDogMatches] = useState([]);
  const [dropdownActive, setDropdownActive] = useState(false);

  const femaleDogs = dogs.filter((dog) => {
    return dog.sex === 'F';
  });

  const handleInputChange = (e) => {
    const userInput = e.target.value;

    const regex = new RegExp('(\\b' + escapeRegExp(userInput) + ')', 'gi');

    const regexMatches = femaleDogs.filter((dog) => {
      return dog.name.match(regex) !== null && dog.name.match(regex).length > 0;
    });

    setDogMatches(regexMatches);
    setState({
      _id: null,
      name: capitalizeWords(userInput),
    });
    setDropdownActive(true);
  };

  const handleInputFocus = (e) => {
    if (inEditMode) {
      e.target.select();
    }
  };

  const handleInputBlur = () => {
    setDropdownActive(false);
    if (state._id === null) {
      const exactMatches = femaleDogs.filter((dog) => {
        return state.name === dog.name;
      });
      if (exactMatches.length === 1) {
        setState({
          _id: exactMatches[0]._id,
          name: state.name,
        });
      } else {
        setState({ _id: null, name: null });
      }
    }
  };

  const handleClickOption = (dog) => {
    setState({
      _id: dog._id,
      name: dog.name,
    });
    setDropdownActive(false);
  };

  return (
    <div className="dog-item-body__personSelect">
      <ConditionalTextInput
        label="Mama name"
        labelClass="dog-item__label"
        placeholder="Search..."
        data={state.name || 'N/A'}
        inEditMode={inEditMode}
        editClass="dog-item-body__displayText--editable"
        noEditClass="dog-item-body__displayText"
        handleOnChange={handleInputChange}
        handleOnFocus={handleInputFocus}
        handleOnBlur={handleInputBlur}
      />

      <div
        className={
          dropdownActive ? 'dog-item-body__personSelect__dropdown--active' : 'dog-item-body__personSelect__dropdown'
        }
      >
        {dogMatches.length === 0 ? (
          <div className="dog-item-body__personSelect__dropdown__noMatches">No Matches</div>
        ) : (
          dogMatches.map((dog) => (
            <div
              className="dog-item-body__personSelect__dropdown__option"
              key={dog._id}
              onMouseDown={() => handleClickOption(dog)}
            >
              {dog.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dogs: state.dog.dogs,
});

export default connect(mapStateToProps, null)(DogMomSelect);
