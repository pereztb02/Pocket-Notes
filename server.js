const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const app = express();
const fs = require('fs');
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  //GET request for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//GET request for notes in db
app.get('/api/notes', (req, res) => res.json(db));

//GET route for a specific note by id
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const selectedNote = db.find(note => note.id === noteId);

    if (selectedNote) {
        res.json(selectedNote);
    } else {
        res.status(404).json({ message: 'note not found'});
    }
});

//POST request for notes to db
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    db.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        if (err) {
          console.error('Error saving note to the file:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

    res.json({ message: 'note saved successfully'});
});
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);