README.TXT FILE
-----------------
1. Set the environment variable PORT_NO
2. Bring up the nodejs server. Start filename 
3. Visit below URL to see system loaded data on start-up 
	Execute http://<URL>/courses/admin/data
4. Open postman_api/SenecaSwag.postman_collection.json file.
	File contains POSTMANAPI related dummy test content.
	- "name": "ADMIN DATA" [To see loaded data in memory].
		http://<URL>/courses/admin/data
	- "name": "POST COURSE STATS" [To see the aggregate stats]
	- "name": "CourseRetrieveWithHeader" : To see data at course level for userId header
5. To see  log file: seneca