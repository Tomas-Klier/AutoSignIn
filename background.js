var g_SignUrl = "http://www.miaoss.lol";

function GetAccount(){
	if((email = localStorage.getItem("email")) && (password = localStorage.getItem("password"))){
		return {"email":email, "password":password};
	}else{
		return null;
	}
}

function OpenPopup(msg){
	var popupurl = chrome.extension.getURL("popup.html");
	chrome.tabs.query({}, function(tabs){
		var popuptab = tabs.filter(function(t) {return t.url == popupurl});
		if(popuptab.length){
			/*if(!popuptab[0].highlighted){
				if(msg){alert(msg);};
				chrome.tabs.update(popuptab[0].id, {active:true});
			}*/
		}else{
			if(msg){alert(msg);};
			chrome.tabs.create({url:popupurl, active:true});
		}
	});
}

function AutoSign(email, password){
	getresponseurl(g_SignUrl, function(url) {
	
		g_SignUrl = url;
		console.log(url);
		
		get(g_SignUrl+"/panel.php", function(text) {
			//$("pageload").innerHTML = text;
			//var signbutton = $("gift500mb");
			
			var doc = document.implementation.createHTMLDocument("temp");
			doc.documentElement.innerHTML = text;
			var signbutton = doc.getElementById("gift500mb");
			
			if(signbutton == null) {
				post(g_SignUrl+"/login.php", "email="+email+"&pass="+password,
					function (text) {
						doc.documentElement.innerHTML = text;
						var msg = doc.querySelector(".ui.negative.message");
						
						if(msg == null){
							console.log("login successfully.");
							AutoSign(email, password);
						}else{
							alert(trim(msg.innerText));
							console.log(trim(msg.innerText));
							localStorage.removeItem("password");
							OpenPopup();
						}
				});
				return;
			}
			
			console.log(signbutton.innerText);
			
			get(g_SignUrl+"/api.php?cmd=gift500mb", function (text) {
				var curDateTime = new Date();
				var lastsinged = curDateTime.getFullYear()+"-"+curDateTime.getMonth()+"-"+curDateTime.getDay()
									+" "+curDateTime.getHours()+":"+curDateTime.getMinutes()+":"+curDateTime.getSeconds();
				text = trim(text);
				if(text.search("MB") > 0) {
					alert(text);
				}else{
					//var re = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
					var re = new RegExp("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}");
					if(text.match(re)){
						lastsinged = text.match(re)[0];
					}
				}
				localStorage.setItem("lastsigned",lastsinged);
				chrome.runtime.sendMessage({type: "signed"});
				console.log(text);
			});
		});
	});
};

(function () {
	function signByTime() {
		var result;
		if(result = GetAccount()){
			var signemail, signpassword, lastsigned;
			signemail = result["email"];
			signpassword = result["password"];
			lastsigned = localStorage.getItem("lastsigned");
			if(!lastsigned || new Date(lastsigned).setDate(new Date(lastsigned).getDate()+1) <= Date.parse(Date())){
				AutoSign(signemail, signpassword);
			}
		}else{
			var msg = "please login.";
			OpenPopup(msg);
		}
	};
	setInterval(signByTime,60000);
})()