function $(id){
	return document.getElementById(id);
}

function trim(t){
	return (t||"").replace(/^\s+|\s+$/g, "");
}

function get(urlpara, callback){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			callback(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", urlpara, true);
	xmlhttp.send(null);
}

function getresponseurl(urlpara, callback){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			callback(xmlhttp.responseURL);
		}
	};
	xmlhttp.open("GET", urlpara, true);
	xmlhttp.send(null);
}

function post(url, para, callback){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			callback(xmlhttp.responseText);
		}
	};
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(para);
}