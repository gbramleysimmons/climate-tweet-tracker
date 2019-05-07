#Climate Tweet Tracker

**Final Project for CS1320: Creating Modern Web Applications**

Created by Olivia Langley, Esther Choi, and Grace Bramley-Simmons. 


**How to Run:** To run the server and the REPL, run node server.js from the subdirectory 'server.'

The GUI should then be  avaliable at "localhost:8080";

To get more informatioin on REPL commands, type "help".

To modify the tweets being tracked, or that are avaliable to be displayed
use the administrative console on the website, or REPL commands. 

The data can also be formatted into CSV files using the REPL. If additional
information or CSV formats are needed, please reach out to Grace. 

To register a new administrator, use the REPL.

For help packaging this application for integration or deployment, contact Grace
at grace_bramley-simmons@brown.edu. 


**How To Change Credentials:**
This app was developed using test credentials for the Twitter API and a test MySQL database.
Before deployment, both should be changed. To change the MySQL database, subsititute in your
url for the URL at the top of server.js. To change the twitter credentials, change all 
tokens in the twit object at the top of tweets.js. 


**Design Information**

This web application was created with a React.js frontend, using D3 for data visualization, and a Node.js backend. 
MySQL was used to track and retrieved data. 

Sources:
Much of code for the graph (D3) came from here: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
