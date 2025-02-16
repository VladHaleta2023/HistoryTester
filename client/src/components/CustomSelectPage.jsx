import React, { useState } from "react";
import Select from "react-select";

const CustomSelectPage = ({ options, value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div>
      <div className="relative">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Поиск..." 
          className="inputSearch"
        />
        <Select
          value={value}
          onChange={onChange}
          options={filteredOptions}
          isSearchable={false}
          menuPlacement="bottom"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "white",
              border: "1px solid #ccc",
              paddingLeft: "0px",
              boxShadow: "none",
              "&:hover": {
                border: "1px solid #888",
              },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "transparent" : "white",
              color: state.isFocused ? "black" : "inherit",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }),
          }}
        />
      </div>
    </div>
  );
};

export default CustomSelectPage;