checkStorage();


function titleAvatar() {
	document.getElementById("title").innerHTML = localStorage["title"];
	document.getElementById("main").getElementsByTagName("img")[0].setAttribute("src", localStorage["avatar"]);
}

function checkStorage() {
	if (localStorage["auth_VK_error"]) {
		console.log(localStorage["auth_VK_error"]);
		toggle(document.getElementById("main"));
		document.getElementById("error").style.display = "block";
	} else {
		titleAvatar();
		toggle(document.getElementById("error"));
		document.getElementById("main").style.display = "block";
		sendWord();
	}
}

function toggle(el) {
	el.style.display = (el.style.display == 'none') ? '' : 'none'
}

function sendWord() {
	var http = new XMLHttpRequest();
	var url = "http://shato.zp.ua/hakaton/parse.php";
	var params = "word=" + localStorage["like_audio"] + " +music.i.ua";
	http.open("POST", url, true);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
	    	lookMusicUa("http" + http.responseText.split("http")[4].split("\"")[0]);
	    }
	}
	http.send(params);
}

function lookMusicUa(url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == XMLHttpRequest.DONE) {
    		var splitArray = xhr.responseText.split("</tr>");
    		if (splitArray.length > 1 ) {
	    		for (var i = 1; i < 21; i++) {
	    			var name = splitArray[i].split("</td>")[2].split(">")[2];
	    			var group = splitArray[i].split("</td>")[3].split(">")[3].split("<")[0];
	    			var link = splitArray[i].split("</td>")[3].split('href="')[1].split('">')[0];
	    			var time = splitArray[i].split("</td>")[4].split(">")[1];
	    			document.getElementById("music").innerHTML += "<div>" +
	    				'<a href="http://'+ url.split("/")[2] + link +'" target="_blank" class="open_tab">'
	    				+ name + '(' + group + ')</a>&nbsp;&nbsp;&nbsp;&nbsp;' + time + "</div>";
	    		}
    		} else {
    			document.getElementById("music").innerHTML = "<div class='error_sorry'>Извините, похожие аудиозаписи не найдены...</div>";
    		}
    	}
	}
	xhr.open('GET', url, true);
	xhr.send(null);
}
