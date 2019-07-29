var express			=require("express");
var mongoose		=require("mongoose");
var passport        =require("passport");
var localStrategy   =require("passport-local");
var bodyParser		=require("body-parser");
var User            =require("./models/user");
var Room            =require("./models/room");
var messages		=require("./models/messages");
var percha          =require("./models/percha");

var port=3000;
var app=express();


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

app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
    var currentUser=req.user;
    res.locals.currentUser=req.user;
    next();
});

app.use(function(req,res,next){
    User.find({},function(err,allUsers){
        res.locals.allUsers=allUsers;
    });
    res.locals.url=req.url;
    next();
});

//STATIC FILES
app.use(express.static("public"));

//SOCKET PROGRAMMING ALONG WITH MONGODB DATABASE

//IMPORTING SOCKET
var socket 			=require("socket.io");

var mongoURI="mongodb://localhost/chat"

//CONNECTING WITH DATABASE
var connection=mongoose.connect(mongoURI,{useNewUrlParser:true});

var server=app.listen(3000,function(){
    console.log("Server running on port 3000");
});
//var server=app.listen(3000);
//SOCKET SETUP : ON THE SERVER SIDE
var io=socket(server);

//LISTENING FROM THE CLIENTS
io.on("connection",function(socket){
    
    // console.log("New Socket Connetcted with ID: ", socket.id);

	socket.on("chat",function(data){
        
        if(data.type=="percha"){
            percha.create(data);
        }else{
            messages.create(data);
        }
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
    User.find({},function(err,allUsers){
        messages.find({},function(err,messages){
            if(err){
                console.log(err);
            }
            else{
                res.render("index.ejs",{messages:messages});
            }
        });
    });
});

app.get("/percha",function(req,res){
    User.findOne({username:req.query.username},function(err,user1){
        if(user1){
            if(req.user){
               
                percha.find({$or:[{perchaId:req.user.username+user1.username},{perchaId:user1.username+req.user.username}]},function(err,perMessages){
                    if(perMessages.length!=0){
                        res.render("personalChat.ejs",{isUserAvailable:true, user1:user1, isPerMessages:true, perMessages:perMessages})
                    }else{
                        res.render("personalChat.ejs",{isUserAvailable:true, user1:user1, isPerMessages:false})
                    }
                });
                
            }else{
                res.render("personalChat.ejs",{isUserAvailable:true, user1:user1})
            }
        }else{
            res.render("personalChat.ejs",{isUserAvailable:false})
        }
    })
})

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
