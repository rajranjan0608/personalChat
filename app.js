var express			=require("express");
var mongoose		=require("mongoose");
var passport        =require("passport");
var localStrategy   =require("passport-local");
var bodyParser		=require("body-parser");
var User            =require("./models/user");
var Room            =require("./models/room");
var messages		=require("./models/messages");

var app=express();
var port=3000;


//CREATING EXPRESS-SESSION
app.use(require("express-session")({
    secret: "Hi there",
    resave: false,
    saveUninitialized: false
}));

//SETTING UP PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//SETTING UP PASSPORT
// passport.use(new localStrategy2(Room.authenticate()));
// passport.serializeUser(Room.serializeUser());
// passport.deserializeUser(Room.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
    var currentUser=req.user;
    res.locals.currentUser=req.user;
    next();
});

//STATIC FILES
app.use(express.static("public"));

//SOCKET PROGRAMMING ALONG WITH MONGODB DATABASE

//IMPORTING SOCKET
var socket 			=require("socket.io");

//CONNECTING WITH DATABASE
mongoose.connect("mongodb://localhost/chat",{useNewUrlParser:true});

var server=app.listen(port,function(){
	console.log("Connecting...\nConnected to Port "+port);
});

//SOCKET SETUP : ON THE SERVER SIDE
var io=socket(server);

//LISTENING FROM THE CLIENTS
io.on("connection",function(socket){
    
    // console.log("New Socket Connetcted with ID: ", socket.id);

	socket.on("chat",function(data){
        
        // console.log(data);
		messages.create(data)
		io.sockets.emit("chat",data);
	});

	socket.on("typing",function(data){
		socket.broadcast.emit("typing",data);
    });
    
    socket.on("new",function(data){
		socket.broadcast.emit("new",data);
    });

});

//ROUTES
app.get("/",function(req,res){
    res.redirect("/index");
});

app.get("/index",function(req,res){
    // console.log(req.sessionID);
	messages.find({},function(err,messages){
		if(err){
			console.log(err);
		}
		else{
			res.render("index.ejs",{messages:messages});
		}
	});
});

//AUTHENTICATION

//USER SIGN UP PAGE
app.get("/signup",function(req,res){
    res.render("sign_up/signup.ejs");
});

app.post("/signup",function(req,res){

    var username=req.body.username;
    var password=req.body.password;
    
    //JUST FOR FUN :)
    // console.log("PASSWORD: "+password);

    var newUser=new User({username: username});
    User.register(newUser,password,function(err,user){
        if(err){
            console.log(err);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/index");
        });
    });
});

//USER LOG IN
app.post("/login",passport.authenticate("local",{
    successRedirect: "/index",
    failureRedirect: "/"
}),function(req,res){

});

//USER LOG OUT
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/index");
});

//ROOM SIGN UP PAGE

app.post("/roomsignup",function(req,res){

    var username=req.body.roomname;
    var password=req.body.roomid;

    console.log(username);
    
    // console.log("ROOM PASSWORD: "+password);

    var newRoom=new Room({username: username});
    Room.register(newRoom,password,function(err,room){
        if(err){
            console.log(err);
            return res.redirect("/");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/index");
        });
    });
});

//ROOM LOG IN
app.post("/roomlogin",passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/"
}),function(req,res){

});

//IS USER LOGGED IN MIDDLEWARE
function isUserLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("success","Please Login First!");
    res.redirect("/signup");
}