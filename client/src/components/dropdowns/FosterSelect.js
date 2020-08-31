import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHome, faPhone } from '@fortawesome/free-solid-svg-icons';
import {useTransition, animated} from 'react-spring';
import { capitalizeWords, escapeRegExp } from '../../utils/text';
import { getFosterContact, checkEmail } from '../../api/peopleAPI';
import { dateMask, formatDate, validatedDate } from '../../utils/dates';

const FosterSelect = ({
  fosterInfo,
  setFosterInfo,
  fosterInfo_init,
  initialDateWCurrentFoster,
  setInitialDateWCurrentFoster,
  initialDateWCurrentFoster_init,
  inEditMode,
  allPeople,
}) => {
  const [fosterMatches, setFosterMatches] = useState([]);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [isAddingNewFoster, setIsAddingNewFoster] = useState(false);
  const [newEmailIsUnique, setNewEmailIsUnique] = useState(false);
  const [emailAlertMsg, setEmailAlertMsg] = useState('');

  useEffect(()=> {
    if (!inEditMode) {
      setIsAddingNewFoster(false);
      setEmailAlertMsg('');
    }
  }, [inEditMode, setIsAddingNewFoster, setEmailAlertMsg])


  const errorSlide = useTransition((inEditMode && emailAlertMsg !== ''), null, {
    from: { transform: 'translateX(100%)', opacity: 0 },
    enter: {transform: 'translateX(0%)', opacity: 1 },
    leave: { transform: 'translateX(100%)', opacity: 0 },
  })

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
    setFosterInfo({ ...fosterInfo, fullName: capitalizeWords(userInput) });
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
        setFosterInfo(fosterInfo_init);
      }
    }
    setDropdownActive(false);
  };

  const handleSelectFoster = async (foster) => {
    const fosterContactInfo = await getFosterContact(foster._id);
    setFosterInfo({
      ...fosterInfo,
      fullName: `${fosterContactInfo.firstName ? fosterContactInfo.firstName : ''} ${
        fosterContactInfo.lastName ? fosterContactInfo.lastName : ''
      }`.trim(),
      phone: fosterContactInfo.phone || 'N/A',
      email: fosterContactInfo.email || 'N/A',
      address: fosterContactInfo.address || 'N/A',
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
    });
  };

  const handlePhoneInputChange = (e) => {
    setFosterInfo({ ...fosterInfo, phone: e.target.value });
  };

  const handleEmailInputChange = (e) => {
    const email = e.target.value;
    setFosterInfo({ ...fosterInfo, email: email });
    setNewEmailIsUnique(false);
    setEmailAlertMsg('');
  };

  const handleAddressInputChange = (e) => {
    setFosterInfo({ ...fosterInfo, address: e.target.value });
  };

  const handleCheckEmail = async (e) => {
    if (isAddingNewFoster && !newEmailIsUnique) {
      const emailValidation = await checkEmail(e.target.value);
      if (emailValidation === true) {
        return setNewEmailIsUnique(true);
      }
      if (emailValidation === false) {
        return setEmailAlertMsg('Email already registered');
      }
      if (emailValidation === 'invalid email') {
        return setEmailAlertMsg('Invalid email');
      }
    }
  };

  const handleValidateDate = (date, dateSetter) => {
    if (inEditMode) {
      const ISODate = validatedDate(date);
      if (ISODate === null) {
        return dateSetter('N/A');
      } else {
        dateSetter(formatDate(ISODate));
      }
    }
  };

  return (
    <>
      <div className="dog-item__fosterName dog-item__body-cell">
        <div className="dog-item__label">Foster Name</div>
        <div className="dog-item-body__personSelect">
          <input
            type="text"
            value={fosterInfo.fullName}
            className={inEditMode ? 'dog-item-body__displayText--editable' : 'dog-item-body__displayText'}
            readOnly={!inEditMode}
            onChange={handleNameInputChange}
            onFocus={handleNameInputFocus}
            onBlur={handleNameInputBlur}
            placeholder="Foster name..."
          />
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
        <div className='dog-item__fosterInfo__fosterDetails' style={{marginTop:'0.1rem'}}>
          <FontAwesomeIcon icon={faPhone} size="sm" className="dog-item__foster-icon" />
          <input
            type="text"
            value={fosterInfo.phone}
            className={isAddingNewFoster ? 'dog-item-body__displayText--editable' : 'dog-item-body__displayText'}
            readOnly={!isAddingNewFoster}
            onFocus={handleFosterInfoInputFocus}
            onChange={handlePhoneInputChange}
            placeholder="Foster phone #"
            style={{width: '70%'}}
          />
        </div>
        <div className='dog-item__fosterInfo__fosterDetails'>
          <FontAwesomeIcon icon={faEnvelope} size="sm" className="dog-item__foster-icon" />
          <input
            type="text"
            value={fosterInfo.email}
            className={isAddingNewFoster ? 'dog-item-body__displayText--editable' : 'dog-item-body__displayText'}
            readOnly={!isAddingNewFoster}
            onFocus={handleFosterInfoInputFocus}
            onChange={handleEmailInputChange}
            onBlur={handleCheckEmail}
            placeholder="Foster email"
            style={{width: '70%'}}
          />
          {errorSlide.map(({ item, key, props }) =>
            item && <animated.div key={key} style={props} className='dog-item__inputErrorMsg'><em>{emailAlertMsg}</em>️</animated.div>
          )}
        </div>
        {/*{inEditMode && (<animated.div style={errorSlide} className='dog-item__inputErrorMsg'><em>{emailAlertMsg}</em></animated.div>)}*/}
        <div className='dog-item__fosterInfo__fosterDetails'>
          <FontAwesomeIcon icon={faHome} size="sm" className="dog-item__foster-icon" />
          <input
            type="text"
            value={fosterInfo.address}
            className={isAddingNewFoster ? 'dog-item-body__displayText--editable' : 'dog-item-body__displayText'}
            readOnly={!isAddingNewFoster}
            onFocus={handleFosterInfoInputFocus}
            onChange={handleAddressInputChange}
            placeholder="Foster address"
          />
        </div>
      </div>
      <div className="dog-item__fosterDate dog-item__body-cell">
        <div className="dog-item__label">Initial Date w/ Foster</div>
        <input
          type="text"
          value={initialDateWCurrentFoster}
          className={inEditMode ? 'dog-item-body__displayText--editable' : 'dog-item-body__displayText'}
          style={{width: '80%'}}
          readOnly={!inEditMode}
          placeholder="MM-DD-YY"
          onChange={(e) => setInitialDateWCurrentFoster(dateMask(e.target.value))}
          onBlur={() => handleValidateDate(initialDateWCurrentFoster, setInitialDateWCurrentFoster)}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  allPeople: state.people.allPeople,
});

export default connect(mapStateToProps, null)(FosterSelect);
