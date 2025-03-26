import { useState } from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <Search size={16} />
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;