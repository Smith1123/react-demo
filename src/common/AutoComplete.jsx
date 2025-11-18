import React, { useState, useRef, useEffect } from "react";

import Label from "./Label";

const AutoComplete = ({ labelValues, multiple = false, onChange, onSelect, onUnselect, onConfirm, onCancel }) => {
  const [labels, setLabels] = useState(labelValues ? Array.isArray(labelValues) ? labelValues : [labelValues] : []);
  const [localLabels, setLocalLabels] = useState(labelValues ? Array.isArray(labelValues) ? labelValues : [labelValues] : []);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestionText, setSuggestionText] = useState("");

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const availableLabels = suggestions.filter(
    (suggestion) => !labels.find((label) => label === suggestion)
  );

  const inputDisabled = !multiple && labels.length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue && inputValue.trim() !== "" && (multiple || labels.length === 0)) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
    setHighlightedIndex(-1);
  }, [inputValue, multiple, labels]);

  const addLabel = (label) => {
    if (multiple) {
      setLabels([...labels, label]);
    } else {
      setLabels([label]);
    }
    setInputValue("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const removeLabel = (event, label) => {
    setLabels(labels.filter((t) => t !== label));
    if (onUnselect) {
      onUnselect(event, label);
    }
  };

  const isFirstSuggestion = (input, firstSuggestion) => {
    if (!input?.trim()) {
      return false;
    }
    
    if (firstSuggestion.toLowerCase().startsWith(input.toLowerCase())) {
      return true;
    }

    return false;
  };

  const setSuggestionWithOnChange = (inputValue) => {
    const maybePromise = onChange(inputValue);

    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.then(data => {
        setSuggestions(data || []);
        const first = data?.[0] ?? "";
        if (isFirstSuggestion(inputValue, first)) {
          setSuggestionText(data[0] || '');
        } else {
          setSuggestionText(inputValue);
        }
      });
    } else {
      setSuggestions(maybePromise);
      const first = maybePromise?.[0] ?? "";
      if (isFirstSuggestion(inputValue, first)) {
        setSuggestionText(maybePromise[0]);
      } else {
        setSuggestionText(inputValue);
      }
    }
  };

  const handleChange = (event) => {
    const input = event.target.value;
    setInputValue(input);

    if (onChange) {
      setSuggestionWithOnChange(input);
    }
  };

  const handleSelect = (event, option) => {
    if (onSelect) {
      onSelect(event, option);
    }

    addLabel(option);
    setSuggestionText('');
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < availableLabels.length - 1 ? prev + 1 : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : availableLabels.length - 1
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelect(event, availableLabels[highlightedIndex]);
      } else {
        handleSelect(event, event.target.value);
      }
    }

    if (event.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleConfirm = (event) => {
    setLocalLabels(labels ? Array.isArray(labels) ? labels : [labels] : []);
    if (onConfirm) {
      onConfirm(event);
    }
  };

  const handleCancel = (event) => {
    event.stopPropagation();
    setLabels(
      localLabels ? Array.isArray(localLabels) ? localLabels : [localLabels] : []
    );

    if (onSelect) {
      localLabels.forEach(label => {
        onSelect(event, label);
      })
      setSuggestionText('');
    }

    if (onCancel) {
      onCancel(event);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="container mt-3 position-relative"
      style={{ maxWidth: 500 }}
    >
      <div
        className="form-control d-flex flex-wrap align-items-center"
        style={{ minHeight: "3rem", gap: "0.4rem" }}
      >
        {labels.map((label) => (
          <Label
            key={label}
            label={label}
            onRemove={(event) => removeLabel(event, label)}
          />
        ))}
        <input
          type="text"
          readOnly
          tabIndex={-1}
          className="form-control position-absolute"
          value={suggestionText}
          style={{
            color: "#ccc",
            background: "transparent",
            pointerEvents: "none",
            borderColor: "transparent",
            zIndex: 1
          }}
        />

        <input
            type="text"
            className="border-0 flex-grow-1 form-control position-relative"
            style={{
              minWidth: "120px",
              outline: "none",
              background: "transparent",
              boxShadow: "none",
              position: "relative",
              zIndex: 2
            }}
            value={inputValue}
            onChange={handleChange}
            ref={inputRef}
            placeholder={
              inputDisabled ? "Maximum 1 címke engedélyezett" : "Kezdj el gépelni..."
            }
            disabled={inputDisabled}
            onKeyDown={handleKeyDown}

        />
      </div>

      {isDropdownOpen && (
        <ul
          className="list-group position-absolute w-100 z-3 shadow"
          style={{
            top: "100%",
            left: 0,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {availableLabels.length === 0 ? (
            <li key="empty" className="list-group-item text-muted">Nincs találat</li>
          ) : (
            availableLabels.map((tag, index) => (
              <li
                key={index}
                className={`list-group-item list-group-item-action${
                  highlightedIndex === index ? " active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={(event) => handleSelect(event, tag)}
                data-value={tag}
                value={tag}
              >
                {tag}
              </li>
            ))
          )}
        </ul>
      )}
      <div className="flex gap-4">
        <button
          onClick={(event) => handleConfirm(event)}
          className="text-green-600 hover:text-green-800 font-bold text-lg"
        >
          ✔
        </button>
        <button
          onClick={(event) => handleCancel(event)}
          className="text-red-600 hover:text-red-800 font-bold text-lg"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default AutoComplete;
