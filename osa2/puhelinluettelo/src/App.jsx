import { useEffect, useState } from 'react';

import phoneService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    phoneService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const person = persons.find((p) => p.name === newName);
    if (person) {
      const isConfirmed = window.confirm(
        `${newName} is already added to phonebook, replace the old number ${person.number} with a new one ${newNumber}?`
      );
      if (isConfirmed) {
        const updatedPerson = { ...person, number: newNumber };
        phoneService
          .update(person.id, updatedPerson)
          .then((response) => {
            setPersons(persons.map((p) => (p.id !== person.id ? p : response)));
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };
      phoneService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response));
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          alert(`The person '${name}' was already deleted from the server.`);
          setPersons(persons.filter((person) => person.id !== id));
          console.log(error.response.data);
        });
    }
  };

  const filteredPersons = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons handleDelete={handleDelete} filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
