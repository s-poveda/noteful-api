const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const notesRouter = require('./routes/notesRouter');
const foldersRouter = require('./routes/foldersRouter');

const app = express();

const morganOptn = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOptn));
app.use(helmet());
app.use(cors());

// routes ::::::::
app.use('/notes', notesRouter);
app.use('/folders', foldersRouter);

//generic error handler
app.use( (error, req, res, next) =>{
	let response = null;
 	if ( NODE_ENV === 'production' ) {
		response = { message : 'server error' };
	} else {
		console.log(error);
		response = { error, message : error.message };
	}
	res.json(response);
});


module.exports = app;
