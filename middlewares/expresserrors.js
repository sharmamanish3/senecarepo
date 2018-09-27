"use strict";
module.exports =  (err, req, res, next) => {
	console.log("middleware:error -> ", err);
	res.status(500).send("Internal Server. For details see logs.");
};