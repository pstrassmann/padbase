import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const ConditionalTextArea = ({
  label,
  labelClass,
  placeholder = '',
  data,
  inEditMode,
  editClass,
  noEditClass,
  handleOnChange,
}) => {
  return (
    <label style={{ display: 'flex', width: '100%', cursor: 'text' }}>
      <span className={labelClass}>{label}</span>
      {inEditMode ? (
          <TextareaAutosize
            style={{ resize: 'none'}}
            value={data === 'N/A' ? '' : data}
            className={editClass}
            onChange={handleOnChange}
            placeholder={placeholder}
          />
      ) : (
        <div className={noEditClass} style={{ whiteSpace: 'pre-wrap'}}>{data}</div>
      )}
    </label>
  );
};

export default ConditionalTextArea;
