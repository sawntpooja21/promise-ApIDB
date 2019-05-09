var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

const db = 'mongodb://localhost/api';

mongoose.Promise = global.Promise;
 d=mongoose.connect(db)
.then(() => { 
    console.log("mongo db connected");
})
.catch(err => { 
    console.error('App starting error:', err);
    process.exit(1);
});

//module.exports = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const Note = require('./model1');

/*module.exports = (app) =>{
    const notes = require('./controller.js');*/

 // Create 
 app.post('/notes', (req, res) => {
    
    const note = new Note({
        title: req.body.title || "Untitled Note", 
        content: req.body.content
    });
    /*
    let note =  Note();
    note.title = req.body.title || "Untitled Note" ;
    note.content = req.body.content;*/

    note.save()
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send('error');
    });
});
 //};

 //Retrieve 
 app.get('/notes', (req, res) => {
    Note.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
});

 // Retrieves 
 app.get('/notes/:noteId', (req, res) => {
    Note.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            res.status(500).send({
            message: err.message || "error"
 
            });            
        }
        res.send(note);
    });
});

 // Update 
 app.put('/notes/:noteId', (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        
    });
});

  //Delete 
 app.delete('/notes/:noteId', (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
});


app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});