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

    ii) Replace "localhost:3000" of the 1st line i.e. "var socket=io.connect("localhost:3000");"      according to your IP address and Port as :    "var socket=io.connect("<ip_address>:<port>");"


  _________
  TERMINAL
  _________
 
 	# git clone http://github.com/rajranjan0608/pesrsonalChat
 	# cd personalChat
 	# npm install
 	# service mongodb start
	# node app.js
  
  ____________
  WEB BROWSER
  ____________

	 PASTE IN THE URL BAR: localhost:3000   OR   <your_ip_address>:<your_port>

---------
WINDOWS
---------

	
