"use strict";
const express = require('express');
const Joi = require('Joi');

const { customHeader, responseStatus, joiErrorMessageConcat } = require('../constants/constants');
const { dbCourseStat, generateUuid } = require('../models/courses');

const router = express.Router();

router.post("/:courseId", (req, res) => {
	const { courseId } = req.params;
	console.log(`Course request ${req.params.courseId}`);
	const userId = req.header(customHeader.USER_ID);
	const courseStat = Object.assign({}, req.body);
	courseStat.courseId = courseId;
	courseStat.userId = userId;

	//Validate data
	const { error } = validateCourse( courseStat );

	if( error )
		return res.status(responseStatus.BAD_DATA_REQUEST).send(joiErrorMessageConcat(error));
	
	try {
		const result = dbCourseStat.save(courseStat);
		delete result.userId; delete result.courseId;
		return res.status(responseStatus.OK).send(result);
	} catch (err) {
		return res.status(responseStatus.INTERNAL_SERVER_ERR).send("Oops, system error "+err.toString());
	}
});

//AGGREGATION LIFE TIME
router.get("/:courseId", (req, res) => {
	const { courseId } = req.params;
	const userId = req.header(customHeader.USER_ID);
	console.log(`Search for course: ${courseId} --> ${userId} `);
	res.header(customHeader.USER_ID, userId);
	return res.status(responseStatus.OK).send(dbCourseStat.calculateStats(courseId, userId));
});

router.get("/admin/data", (req, res) => {
	let userId = req.header(customHeader.USER_ID);
	res.header(customHeader.USER_ID, userId);
	return res.status(responseStatus.OK).send( dbCourseStat.adminData());
});

//SESSION WISE DETAILS
router.get("/:courseId/sessions/:sessionId", (req, res) => {
	
	const { courseId, sessionId } = req.params;
	const userId = req.header(customHeader.USER_ID);
	res.header(customHeader.USER_ID, userId);
	
	//findData
	const result = dbCourseStat.findData(courseId, sessionId, userId);

	if( result )
		return res.status(responseStatus.OK).send(result);
	else 
		return res.status(responseStatus.NO_RECORD_FOUND).send({});
});

function validateCourse(userData) {
	const schema = {
		sessionId: Joi.string().uuid().required(),
		totalModulesStudied: Joi.number().integer().min(0).max(15).required(),
		averageScore: Joi.number().min(0).max(100).required(),
		timeStudied: Joi.number().integer().min(0).required(),
		courseId: Joi.string().uuid().required(),
		userId: Joi.string().uuid().required()
	};

	return Joi.validate( userData, schema );
};

module.exports = router;