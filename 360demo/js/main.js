window.onload = function(){
	var socket = io();
	var order = 0;
	var totaluser = 0;
	var dealerdom = document.getElementById("dealer");
	var loosedom; 
	var pokerNum = 2;
	var loosetemp = [];
	var dealerlen = 2;
	var dealerfirst = "";
	var deavaldom;
	for(var i=1;i<=5;i++){
		loosetemp.push(document.getElementById("loose"+i));
	}

	socket.emit('add user');
	socket.on('close',function(){
		alert("连接人数已达到上限,请关闭窗口");
		window.open('', '_self').close();
		socket = '';
	});

	socket.on('userNum',function(userNum){
		if(order == 0){
			order = userNum;
		}
		loosedom = document.getElementById("loose"+order);
		totaluser = userNum;
		
	});
	socket.on('userLeave',function(){
		if(order != 0){
			order--;
			loosedom = document.getElementById("loose"+order);
		}
	});
	socket.on('poker',function(poker){

		//console.log(poker);
		
		var obj = JSON.parse(poker);
		
		//console.log(totaluser);
		for(var i=1;i<=totaluser*2+1;i++){
			
			
			(function(count){
				setTimeout(function(){
    				var player = "player"+count;
    				if((count-totaluser)==1){
    					fapaiAnimation(0,-100,checkPoker,0,obj[player],dealer,count);
    					
    				}else{
    					fapaiAnimation((count%(totaluser+1)-3)*150,150,checkPoker,1,obj[player],loosetemp[count%(totaluser+1)-1],count);
    				}
    			},1100*(i-1));
			})(i);
		
		}
		if(order == 1){
			go.style.display = "inline";
			stop.style.display = "inline";
			go.removeAttribute("disabled");
			stop.removeAttribute("disabled");
			
			if(loose.val == 21){
				go.disabled = "true";
			}else go.removeAttribute("disabled");
		}
	});
	
	
    socket.on('newpoker',function(orderGo,date){
    	/*if(orderGo == order){
    		pokerNum = 2;
    	}*/
		fapaiAnimation((orderGo%(totaluser+1)-3)*150,150,checkPoker,1,date,loosetemp[orderGo-1],pokerNum*(totaluser+1)+orderGo);
		pokerNum++;
		console.log("pokerNum :"+pokerNum);
		setTimeout(function(){
			if(loose.val == 21){
				go.disabled = "true";
				pokerNum = 2;
			}else if(loose.val>21 && order == orderGo){
				alert("您爆了！");
				countChip(1);
				go.disabled = "true";
				stop.disabled = "true";
				socket.emit('stop',order);
				pokerNum = 2;
			}
		},1500);
	});
    socket.on('goTurn',function(goTurn){
    	pokerNum = 2;
    	if(goTurn == order){
    		go.style.display = "inline";
			stop.style.display = "inline";
			go.removeAttribute("disabled");
			stop.removeAttribute("disabled");
    	}
    });

    
    socket.on('dealerPoker',function(dealerPoker){
    	fapaiAnimation(0,100,checkPoker,0,dealerPoker,dealer,(totaluser+1)*dealerlen);
    	dealerlen++;
    })

    socket.on('end',function(dealerval,time){
    	var dealertfirstface = dealerdom.getElementsByClassName("face")[0];
    	var paimian = pokerValShow(parseInt(dealerfirst.split("_")[1]));
    	dealertfirstface.innerHTML = "<div class='topleft'>"+paimian+"</div><div class='bottomright'>"+paimian+"</div>";
    	dealertfirstface.style.backgroundImage = "url('faces/"+dealerfirst+".svg')";
    	deavaldom.style.display = "inline";
    	setTimeout(function(){
    		
    		if(loose.val <=21){
				if(dealerval > 21){
					alert("庄家爆了！");
					countChip(0);
				}else if(dealerval == loose.val){
					alert("平局");
					countChip();
				}else if(dealerval > loose.val){
					alert("庄家赢了！");
					countChip(1);
				}else{
					alert("你赢了！");
					countChip(0);
				}
			}
    	},1300*time)
    	
    })
	var player = document.getElementsByClassName("player");
	
	for(var i=0;i<player.length;i++){
		player[i].style.height = player[i].offsetWidth*1.4+"px";
	}
	var start = document.getElementById("start");
	var go = document.getElementById("go");
	var stop = document.getElementById("stop");

	var fapai = document.getElementById("fapai");

	var loo;
	var dea;

	

	var dealer = {val:0,flag:0};//庄家的牌面,val记录牌面值，flag记录是否有A
	var loose = {val:0,flag:0};//散户的牌面,val记录牌面值，flag记录是否有A

	

	var fix = document.getElementsByClassName("fix")[1];
	
	var chipval = parseInt(document.getElementById("chipval").innerHTML);//拥有的筹码
	var bet = 0;//投注
	
	start.disabled = "true";//先投注，再开始游戏

	fix.onclick = function(event){//投注
		event = event || window.event;
		var target = event .target || event.srcElement;
		
		if(target.className.indexOf("chips") != -1){
			start.removeAttribute("disabled");
			var betval = parseInt(target.innerHTML);
			if(chipval > betval){
				bet = betval;
			}else bet = chipval;
			
			document.getElementById("bet"+order).innerHTML = "投注:"+bet;
			document.getElementById("chipval").innerHTML = chipval - bet;
		}
	}

	start.onclick = function(){

		socket.emit('start');
		start.disabled = "true";
		//开始游戏时，将数据初始化
		pokerNum = 2;
		dealerlen = 2;
		dealerfirst = "";
		dealer = {val:0,flag:0};
		loose = {val:0,flag:0};
		
		dealerdom.innerHTML = "<span id='deaval' class='value'></span>";
		deavaldom = document.getElementById('deaval');
		
		deavaldom.style.display = "none";
		for(var i=0;i<5;i++){
			loosetemp[i].innerHTML = "";
			if(i == order-1) loosetemp[i].innerHTML = "<span id='looval' class='value'></span>";
		}
		

		loo = document.getElementById("looval");
		dea = document.getElementById("deaval");

		//dealerdom.style.width = "0px";
		//loosedom.style.width = "0px";

		if(chipval == 0 ){
			document.getElementById("chipval").innerHTML = 100;
		}

		//fapaiAnimation(0,-200,fun);
		
		// setTimeout(function(){fapaiAnimation(0,-200,checkPoker,0)},1100);
		// setTimeout(function(){fapaiAnimation(-450,150,checkPoker,1)},2200);
		// setTimeout(function(){fapaiAnimation(0,-200,checkPoker,0)},3300);

		
		//document.getElementsByClassName("card").style.display = "block";
	}
	
	go.onclick = function(){
		
		socket.emit('go',order);

		
		/*fapaiAnimation(-450,150,checkPoker,1);*/

		
		
	}
	
	stop.onclick = function(){
		console.log(order);
		pokerNum = 2;
		socket.emit('stop',order);

		//pokerNum = 2;
		go.disabled = "true";
		stop.disabled = "true";
	}

	function countChip(win){//0表示赢了,1表示输了,其它表示平局
		document.getElementById("bet"+order).innerHTML = "";
		if(win == 0){
			document.getElementById("chipval").innerHTML = chipval + bet;
			chipval = chipval + bet;
		}else if(win == 1){
			document.getElementById("chipval").innerHTML = chipval - bet;
			chipval = chipval - bet;
		}else{
			document.getElementById("chipval").innerHTML = chipval;
		}
		start.disabled = "true";
	}
	function pokerColor(){//生成扑克牌花色
		return Math.floor(Math.random()*4);
	} 
	function pokerNum(){//生成扑克牌牌面数字
		return Math.ceil(Math.random()*13);
	}
	
	function pokerValShow(num){//设置牌面显示值
		switch(num){
			case 1:
				return "A";
			case 11:
				return "J";
			case 12:
				return "Q";
			case 13:
				return "K";
			default:
				return num;
		}
	}
	

	function fapaiAnimation(toX,toY,fun,flag,name,loosetemp,count){//发牌动画
		var col = parseInt(name.split("_")[0]);
    	var num = parseInt(name.split("_")[1]);
    	
		var head = document.getElementById("heap");
		
		var newcard = document.createElement("div");
		newcard.className = "card";
		newcard.setAttribute("id","fapai");
		var face = document.createElement("div");
		face.className = "face";
		face.style.backgroundImage = "url('faces/4_2.svg')";
		newcard.appendChild(face);
		head.appendChild(newcard);
		
		//fapai.style.display = "block";
		
		fapai =  document.getElementById("fapai");
		setTimeout(function(){
			fapai = document.getElementById("fapai");
			fapai.style.transition="-webkit-transform 1s ease-out";
    		fapai.style.webkitTransform="translate("+ toX +"px,"+ toY +"px) rotate(180deg)";

		},50);

    	setTimeout(function(){
    		head.removeChild(head.children[1]);
    		if(flag==0){
    			if(count == totaluser+1){
    				fun(name,dealerdom,count,dealer,dea,true);
    			}else{
    				fun(name,dealerdom,count,dealer,dea,false);
    			}
    			
    		}else{
    			fun(name,loosetemp,count,loose,loo,false);
    		}
    	},1050);
	}
	function checkPoker(name,roledom,count,role,showdom,flag){//生成一张新的牌,判断是否重复
		var col = parseInt(name.split("_")[0]);
    	var num = parseInt(name.split("_")[1]);
    	
    	if((count-order)%(totaluser+1) == 0 || count%(totaluser+1) == 0){
    		pokerVal(num,role,showdom);
    	}

		var card = creatPoker(pokerValShow(num),name,flag);

		if(col%2 == 1){
			card.style.color = "#f00";
		}else card.style.color = "#000";
		//roledom.style.width = "100px";
		card.style.left = (count/(totaluser+2)) * 30+"px";
		if(roledom.id.indexOf("loose")!=-1){
			card.style.top = (count/(totaluser+2)) * 30+"px";
		}
		
		//roledom.style.marginLeft = "-20px";
		roledom.appendChild(card);
		
	}
	function creatPoker(val,name,flag){//根据牌的花色和数值，创建一张扑克牌
		var newcard = document.createElement("div");
		newcard.className = "card";
		var face = document.createElement("div");
		face.className = "face";
		if(flag){
			dealerfirst = name;
			face.style.backgroundImage = "url('faces/4_2.svg')";
		}else{
			face.innerHTML = "<div class='topleft'>"+val+"</div><div class='bottomright'>"+val+"</div>";
			face.style.backgroundImage = "url('faces/"+name+".svg')";
		}
		
		
		newcard.appendChild(face);
		return newcard;
	}
	function pokerVal(num,role,showdom){//计算牌面值
		var number = num > 10?10:num;
		role.val += number;
		if(num == 1 && role.flag == 0){
			role.flag = 1;
		}
		
		if(role.flag == 1 && role.val <= 11){
			role.val += 10;
			role.flag = 11;
		}else if(role.flag == 11 && role.val > 21){
			role.val -= 10;
			role.flag = 0;
		}
		
		showdom.innerHTML = role.val;
	}
	
}

window.onresize = function(){
	var player = document.getElementsByClassName("player");
	
	for(var i=0;i<player.length;i++){
		player[i].style.height = player[i].offsetWidth*1.4+"px";
	}
}