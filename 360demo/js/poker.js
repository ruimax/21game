window.onload = function(){
	var player = document.getElementsByClassName("player");
	
	for(var i=0;i<player.length;i++){
		player[i].style.height = player[i].offsetWidth*1.4+"px";
	}
	var start = document.getElementById("start");
	var go = document.getElementById("go");
	var stop = document.getElementById("stop");

	var l = document.getElementById("lval");
	var d = document.getElementById("dval");

	var fapai = document.getElementById("fapai");

	var loo;
	var dea;
	var deavaldom;
	var dealerfirst = "";

	var arr = [];//存储已发的牌，如果后续发的牌已发，则重新随机一张牌
	var arrDealer = [];
	var arrLoose = [];

	var dealer = {val:0,flag:0};//庄家的牌面,val记录牌面值，flag记录是否有A
	var loose = {val:0,flag:0};//散户的牌面,val记录牌面值，flag记录是否有A

	var dealerdom = document.getElementById("dealer");
	var loosedom = document.getElementById("loose");

	var fix = document.getElementsByClassName("fix")[1];
	
	var chipval = parseInt(document.getElementById("chipval").innerHTML);//拥有的筹码
	var bet = 0;//投注
	
	start.disabled = "true";//先投注，再开始游戏

	fix.onclick = function(event){
		event = event || window.event;
		var target = event .target || event.srcElement;
		
		if(target.className.indexOf("chips") != -1){
			start.removeAttribute("disabled");
			var betval = parseInt(target.innerHTML);
			if(chipval > betval){
				bet = betval;
			}else bet = chipval;
			document.getElementById("bet").innerHTML = "投注:"+bet;
			document.getElementById("chipval").innerHTML = chipval - bet;
		}
	}

	start.onclick = function(){

		//开始游戏时，将数据初始化
		arr = [];
		arrDealer = [];
		arrLoose = [];
		dealer = {val:0,flag:0};
		loose = {val:0,flag:0};
		dealerfirst = "";
		
		dealerdom.innerHTML = "<span id='deaval' class='value'></span>";
		loosedom.innerHTML = "<span id='looval' class='value'></span>";

		loo = document.getElementById("looval");
		dea = document.getElementById("deaval");

		dealerdom.style.width = "0px";
		loosedom.style.width = "0px";

		if(chipval == 0 ){
			document.getElementById("chipval").innerHTML = 100;
		}

		deavaldom = document.getElementById('deaval');
		deavaldom.style.display = "none";
		//fapaiAnimation(0,-200,fun);
		fapaiAnimation(-450,150,checkPoker,1);
		setTimeout(function(){fapaiAnimation(0,-150,checkPoker,10)},1100);
		setTimeout(function(){fapaiAnimation(-450,150,checkPoker,1)},2200);
		setTimeout(function(){fapaiAnimation(0,-150,checkPoker,0)},3300);

		go.style.display = "inline";
		stop.style.display = "inline";
		go.removeAttribute("disabled");
		stop.removeAttribute("disabled");
		
		if(loose.val == 21){
			go.disabled = "true";
		}else go.removeAttribute("disabled");
		//document.getElementsByClassName("card").style.display = "block";
	}

	go.onclick = function(){
		//checkPoker(loosedom,arrLoose,loose,loo);
		fapaiAnimation(-450,150,checkPoker,1);

		setTimeout(function(){
			if(loose.val == 21){
				go.disabled = "true";
			}else if(loose.val>21){
				alert("您爆了！");
				countChip(1);
				go.disabled = "true";
				stop.disabled = "true";
			}
		},1500);
		
	}
	function countChip(win){//0表示赢了,1表示输了,其它表示平局
		document.getElementById("bet").innerHTML = "";
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
	stop.onclick = function(){
		var dealertfirstface = dealerdom.getElementsByClassName("face")[0];
    	var paimian = pokerValShow(parseInt(dealerfirst.split("_")[1]));
    	dealertfirstface.innerHTML = "<div class='topleft'>"+paimian+"</div><div class='bottomright'>"+paimian+"</div>";
    	dealertfirstface.style.backgroundImage = "url('faces/"+dealerfirst+".svg')";
    	deavaldom.style.display = "inline";
    	
		while(dealer.val < 17 || (dealer.val >= 17&&dealer.val < loose.val&&dealer.flag==11)){
			checkPoker(dealerdom,arrDealer,dealer,dea);
		}
		if(dealer.val > 21){
			alert("庄家爆了！");
			countChip(0);
		}else{
			if(dealer.val == loose.val){
				alert("平局");
				countChip();
			}else if(dealer.val > loose.val){
				alert("庄家赢了！");
				countChip(1);
			}else{
				alert("你赢了！");
				countChip(0);
			}
		}
		go.disabled = "true";
		stop.disabled = "true";
	}

	function checkPoker(roledom,roleArr,role,showval,flag){//生成一张新的牌,判断是否重复
		var col = pokerColor();
		var num = pokerNum();

		var name = col+"_"+num;
		while(arr.indexOf(name) != -1){
			col = pokerColor();
			num = pokerNum();
			name = col+"_"+num;
		}
		
		arr.push(name);
		roleArr.push(name);

		role.val += pokerVal(num);
		//alert(role.val)
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

		showval.innerHTML = role.val;


		var card = creatPoker(arr.length,pokerValShow(num),name,flag);

		if(col%2 == 1){
			card.style.color = "#f00";
		}else card.style.color = "#000";
		roledom.style.width = "100px";
		card.style.left = (roleArr.length-1) * 20+"px";
		if(roledom.id == "loose"){
			card.style.top = (roleArr.length-1) * 20+"px";
		}
		
		//roledom.style.marginLeft = "-20px";
		roledom.appendChild(card);
		
	}
	function pokerColor(){//生成扑克牌花色
		return Math.floor(Math.random()*4);
	} 
	function pokerNum(){//生成扑克牌牌面数字
		return Math.ceil(Math.random()*13);
	}
	function pokerVal(num){//计算牌面值
		return num > 10?10:num;
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
	function creatPoker(index,val,name,flag){//根据牌的花色和数值，创建一张扑克牌
		var newcard = document.createElement("div");
		newcard.className = "card";
		var face = document.createElement("div");
		face.className = "face"; //face_" + index;
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

	function fapaiAnimation(toX,toY,fun,flag){
		var heap = document.getElementById("heap");
		
		var newcard = document.createElement("div");
		newcard.className = "card";
		newcard.setAttribute("id","fapai");
		var face = document.createElement("div");
		face.className = "face";
		face.style.backgroundImage = "url('./faces/4_2.svg')";
		newcard.appendChild(face);
		heap.appendChild(newcard);
		
		//fapai.style.display = "block";
		
		fapai =  document.getElementById("fapai");
		setTimeout(function(){
			fapai = document.getElementById("fapai");
			fapai.style.transition="-webkit-transform 1s ease-out";
    		fapai.style.webkitTransform="translate("+ toX +"px,"+ toY +"px) rotate(180deg)";

		},50);

    	setTimeout(function(){
    		heap.removeChild(heap.children[1]);
    		if(flag==0){//flag=0，表示该发庄家的牌，1表示发闲家的牌
    			fun(dealerdom,arrDealer,dealer,dea,false);
    		}else if(flag==10){//flag=10，表示该发庄家的第一张牌，不显示
    			fun(dealerdom,arrDealer,dealer,dea,true);
    		}else{
    			fun(loosedom,arrLoose,loose,loo);
    		}
    	},1050);
	}
	
}

window.onresize = function(){
	var player = document.getElementsByClassName("player");
	
	for(var i=0;i<player.length;i++){
		player[i].style.height = player[i].offsetWidth*1.4+"px";
	}
}