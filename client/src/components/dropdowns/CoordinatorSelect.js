import React, { useState } from 'react';
import { connect } from 'react-redux';
import { escapeRegExp, capitalizeWords } from '../../utils/text';
import ConditionalTextInput from '../ConditionalTextInput';

const CoordinatorSelect = ({
  role,
  coordinatorState,
  setCoordinatorState,
  coordinatorState_init,
  inEditMode,
  fvaCoordinators,
}) => {
  const [coordinatorMatches, setCoordinatorMatches] = useState([]);
  const [dropdownActive, setDropdownActive] = useState(false);

  const coordinatorsWithRole = fvaCoordinators.filter((coordinator) => {
    return coordinator.role.length > 0 && coordinator.role.includes(role);
  });


  const handleInputChange = (e) => {
    const userInput = e.target.value;

    const regex = new RegExp('(\\b' + escapeRegExp(userInput) + ')', 'gi');

    const regexMatches = coordinatorsWithRole.filter((coordinator) => {
      const fullName = `${coordinator.firstName ? coordinator.firstName : ''} ${
        coordinator.lastName ? coordinator.lastName : ''
      }`.trim();
      return fullName.match(regex) !== null && fullName.match(regex).length > 0;
    });

    setCoordinatorMatches(regexMatches);
    setCoordinatorState({ fullName: capitalizeWords(userInput), _id: null });
    setDropdownActive(true);
  };

  const handleInputFocus = (e) => {
      if (e.target.value === '') {
        handleInputChange(e);
      } else {
        e.target.select();
      }
  };

  // If coordinator state has an _id of null, check for an exact match between typed name
  // and coordinator names. If there is only one exact match, set the _id of
  // that match to the coordinator state along with the matching fullName.
  const handleInputBlur = () => {
    setDropdownActive(false);
    if (coordinatorState._id === null) {
      const exactMatches = coordinatorsWithRole.filter((coordinator) => {
        const fullName = `${coordinator.firstName ? coordinator.firstName : ''} ${
          coordinator.lastName ? coordinator.lastName : ''
        }`.trim();
        return coordinatorState.fullName === fullName;
      });
      if (exactMatches.length === 1) {
        setCoordinatorState({
          fullName: coordinatorState.fullName,
          _id: exactMatches[0]._id,
        });
      } else {
        setCoordinatorState({fullName: null, _id: null});
      }
    }
  };

  const handleClickOption = (coordinator) => {
    setCoordinatorState({
      fullName: `${coordinator.firstName} ${coordinator.lastName}`,
      _id: coordinator._id,
    });
    setDropdownActive(false);
  };

  return (
    <div className="dog-item-body__personSelect">
      <ConditionalTextInput
        label={role}
        labelClass="dog-item__label"
        placeholder="Search..."
        data={coordinatorState.fullName || 'N/A'}
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
        {coordinatorMatches.length === 0 ? (
          <div className="dog-item-body__personSelect__dropdown__noMatches">No Matches</div>
        ) : (
          coordinatorMatches.map((coordinator) => (
            <div
              className="dog-item-body__personSelect__dropdown__option"
              key={coordinator._id}
              onMouseDown={() => handleClickOption(coordinator)}
            >
              {`${coordinator.firstName} ${coordinator.lastName}`}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  fvaCoordinators: state.people.fvaCoordinators,
});

export default connect(mapStateToProps, null)(CoordinatorSelect);
