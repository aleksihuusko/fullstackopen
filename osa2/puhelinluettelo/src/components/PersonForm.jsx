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
          placeholder="John Doe"
        />
        <br />
        number:
        <input
          autoComplete="off"
          type="text"
          id="number"
          value={newNumber}
          onChange={handleNumberChange}
          placeholder="123-456-7890"
        />
      </div>
      <div>
        <button>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
