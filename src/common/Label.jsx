import React from 'react';

const Label = ({ label, onRemove }) => {
  return (
    <>
      {label && (
        <span
        className="badge bg-primary d-inline-flex align-items-center"
        style={{
          borderRadius: "10rem",
          padding: "0.35em 0.75em",
          fontSize: "0.85em",
        }}
        >
          {label}
          {onRemove &&
            <button
              type="button"
              className="btn-close btn-close-white btn-sm ms-2"
              aria-label="Remove"
              onClick={(event) => onRemove(event, label)}
              style={{ cursor: "pointer" }}
            />
          }
        </span>
      )}
    </>
  );
};

export default Label;
