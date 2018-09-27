"use strict";

const express = require('express');
const { customHeader, responseStatus } = require('./constants/constants');
const courseRouter = require('./routes/courses');
const errorHandler = require('./middlewares/expresserrors');
const winston = require('winston');
require('express-async-errors');

const app = express();

const portNo = process.env.PORT_NO || 0;

winston.add(winston.transports.File, {filename: 'seneca.log'});

if( portNo === 0 || !portNo )
{
	console.log("SET ENV VARIABLE: PORT_NO");
	winston.error("PORT NO IS NOT SET. SET PORTNO PLEASE");
	process.exit();
	return;
}

process.on("uncaughtException", (err)=>{
	winston.error("SENECA: Unhandled error");
	winston.error(err.message, err);
});

process.on("unhandledRejection", (err)=>{
	winston.error("SENECA: Unhandled error");
	winston.error(err.message, err);
});

app.use(errorHandler);
app.use(express.urlencoded( { extended : true } ));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/courses', courseRouter);

app.listen( portNo, () => { console.log(`Listening to port ${portNo}`); } );