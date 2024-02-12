const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        filter shown with
        <input
          autoComplete="off"
          type="text"
          id="filter"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
    </form>
  );
};

export default Filter;
