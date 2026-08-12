import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

function SearchBar() {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search by title or director..."
      />
    </div>
  );
}

export default SearchBar;