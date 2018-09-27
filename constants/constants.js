"use strict";

module.exports.customHeader = { USER_ID: 'X-User-Id' };

module.exports.responseStatus = { OK: 200,
								  OK_2: 201,
								  BAD_DATA_REQUEST: 400,
								  NO_RECORD_FOUND: 404,
								  INTERNAL_SERVER_ERR: 501
								 };
module.exports.joiErrorMessageConcat = function(error) {
	if( error && error.details)
	{
		let strText = "";
		error.details.forEach( obj => { strText += obj.message + "\n" } );
		return strText;
	}
	return null;
};