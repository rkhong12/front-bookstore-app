import React, { useRef } from "react";

export default function InputField({
  id,
  label,
  name,
  editable = false,
  type = "text",
  placeholder = "",
  error,
  ...rest //  register()에서 넘어오는 모든 속성 (onChange, value 등)
}) {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    if (!editable) return;
    inputRef.current?.focus();
  };

  return (
    <div
      className={`input-field ${editable ? "editable" : "readonly"}`}
      onClick={handleContainerClick}
      role="group"
      aria-labelledby={id + "-label"}
    >
      {label && (
        <label id={id + "-label"} htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        ref={inputRef}
        readOnly={!editable}
        autoComplete="off"
        {...rest} //  register("title")에서 받은 onChange, value, ref 모두 여기서 적용됨!
      />

      {error && <p className="error">{error}</p>}
    </div>
  );
}
