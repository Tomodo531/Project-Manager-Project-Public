const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true
	})
);

//Indeholder connection key
require('dotenv').config();

//Henter DB key
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUniFiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB database connetion established successfully');
});

const userRouter = require('./routes/user.route');
app.use('/user', userRouter);

const projectRouter = require('./routes/project.route');
app.use('/project', projectRouter);

const assignmentGroupRouter = require('./routes/assignmentGroup.route');
app.use('/group', assignmentGroupRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Blog express server running on port: ${port}`);
});