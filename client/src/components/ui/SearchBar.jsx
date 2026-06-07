import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ placeholder = 'Search...', value, onChange, shortcut, className = '' }) => {
  return (
    <div className={`topbar-search ${className}`}>
      <FiSearch className="topbar-search-icon" />
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
      />
      {shortcut && <span className="topbar-search-shortcut">{shortcut}</span>}
    </div>
  );
};

export default SearchBar;
