# Test Log

The test log provides an over of the test and development process.  This application relies on the use two main technologies.  A third-party javascript library, DataTable and Edit https://datatables.net/ to create and manage tables, Flask for view functions and AJAX / JSON to move data between DataTables functions and Flask view functions.  The database is based on MongoDb.

The Datatables can only be created in Javascript.  Database records are retrieved and managed by Python.

A set of python Unittest and designed to test that the view functions types work and json can be received. Only a sample of view functions are tested with the goal of providing confidence that coding pattern works.  The json test fails,  because unfornately, I could not figure out how create a backup database for testing without creating a switch in main.py that had to turned on and off as I moved from unittest to running pre-production software. (If statement in main.py pointing to different mongodb databases).  This is something Django / SQL handles much better than the basic unittest and PyMongo.  As a result, knowning the data and looking at the failure message, that it's clear that right data is being returned.  But the equality test fails because MongoDb returns list of data in a different order than test's control data. 

Likewise, sample set of Jasmine tests were used to verify that a DataTables can be rendered, data from that table removed and formated so that it can be sent back to python, and HTML form values can be set via javascript, so that the form data can be retrieved by python e.g. mongoDB ID number.  The AJAX communication is not verified through automated tests, but rather inspection and use of python print statements and javascript / html console.log.

As I developed the program, I used print statements and console.log to test key variables through the program.  Some of these statements are left in code, which I know should not be done in production code. I left them in for purpose of your evaluation so that you see what data I was viewing during my development process. To solve the AJAX testing quesetion, I looked into using Sinon JS and perhaps in future iteration I would use it.  However, without a test framework to spoof the server, it just seem easier to use console.log to view the data leaving javascript and print statement to compare it with data arriving in python.   To test the data going the other direction from python to javascript Datatable made such a test obvious, since the data would show up nicely in the datatable.  To verify that database IDs were correct was simple.  All I had to do was expose ID field in the DataTable.



# Known issues

Can remove dropbox sdk directory.  Get C9 access denied message.