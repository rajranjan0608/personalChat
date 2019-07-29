var ipaddr="127.0.0.1";
var port="3000";

var socket;

var host=location.origin.replace(/^http/,"http");

socket=io.connect(host);

//DOM

var message=document.getElementById("message"),
    username=document.getElementById("username"),
    btn=document.getElementById("send"),
    output=document.getElementById("output"),
    feedback=document.getElementById("feedback"),
    newmessage=document.getElementById("newmessage"),
    user=document.getElementById("currentUser"),
    url=document.getElementById("url"),
    user1=document.getElementById("user1");

//EMIT EVENTS : TO THE SERVER

btn.addEventListener("click",function(){
    
    if(url.value=="/percha"){
        socket.emit("chat",{
            message: message.value,
            reqUser: username.value,
            user1  : user1.value,
            perchaId: username.value+user1.value,
            type   : "percha"
        });
    }else{
        socket.emit("chat",{
            message: message.value,
            username: username.value
        });
    }
});

message.addEventListener("keypress",function(){
    socket.emit("typing",username.value);
});

message.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        validate(e)
    }
});

function validate(e) {
    var text = e.target.value;
    
    if(text){
        if(url.value=="/percha"){
            socket.emit("chat",{
                message: message.value,
                reqUser: username.value,
                user1  : user1.value,
                perchaId: username.value+user1.value,
                type   : "percha"
            });
        }else{
            socket.emit("chat",{
                message: message.value,
                username: username.value
            });
        }
    }

}


var prevUser="0";

function prev(prevUser){
    if(prevUser==user.value){
        return 1;
    }
}

var chatHistory = document.getElementById("output");

//LISTENING EVENTS

var newCount=0;

socket.on("chat",function(data){
    
    var scroll=(chatHistory.scrollHeight-chatHistory.scrollTop)==(chatHistory.clientHeight);

    feedback.innerHTML="";
    
    if(scroll){
        
        if(data.type=="percha"){
            // alert("1a");
            if(user.value==data.reqUser){
                output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+user.value+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
            }else{
              output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong style='color:red;'>"+user1.value+"</strong><br>"+data.message+"</p><br>";
            }
        }else{
            // alert("1b");
            if(user.value==data.username){
                output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
            }else{
              output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong style='color:red;'>"+data.username+"</strong><br>"+data.message+"</p><br>";
            }
        }
    }else{
        if(newCount==0){
            
            if(data.type=="percha"){
                // alert("2a");
                if(user.value==data.reqUser){
                    output.innerHTML+= "<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+user.value+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
                }else{
                    output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><span style='float:right; color:green;'> New Message </span><br> <strong style='color:red;'>"+user1.value+"</strong><br>"+data.message+"</p><br>";
                }
            }else{
                // alert("2b");
                if(user.value==data.username){
                    output.innerHTML+= "<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
                }else{
                    output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><span style='float:right; color:green;'> New Message </span><br> <strong style='color:red;'>"+data.username+"</strong><br>"+data.message+"</p><br>";
                }
            }
        }else{
            if(data.type=="percha"){
                // alert("3a");
                if(user.value==data.reqUser){
                    output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+user.value+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
                }else{
                    output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong style='color:red;'>"+user1.value+"</strong><br>"+data.message+"</p><br>";
                }
            }else{
                // alert("3b");
                if(user.value==data.username){
                    output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
                }else{
                  output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong style='color:red;'>"+data.username+"</strong><br>"+data.message+"</p><br>"
                }
            }
        }

        newCount++;    
    }

    if(data.type=="percha"){
        if(data.reqUser!=user.value){
            if(scroll){
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }else{
                feedback.innerHTML="<h6 style='color:green'>New Messages</h6>";
            }
        }else{
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    
        if(data.reqUser==user.value){
            message.value="";
        }
        
        prevUser=data.username;
    }else{
        if(data.username!=user.value){
            if(scroll){
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }else{
                feedback.innerHTML="<h6 style='color:green'>New Messages</h6>";
            }
        }else{
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    
        if(data.username==user.value){
            message.value="";
        }
        
        prevUser=data.username;
    }
    
});



socket.on("typing",function(data){
    feedback.innerHTML="<h6 style='color:green;'>"+data+" is typing a message...</h6>";
});
