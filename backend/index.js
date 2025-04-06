// const http = require('http');

// let notes = [
//   {
//     id: '1',
//     content: 'HTML is easy',
//     important: true,
//   },
//   {
//     id: '2',
//     content: 'Browser can execute only JavaScript',
//     important: false,
//   },
//   {
//     id: '3',
//     content: 'GET and POST are the most important metods of HTTP protocol',
//     important: true,
//   },
// ];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(notes));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server is running on port ${PORT}`);
// const mongoose = require('mongoose');

// mongoose.set('strictQuery', false);
// mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id, delete returnedObject.__v;
//   },
// });

// const Note = mongoose.model('Note', noteSchema);

// let notes = [
//   {
//     id: '1',
//     content: 'HTML is easy',
//     important: true,
//   },
//   {
//     id: '2',
//     content: 'Browser can execute only JavaScript',
//     important: false,
//   },
//   {
//     id: '3',
//     content: 'GET and POST are the most important metods of HTTP protocol',
//     important: true,
//   },
// ];
// const Note = require('./models/note');
// const config = require('./utils/config');
// const logger = require('./utils/logger');
// const express = require('express');
// const app = require('./app');

// app.use(express.static('dist'));
// app.use(express.json());

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method);
//   console.log('Path:', request.path);
//   console.log('Body:', request.body);
//   console.log('---');
//   next();
// };

// app.use(requestLogger);

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!!!</h1>');
// });

// app.get('/api/notes', (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

// // app.get('/api/notes/:id', (request, response) => {
// //   const id = request.params.id;
// //   const note = notes.find((note) => note.id === id);
// //   if (note) {
// //     response.json(note);
// //   } else {
// //     response.status(404).end();
// //   }
// // });

// // app.delete('/api/notes/:id', (request, response) => {
// //   const id = request.params.id;
// //   notes = notes.filter((note) => note.id !== id);
// //   response.json(notes);
// //   response.status(204);
// // });

// const generateId = () => {
//   const maxId =
//     notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
//   return String(maxId + 1);
// };

// // app.post('/api/notes', (request, response) => {
// //   const body = request.body;
// //   if (!body.content) {
// //     return response.status(400).json({
// //       error: 'content missing',
// //     });
// //   }
// //   const note = {
// //     content: body.content,
// //     important: Boolean(body.important) || false,
// //     id: generateId(),
// //   };

// //   notes = notes.concat(note);

// //   response.json(note);
// // });

// app.post('/api/notes', (request, response, next) => {
//   console.log('post is running');
//   const body = request.body;
//   if (!body.content) {
//     return response.status(400).json({ error: 'content missing' });
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   });

//   note
//     .save()
//     .then((savedNote) => {
//       response.json(savedNote);
//     })
//     .catch((error) => next(error));
// });

// app.get('/api/notes/:id', (request, response, next) => {
//   console.log('get is running');
//   Note.findById(request.params.id)
//     .then((note) => {
//       if (note) {
//         response.json(note);
//       } else {
//         response.status(404).end();
//       }
//     })
//     .catch((error) => next(error));
// });

// app.delete('/api/notes/:id', (request, response, next) => {
//   Note.findByIdAndDelete(request.params.id)
//     .then((result) => {
//       response.status(204).end();
//     })
//     .catch((error) => next(error));
// });

// app.put('/api/notes/:id', (request, response, next) => {
//   console.log('put is running');
//   const { content, important } = request.body;

//   Note.findById(request.params.id)
//     .then((note) => {
//       if (!note) {
//         return response.status(404).end();
//       }

//       note.content = content;
//       note.important = important;

//       return note.save().then((updatedNote) => {
//         response.json(updatedNote);
//       });
//     })
//     .catch((error) => next(error));
// });

// // error handling

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' });
// };
// app.use(unknownEndpoint);

// const errorHandler = (error, request, response, next) => {
//   console.log(error.message);

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' });
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message });
//   }
//   next(error);
// };

// app.use(errorHandler);

// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   logger.info(`server running on port ${PORT}`);
// });

const app = require('./app'); // the actual Express application
const config = require('./utils/config');
const logger = require('./utils/logger');

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
