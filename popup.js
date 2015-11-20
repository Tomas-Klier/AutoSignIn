function $(id){return document.getElementById(id);}

function AddTearDropList(obj, str){
	var img = document.createElement("img");
	img.setAttribute("id", "teardrop");
	img.setAttribute("src", "img/teardrop.png");
	img.onclick = function(){
		obj.focus();
		if($("emaillist")){
			if($("emaillist").style.display == "none"){
				$("emaillist").style.display = "block";
			}else{
				$("emaillist").style.display = "none";
			}
		}
	};
	obj.parentNode.appendChild(img);
	
	var ul = document.createElement("ul");
	ul.style.display = "none";
	ul.setAttribute("id", "emaillist");
	
	var emaillist = str.split(',');
	for(var i = 0; i < emaillist.length && emaillist[i].length > 0; i++){
		var li = document.createElement("li");
		li.innerHTML = emaillist[i];
		li.onclick = function(){
			obj.focus();
			obj.value = this.innerHTML;
		};
		ul.appendChild(li);
	}
	
	obj.parentNode.appendChild(ul);
}
	
document.addEventListener("DOMContentLoaded",function(){
	var email, password, lastsigned;
	if(!(email = localStorage.getItem("email"))){
		$("user").focus();
	}else{
		$("user").value = email;
		if(!(password = localStorage.getItem("password"))){
			$("pass").focus();
		}else{
			$("content").style.display="none";
			$("state").style.display="block";
			$("username").innerHTML= email;
			
			if((lastsigned = localStorage.getItem("lastsigned"))){
				var datesign = new Date(lastsigned);
				var numnow = Date.parse(Date());
				if(Date.parse(datesign) < numnow && numnow <= Date.parse(new Date(datesign.toLocaleDateString() + " 23:59:59"))){
					$("signstate").innerHTML= "signed";
				}
			}
		}
	}
	
	//add emaillist
	var emaillist = localStorage.getItem("emaillist");
	if(emaillist && emaillist.split(',') && emaillist.split(',').length > 1){
		AddTearDropList($("user"), emaillist);
	}
	
	//runtime message response
	if(chrome.runtime.onMessage){
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
			if(message.type == "signed"){
				$("signstate").innerHTML= "signed";
			}
		});
	}
	
	$("user").addEventListener("click",function(){
		this.select();
	});
	
	$("user").addEventListener("focus",function(){
		this.select();
	});
	
	$("ok").addEventListener("click",function(){
		if($("user").value.length == 0){
			$("user").focus();
		}else if($("pass").value.length == 0){
			$("pass").focus();
		}else{
			$("content").style.display="none";
			$("state").style.display="block";
			
			var user = $("user").value;
			var pass = $("pass").value;
			$("username").innerHTML= user;
			localStorage.setItem("email", user);
			localStorage.setItem("password", pass);
			
			var emaillist = localStorage.getItem("emaillist");
			if(!emaillist){
				localStorage.setItem("emaillist", user+",");
			}else if(emaillist.indexOf(user) == -1){
				localStorage.setItem("emaillist", emaillist+user+",");
			}
			
			window.close();
			
			var bkground = chrome.extension.getBackgroundPage();
			if(bkground){
				bkground.AutoSign(user, pass);
			}
		}
	});
	
	$("changeaccount").addEventListener("click",function(){
		$("state").style.display="none";
		$("content").style.display="block";
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		localStorage.removeItem("lastsigned");
	});
	
	document.addEventListener("click",function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.id != "teardrop" && target.id != "user"){
			if($("emaillist") && $("emaillist").style.display != "none"){
				$("emaillist").style.display="none";
			}
		}
	});
	
	document.addEventListener("keyup",function(e){
		var e = e || window.event;
		if(e.keyCode == 13){
			$("ok").click();
		}
	});
});