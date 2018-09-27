"use strict";
const _ = require('lodash');
const uuidv1 = require('uuid/v1');

const uuidProm = new Promise( (resolve) => {
	const results = [];
	for(let i=1; i < 6; i++) {
		setTimeout( () => { results.push(generateUuid()); if(i===5) {resolve(results);} }, i * 1000);
	}
});

function generateUuid() {
	return uuidv1();
}

class DbData {
	
	constructor() {
		this.arrData = [];
		this.courseColl = [];
		this.sessionColl = [];
		this.userCollection = [];
	 	this.populateCollection();
	}
	
	/*
		Step1: Filter data for passed course/UserId
		Step2: Reduce function to calculate totals.
		Step3: Remove running totalScore 
		THIS FUNCTION CAN BE MOVED TO PROTOTYPE
	*/
	calculateStats(courseId, userId) {
		let runninStat = {totalModulesStudied: 0, averageScore: 0, timeStudied: 0, totalScore: 0};

		const arrCourseRecs = this.arrData.filter( item => {
				 return (_.isEqual(item.courseId, courseId) && _.isEqual(item.userId, userId));
						  						 });
		const lifeTimeStat = arrCourseRecs.reduce( (runninStat, item) => { 
						  				return  this.runnerCalc(runninStat, item);  
						  			}, runninStat );

		//Perform average only once at the end to save time.
		lifeTimeStat.averageScore = this.avgCalc ( 
									  lifeTimeStat.totalScore ,  
									  lifeTimeStat.totalModulesStudied
									  );

		delete lifeTimeStat.totalScore; //temporary property
		return lifeTimeStat;
	}

	//THIS FUNCTION CAN BE MOVED TO PROTOTYPE
	avgCalc (sumAvg = 0, totalModules = 0) {
		if(totalModules > 0)
			return _.round(sumAvg / totalModules, 2);
		return 0;
	}

	//THIS FUNCTION CAN BE MOVED TO PROTOTYPE
	runnerCalc(runninStat, newItem) {
			runninStat.totalModulesStudied = (runninStat.totalModulesStudied ) + (newItem.totalModulesStudied || 0);
			runninStat.totalScore = (runninStat.totalScore ) + ((newItem.averageScore || 0) * newItem.totalModulesStudied) ;
			runninStat.timeStudied = (runninStat.timeStudied ) + (newItem.timeStudied || 0);
			return runninStat;
	}

	//THIS FUNCTION CAN BE MOVED TO COURSE.PROTOTYPE.
	//BUT AS WE MAINTAIN ONLY 1 AT APPLICAION LEVEL, EASY TO KEEP HERE WITHIN CLASS.
	save(courseStat) {
		//DUPLICATE SESSION/COURSEID/USERID
		const { courseId, sessionId, userId } = courseStat;
		
		//Find index position
		const indexPos = _.findIndex(this.arrData, { courseId: courseId, sessionId: sessionId, userId: userId } );
		
		if(indexPos >- 1)
			this.arrData.splice(indexPos, 1, courseStat );
		else
			this.arrData.push(courseStat);
		return Object.assign({},courseStat); //AS ALL ARE NORMAL PROPERTIES using assign.
	}

	findData(courseId, sessionId, userId) {
		const result = _.find(this.arrData, {courseId: courseId, sessionId: sessionId, userId: userId} )
		//return Object.assign({}, result);
		return _.omit(result, ['userId','courseId']);
	}

	//THIS FUNCTION CAN BE MOVED TO PROTOTYPE
	adminData() {
		const entireData = {}
		entireData.comment = "System generated Course/Session/User collections. Scores include both system/user entered."
		entireData.courseColl = this.courseColl;
		entireData.sessionColl = this.sessionColl;
		entireData.userCollection = this.userCollection;
		entireData.arrData = this.arrData;
		return entireData; 
	}

	async populateCollection() {
		this.courseColl = await uuidProm;
		this.sessionColl = await uuidProm;
		this.userCollection = await uuidProm;
		
		//Populate Student Data
		this.save(
		{ sessionId: this.sessionColl[0],
		  totalModulesStudied: 10,
		  averageScore: 25,
		  timeStudied: 130,
		  courseId: this.courseColl[0],
		  userId: this.userCollection[0]
		});

		this.save(
		{ sessionId: this.sessionColl[1],
		  totalModulesStudied: 30,
		  averageScore: 45,
		  timeStudied: 200,
		  courseId: this.courseColl[0],
		  userId: this.userCollection[0]
		});

		this.save(
		{ sessionId: this.sessionColl[2],
		  totalModulesStudied: 45,
		  averageScore: 45,
		  timeStudied: 200,
		  courseId: this.courseColl[0],
		  userId: this.userCollection[0]
		});

		this.save(
		{ sessionId: this.sessionColl[1],
		  totalModulesStudied: 5,
		  averageScore: 5,
		  timeStudied: 200,
		  courseId: this.courseColl[0],
		  userId: this.userCollection[1]
		});
	};

}
const dbCourseStat = new DbData();
module.exports.dbCourseStat = dbCourseStat;
module.exports.generateUuid = generateUuid;