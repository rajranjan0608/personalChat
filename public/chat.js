var ipaddr="127.0.0.1";
var port="3000";

var socket=io.connect("http://"+ipaddr+":"+port);

//DOM

var message=document.getElementById("message"),
    username=document.getElementById("username"),
    btn=document.getElementById("send"),
    output=document.getElementById("output"),
    feedback=document.getElementById("feedback"),
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

//LISTENING EVENTS

socket.on("chat",function(data){
    
    feedback.innerHTML="";
    
    if(user.value==data.username){
        if(prevUser){
            output.innerHTML+="<br><p style='background: cornsilk; width:80%; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px;'><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
        }
        else{
            output.innerHTML+="<p style='background: cornsilk; width:80% ; float:right;  border-top-left-radius: 10px; border-bottom-left-radius: 10px; '><strong style='color:rgb(111, 170, 0); float:right;'>"+data.username+"</strong><br><span style='float:right;'>"+data.message+"</span></p><br>";
        }
    }else{
        output.innerHTML+="<p style='width:80%; float:left;  background:whitesmoke;  border-top-right-radius: 10px; border-bottom-right-radius: 10px;'><strong>"+data.username+"</strong><br>"+data.message+"</p><br>";
    }
    
    message.value="";
    
    var chatHistory = document.getElementById("output");
    chatHistory.scrollTop = chatHistory.scrollHeight;

    prevUser=data.username;
});

socket.on("typing",function(data){
    feedback.innerHTML="<h6 style='color:green;'>"+data+" is typing a message...</h6>";
}) 