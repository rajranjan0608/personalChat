var ipaddr="localhost";
var port="3000";

var socket=io.connect("http://"+ipaddr+":"+port);

//DOM

var message=document.getElementById("message"),
    username=document.getElementById("username"),
    btn=document.getElementById("send"),
    output=document.getElementById("output"),
    feedback=document.getElementById("feedback"),
    newmessage=document.getElementById("newmessage"),
    user=document.getElementById("currentUser");

//EMIT EVENTS : TO THE SERVER

btn.addEventListener("click",function(){
    
    socket.emit("chat",{
        message: message.value,
        username: username.value
    });
});

message.addEventListener("keypress",function(){
    socket.emit("typing",username.value);
});



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
        if(user.value==data.username){
            output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
        }else{
          output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong style='color:red;'>"+data.username+"</strong><br>"+data.message+"</p><br>";
        }
    }else{
        if(newCount==0){
            console.log("new count=0");
            
            if(user.value==data.username){
                output.innerHTML+= "<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
            }else{
                output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><span style='float:right; color:green;'> New Message </span><br> <strong style='color:red;'>"+data.username+"</strong><br>"+data.message+"</p><br>";
            }
        }else{
            console.log("new count=1");
            if(user.value==data.username){
                output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
            }else{
              output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong style='color:red;'>"+data.username+"</strong><br>"+data.message+"</p><br>";
            }
        }

        newCount++;    
    }

    
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
});

socket.on("typing",function(data){
    feedback.innerHTML="<h6 style='color:green;'>"+data+" is typing a message...</h6>";
});
