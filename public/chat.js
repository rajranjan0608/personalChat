var socket=io.connect("http://localhost:3000");

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

//LISTENING EVENTS

socket.on("chat",function(data){
    
    feedback.innerHTML="";
    
    if(user.value==data.username){
        output.innerHTML+="<p><strong style='color:rgb(111, 170, 0)'>"+data.username+"</strong>: "+data.message+"</p>";
    }else{
        output.innerHTML+="<p><strong>"+data.username+"</strong>: "+data.message+"</p>";
    }

    message.value="";
    
    var chatHistory = document.getElementById("output");
    chatHistory.scrollTop = chatHistory.scrollHeight;

});

socket.on("typing",function(data){
    feedback.innerHTML="<p>"+data+" is typing a message...</p>";
}) 