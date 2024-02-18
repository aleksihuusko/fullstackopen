const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('dist'));

const morgan = require('morgan');
app.use(morgan('tiny'));
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ');
  })
);

const cors = require('cors');
app.use(cors());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Phonebook api</h1>');
});

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    });
  }

  const exists = persons.some((person) => person.name === body.name);
  if (exists) {
    return response.status(400).json({
      error: 'Name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
