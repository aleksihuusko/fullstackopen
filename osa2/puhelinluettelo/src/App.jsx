import { useEffect, useState } from 'react';
import './index.css';

import phoneService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ message: null, type: null });

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
            setNotification({
              message: `${newName}'s number was successfully updated.`,
              type: 'success'
            });
            setTimeout(() => setNotification({ message: null, type: null }), 5000);
          })
          .catch((error) => {
            console.log(error.response.data);
            setNotification({
              message: `Failed to update ${newName}.`,
              type: 'error'
            });
            setTimeout(() => setNotification({ message: null, type: null }), 5000);
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
          setNotification({ message: `${newName} was successfully added.`, type: 'success' });
          setTimeout(() => setNotification({ message: null, type: null }), 5000);
        })
        .catch((error) => {
          setNotification({
            message: `${error.response.data.error}`,
            type: 'error'
          });
          setTimeout(() => setNotification({ message: null, type: null }), 5000);
        });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({ message: `${name} was successfully deleted.`, type: 'success' });
          setTimeout(() => setNotification({ message: null, type: null }), 5000);
        })
        .catch((error) => {
          alert(`The person '${name}' was already deleted from the server.`);
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({
            message: `Failed to delete ${name}: ${error.response.data.error}`,
            type: 'error'
          });
          setTimeout(() => setNotification({ message: null, type: null }), 5000);
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
      <Notification message={notification.message} type={notification.type} />
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
