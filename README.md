-----------------------------------
STEPS TO RUN PERSONAL CHAT ON YOUR WEB BROWSER
-----------------------------------

---------
LINUX
---------
  
  ________________________________________________
  INSIDE app.js and ./public/chat.js/ respectively
  ________________________________________________

    i) Replace 10th Line i.e. "var port=3000" according to the port you are using.

    ii) Replace the variable "ipaddr" (line 1) and "port" (line 2) according to your need. Here, we have, ipaddr=127.0.0.1 and port=3000 that is we are running on local host. 


  _________
  TERMINAL
  _________
 
 	# git clone http://github.com/rajranjan0608/pesrsonalChat
 	# cd personalChat
 	# npm install
 	# service mongodb start (You have to keep running MongoDB on your machine to store and retreive messages and user.)
	# node app.js
  
  ____________
  WEB BROWSER
  ____________

	 PASTE IN THE URL BAR: localhost:3000   OR   <your_ip_address>:<your_port>

---------
WINDOWS
---------

	
