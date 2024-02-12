const PersonForm = ({ handleSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:
        <input
          autoComplete="off"
          type="text"
          id="name"
          value={newName}
          onChange={handleNameChange}
        />
        <br />
        number:
        <input
          autoComplete="off"
          type="text"
          id="number"
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
