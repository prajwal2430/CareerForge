import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ placeholder = 'Search...', value, onChange, shortcut, className = '' }) => {
  return (
    <div className={`search-bar ${className}`}>
      <FiSearch className="search-icon" />
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
      />
      {shortcut && <span className="search-shortcut">{shortcut}</span>}
    </div>
  );
};

export default SearchBar;
