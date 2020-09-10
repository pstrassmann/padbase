import React from 'react';

const ConditionalTextInput = ({
  label,
  labelClass,
  placeholder="",
  data,
  inEditMode,
  editClass,
  noEditClass,
  handleOnChange,
  handleOnFocus,
  handleOnBlur,
}) => {
  return (
    <label style={{display: 'flex', width: '100%', cursor: 'text'}}>
      <span className={ labelClass }>{label}</span>
      {inEditMode ? (
        <input
          type="text"
          placeholder={placeholder}
          value={(data === null || data === 'N/A')  ? '' : data}
          className={editClass}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      ) : (
        <div className={noEditClass}>{data}</div>
      )}
    </label>
  );
};

export default ConditionalTextInput;
