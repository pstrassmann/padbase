import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHome, faPhone, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';
import { capitalizeWords, escapeRegExp } from '../../utils/text';
import { getFosterContact, checkEmail, getDemoFosterContact, checkDemoEmail } from '../../api/peopleAPI';
import { dateMask, formatDate, validatedDate } from '../../utils/dates';
import ConditionalTextInput from '../ConditionalTextInput';

const FosterSelect = ({
  fosterInfo,
  setFosterInfo,
  fosterInfo_init,
  initialDateWCurrentFoster,
  setInitialDateWCurrentFoster,
  initialDateWCurrentFoster_init,
  inEditMode,
  allPeople,
  inDemoMode,
}) => {
  const [fosterMatches, setFosterMatches] = useState([]);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [isAddingNewFoster, setIsAddingNewFoster] = useState(false);
  const [newEmailIsUnique, setNewEmailIsUnique] = useState(false);
  const [emailAlertMsg, setEmailAlertMsg] = useState('');
  const [showEmailAlertMsg, setShowEmailAlertMsg] = useState(false);

  useEffect(() => {
    if (!inEditMode) {
      setIsAddingNewFoster(false);
      setEmailAlertMsg('');
    }
  }, [inEditMode, setIsAddingNewFoster, setEmailAlertMsg]);

  const emailErrorSpring = useSpring({
    from: { transform: 'translateX(100%)', opacity: 0 },
    transform: isAddingNewFoster && showEmailAlertMsg ? 'translateX(0%)' : 'translateX(100%)',
    opacity: isAddingNewFoster && showEmailAlertMsg ? 1 : 0,
  });

  const fosterAddOrCancelSpring = useSpring({
    transform: isAddingNewFoster ? 'rotateZ(45deg) translateX(2px)' : 'rotateZ(0deg) translateX(0px)',
  });

  const handleNameInputFocus = (e) => {
    if (inEditMode) {
      e.target.select();
    }
  };
  const handleFosterInfoInputFocus = (e) => {
    if (isAddingNewFoster) {
      e.target.select();
    }
  };

  const handleNameInputChange = (e) => {
    const userInput = e.target.value;
    const regex = new RegExp('(\\b' + escapeRegExp(userInput) + ')', 'gi');
    const regexMatches = allPeople.filter((person) => {
      const fullName = `${person.firstName ? person.firstName : ''} ${person.lastName ? person.lastName : ''}`.trim();
      return fullName.match(regex) !== null && fullName.match(regex).length > 0;
    });
    setFosterMatches(regexMatches);
    setFosterInfo({ ...fosterInfo, fullName: capitalizeWords(userInput), firstName: null, lastName: null });
    if (!isAddingNewFoster) {
      setDropdownActive(true);
    }
  };

  const handleNameInputBlur = () => {
    if (inEditMode && !isAddingNewFoster) {
      const matches = allPeople.filter((person) => {
        const fullName = `${person.firstName ? person.firstName : ''} ${person.lastName ? person.lastName : ''}`.trim();
        const match = fullName.match(fosterInfo.fullName);
        return match !== null && match.length === 1 && match[0] === fullName;
      });
      if (matches.length === 1) {
        handleSelectFoster(matches[0]);
      } else {
        const nullFoster = Object.fromEntries(Object.entries(fosterInfo).map(([key, value]) => [key, null]));
        setFosterInfo(nullFoster);
      }
    }
    setDropdownActive(false);
  };

  const handleSelectFoster = async (foster) => {
    const fosterContactInfo = inDemoMode
      ? getDemoFosterContact(foster._id)
      : await getFosterContact(foster._id);
    setFosterInfo({
      ...fosterInfo,
      _id: fosterContactInfo._id,
      fullName: `${fosterContactInfo.firstName ? fosterContactInfo.firstName : ''} ${
        fosterContactInfo.lastName ? fosterContactInfo.lastName : ''
      }`.trim(),
      firstName: `${fosterContactInfo.firstName ? fosterContactInfo.firstName : null}`,
      lastName: `${fosterContactInfo.lastName ? fosterContactInfo.lastName : null}`,
      phone: fosterContactInfo.phone || null,
      email: fosterContactInfo.email || null,
      address: fosterContactInfo.address || null,
      newFoster: false,
    });
    setDropdownActive(false);
  };

  const handleAddNewFosterClick = () => {
    setDropdownActive(false);
    setIsAddingNewFoster(true);
    setFosterInfo({
      ...fosterInfo,
      _id: null,
      phone: '',
      email: '',
      address: '',
      newFoster: true,
    });
  };

  const handleCancelAddNewFosterClick = () => {
    const nullFoster = Object.fromEntries(Object.entries(fosterInfo).map(([key, value]) => [key, null]));
    setFosterInfo(nullFoster);
    setIsAddingNewFoster(false);
  };

  const handlePhoneInputChange = (e) => {
    setFosterInfo({ ...fosterInfo, phone: e.target.value });
  };

  const handleEmailInputChange = (e) => {
    setShowEmailAlertMsg(false);
    const email = e.target.value;
    setFosterInfo({ ...fosterInfo, email: email });
    setNewEmailIsUnique(false);
  };

  const handleAddressInputChange = (e) => {
    setFosterInfo({ ...fosterInfo, address: e.target.value });
  };

  const handleCheckEmail = async (e) => {
    if (isAddingNewFoster && !newEmailIsUnique) {
      const emailValidation = inDemoMode
        ? checkDemoEmail(e.target.value)
        : await checkEmail(e.target.value);
      if (emailValidation === true) {
        return setNewEmailIsUnique(true);
      }
      if (emailValidation === false) {
        setEmailAlertMsg('Email already registered');
        return setShowEmailAlertMsg(true);
      }
      if (emailValidation === 'invalid email') {
        setEmailAlertMsg('Invalid email');
        return setShowEmailAlertMsg(true);
      }
    }
  };

  const handleValidateDate = (date, dateSetter) => {
    if (inEditMode) {
      const ISODate = validatedDate(date);
      if (ISODate === null) {
        return dateSetter(null);
      } else {
        dateSetter(formatDate(ISODate));
      }
    }
  };

  const handleFosterAddOrCancelIconClick = () => {
    if (inEditMode) {
      isAddingNewFoster ? handleCancelAddNewFosterClick() : handleAddNewFosterClick();
    }
  };

  return (
    <>
      <div className="dog-item__fosterName dog-item__body-cell">
        <div className="dog-item-body__personSelect">
          <label className="dog-item__label">Foster Name</label>
          <div className="dog-item-body__personSelect__fosterName">
            {
              <animated.div style={fosterAddOrCancelSpring}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={
                    inEditMode && !fosterInfo.fullName
                      ? 'dog-item__foster-add-or-cancel-icon'
                      : 'dog-item__foster-add-or-cancel-icon noVis'
                  }
                  onClick={handleFosterAddOrCancelIconClick}
                />
              </animated.div>
            }
            <ConditionalTextInput
              placeholder={isAddingNewFoster ? 'Foster name (required)...' : 'Search or add foster...'}
              data={fosterInfo.fullName || 'N/A'}
              inEditMode={inEditMode}
              editClass={
                isAddingNewFoster && !fosterInfo.fullName
                  ? 'plc-hold-red dog-item-body__displayText--editable'
                  : 'dog-item-body__displayText--editable'
              }
              noEditClass="dog-item-body__displayText"
              handleOnChange={handleNameInputChange}
              handleOnFocus={handleNameInputFocus}
              handleOnBlur={handleNameInputBlur}
            />
          </div>
          <div
            className={
              dropdownActive ? 'dog-item-body__personSelect__dropdown--active' : 'dog-item-body__personSelect__dropdown'
            }
          >
            <div className="dog-item-body__personSelect__dropdown__addNew" onMouseDown={handleAddNewFosterClick}>
              <em>+ Add new foster</em>
            </div>
            {fosterMatches.length === 0 ? (
              <div className="dog-item-body__personSelect__dropdown__noMatches">No Matches</div>
            ) : (
              fosterMatches.map((foster) => (
                <div
                  className="dog-item-body__personSelect__dropdown__option"
                  key={foster._id}
                  onMouseDown={() => handleSelectFoster(foster)}
                >
                  {`${foster.firstName} ${foster.lastName}`}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="dog-item__fosterInfo">
        <div className="dog-item__fosterInfo__fosterDetails" style={{ marginTop: '0.1rem' }}>
          <FontAwesomeIcon icon={faPhone} size="sm" className="dog-item__foster-icon" fixedWidth />
          <ConditionalTextInput
            placeholder="Foster phone..."
            data={fosterInfo.phone || 'N/A'}
            inEditMode={isAddingNewFoster}
            editClass="dog-item-body__displayText--editable w70"
            noEditClass="dog-item-body__displayText"
            handleOnChange={handlePhoneInputChange}
            handleOnFocus={handleFosterInfoInputFocus}
          />
        </div>
        <div className="dog-item__fosterInfo__fosterDetails">
          <FontAwesomeIcon icon={faEnvelope} size="sm" className="dog-item__foster-icon" fixedWidth />
          <ConditionalTextInput
            placeholder="Foster email (required)..."
            data={fosterInfo.email || 'N/A'}
            inEditMode={isAddingNewFoster}
            editClass={
              !fosterInfo.email
                ? 'plc-hold-red dog-item-body__displayText--editable w70'
                : 'dog-item-body__displayText--editable w70'
            }
            noEditClass="dog-item-body__displayText"
            handleOnChange={handleEmailInputChange}
            handleOnFocus={handleFosterInfoInputFocus}
            handleOnBlur={handleCheckEmail}
          />
          {inEditMode && emailAlertMsg !== '' && (
            <animated.div style={emailErrorSpring} className="dog-item__inputErrorMsg">
              {emailAlertMsg}
            </animated.div>
          )}
        </div>
        <div className="dog-item__fosterInfo__fosterDetails">
          <FontAwesomeIcon icon={faHome} size="sm" className="dog-item__foster-icon" fixedWidth />
          <ConditionalTextInput
            placeholder="Foster address..."
            data={fosterInfo.address || 'N/A'}
            inEditMode={isAddingNewFoster}
            editClass="dog-item-body__displayText--editable"
            noEditClass="dog-item-body__displayText"
            handleOnChange={handleAddressInputChange}
            handleOnFocus={handleFosterInfoInputFocus}
          />
        </div>
      </div>
      <div className="dog-item__fosterDate dog-item__body-cell">
        <ConditionalTextInput
          label="Initial Date w/ Foster"
          labelClass="dog-item__label"
          placeholder="MM-DD-YY"
          data={
            inEditMode
              ? initialDateWCurrentFoster === null
                ? ''
                : initialDateWCurrentFoster
              : initialDateWCurrentFoster || 'N/A'
          }
          inEditMode={inEditMode}
          editClass="dog-item-body__displayText--editable w80"
          noEditClass="dog-item-body__displayText"
          handleOnChange={(e) => setInitialDateWCurrentFoster(dateMask(e.target.value))}
          handleOnBlur={() => handleValidateDate(initialDateWCurrentFoster, setInitialDateWCurrentFoster)}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  allPeople: state.people.allPeople,
  inDemoMode: state.demo.inDemoMode,
});

export default connect(mapStateToProps, null)(FosterSelect);
