var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port,function(){
	console.log('Server listening at port %d', port);
})
// Routing
app.use(express.static(__dirname + '/360demo'));
  
var userNum = 0;
var countStart = 0;
var arr = [];
var dealerNum = 0;

socketio.listen(server).on('connection', function (socket) {
    
    
    socket.on('add user', function () {
        userNum++;
        if(userNum > 5){
            socket.emit("close");
            userNum = 5;
        }else{
            socket.broadcast.emit('userNum', userNum);
            socket.emit('userNum', userNum);
            
            console.log("++:"+userNum);
        }
        
    });
    socket.on('disconnect', function (msg) {
        userNum--;
        if(userNum < 0){
        	userNum = 0;
        }
        socket.broadcast.emit('userLeave', userNum);
        //socket.emit('userNum', userNum);
        console.log("--:"+userNum);
    });
    
    socket.on('start',function(){

    	countStart++;
    	if(countStart == userNum){
    		var json = {};
    		for(var i=1;i<=countStart*2+1;i++){
    			var poker = createPoker();
    			if(i==countStart+1){
    				dealerNum = pokerVal(dealerNum,parseInt(poker.split("_")[1]));
    			}
    			createJson(json,"player"+i,poker);
    		}
    		console.log(json);
    		json = JSON.stringify(json);
    		socket.broadcast.emit('poker',json);
    		socket.emit('poker',json);
    		countStart = 0;
    	}
    	
    });
    socket.on('go',function(order){
    	var newname = createPoker();
    	console.log(newname);
    	socket.broadcast.emit('newpoker',order,newname);
    	socket.emit('newpoker',order,newname);
    });

    socket.on('stop',function(order){
    	console.log("order:"+order+" "+userNum);
    	if(order == userNum){
    		var dealerpoker = createPoker();
    		dealerNum = pokerVal(dealerNum,parseInt(dealerpoker.split("_")[1]));
    		console.log("dealerNum:"+dealerNum);
    		socket.broadcast.emit("dealerPoker",dealerpoker);
    		socket.emit("dealerPoker",dealerpoker);
    		var i = 1;
    		while(dealerNum < 17){
    			dealerpoker = createPoker();
    			dealerNum = pokerVal(dealerNum,parseInt(dealerpoker.split("_")[1]));
    			console.log("dealerNum:"+dealerNum);
    			socket.broadcast.emit("dealerPoker",dealerpoker);
    			socket.emit("dealerPoker",dealerpoker);
    			i++;
    		}
    		socket.broadcast.emit('end',dealerNum,i);
    		socket.emit('end',dealerNum,i);
    		
			countStart = 0;
			arr = [];
			dealerNum = 0;
    	}
    	socket.broadcast.emit('goTurn',order+1);
    	socket.emit('goTurn',order+1);
    })

});

function createPoker(){
	var col = pokerColor();
    var num = pokerNum();
    var name = col+"_"+num;
    while(arr.indexOf(name) != -1){
        col = pokerColor();
        num = pokerNum();
        name = col+"_"+num;
    }
    arr.push(name);

    return name;
}
// 参数：prop = 属性，val = 值
function createJson(json,prop, val) {
    // 如果 val 被忽略
    if(typeof val === "undefined") {
        // 删除属性
        delete json[prop];
    }
    else {
        // 添加 或 修改
        json[prop] = val;
    }
}
function pokerColor(){//生成扑克牌花色
    return Math.floor(Math.random()*4);
} 
function pokerNum(){//生成扑克牌牌面数字
    return Math.ceil(Math.random()*13);
}
var flag = 0;
function pokerVal(val,num){
	var number = num > 10?10:num;
	val += number;
	if(num == 1 && flag == 0){
		flag = 1;
	}
	
	if(flag == 1 && val <= 11){
		val += 10;
		flag = 11;
	}else if(flag == 11 && val > 21){
		val -= 10;
		flag = 0;
	}
	return val;
}