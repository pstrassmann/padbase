import React, { useState } from 'react';
import { connect } from 'react-redux';
import { escapeRegExp, capitalizeWords } from '../../utils/text';

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

  const coordinatorsWithRole_fullNamesArray = coordinatorsWithRole.map((coordinator) => {
    const fullName = `${coordinator.firstName ? coordinator.firstName : ''} ${
      coordinator.lastName ? coordinator.lastName : ''
    }`;
    return fullName;
  });

  const handleInputChange = (e) => {
    const userInput = e.target.value;

    const regex = new RegExp('(\\b' + escapeRegExp(userInput) + ')', 'gi');

    const regexMatches = coordinatorsWithRole.filter((coordinator) => {
      const fullName = `${coordinator.firstName ? coordinator.firstName : ''} ${
        coordinator.lastName ? coordinator.lastName : ''
      }`;
      return fullName.match(regex) !== null && fullName.match(regex).length > 0;
    });

    setCoordinatorMatches(regexMatches);
    setCoordinatorState(capitalizeWords(userInput));
    setDropdownActive(true);
  };

  const handleInputFocus = (e) => {
    if (inEditMode) {
      e.target.select();
    }
  };

  const handleInputBlur = () => {
    if (inEditMode) {
      setDropdownActive(false);
      if (!coordinatorsWithRole_fullNamesArray.includes(coordinatorState)) {
        setCoordinatorState(coordinatorState_init);
      }
    }
  };

  const handleClickOption = (coordinator) => {
    setCoordinatorState(`${coordinator.firstName} ${coordinator.lastName}`);
    setDropdownActive(false);
  };

  const handleKeyDown = (e) => {

  }

  return (
    <div className="dog-item-body__personSelect">
      <input
        type="text"
        value={coordinatorState}
        className={inEditMode ? 'dog-item-body__displayText--editable' : 'dog-item-body__displayText'}
        readOnly={!inEditMode}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
      />
      <div
        className={
          dropdownActive
            ? 'dog-item-body__personSelect__dropdown--active'
            : 'dog-item-body__personSelect__dropdown'
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
