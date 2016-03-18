checkStorage();


function titleAvatar() {
	document.getElementById("title").innerHTML = localStorage["title"];
	document.getElementById("main").getElementsByTagName("img")[0].setAttribute("src", localStorage["avatar"]);
}

function checkStorage() {
	if (localStorage["auth_VK_error"]) {
		console.log(localStorage["auth_VK_error"]);
		toggle(document.getElementById("main"));
		showError();
		document.getElementById("error").style.display = "block";
	} else {
		titleAvatar();
		toggle(document.getElementById("error"));
		document.getElementById("main").style.display = "block";
		sendWord();
	}
}

function showError() {
	if (localStorage["auth_VK_error"] == "3") {
		document.getElementById("error").getElementsByTagName("span")[0].innerHTML = "Для получения доступа к приложению Вам необходимо авторизоваться";
	} else if (localStorage["auth_VK_error"] == "2") {
		document.getElementById("error").getElementsByTagName("span")[0].innerHTML = "Пожалуйста, заполните больше данных о себе";
	} else if (localStorage["auth_VK_error"] == "1") {
		document.getElementById("error").getElementsByTagName("span")[0].innerHTML = "Перейдите на страницу VK.com";
	}
}

function toggle(el) {
	el.style.display = (el.style.display == 'none') ? '' : 'none'
}

function sendWord() {
	var http = new XMLHttpRequest();
	var url = "http://shato.zp.ua/hakaton/parse.php";
	var params = "word=" + localStorage["like_film"] + " фильм+wiki";
	http.open("POST", url, true);
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
	    	lookWiki("http" + http.responseText.split("https")[1].split("\"")[0]);
	    }
	}
	http.send(params);
}

function lookWiki(url) {
	var xhr = new XMLHttpRequest();
	var reges = [];
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == XMLHttpRequest.DONE) {
    		var splitArray = xhr.responseText.split("<tr>");
    		for (var i = 0; i < 10; i++) {
    			var empty = splitArray[i].split("</th>")[0];
    			if (empty.split(">")[1] == "Жанр")
    				reges.push(splitArray[i].split("</a>")[0].split('">')[3]);
    		}
    		if (reges.length > 0)
        		makeList(reges[0]);
        	else {
        		for (var i = 0; i < 10; i++) {
	    			var empty = splitArray[i].split("</td>")[0].split("</a>")[1];
	    			if (empty)
	    				if (empty.split(">")[4])
	    					reges[0] = empty.split(">")[4];
    			}
    			makeList(reges[0]);
        	}
    	}
	}
	xhr.open('GET', url, true);
	xhr.send(null);
}

function makeList(genre) {
	var http = new XMLHttpRequest();
	var url = "http://shato.zp.ua/hakaton/parse.php";
	var params = "word=" + genre + "+ список фильмов kinonews";
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
	    	lookKinoNews("http" + http.responseText.split("http")[1].split("\"")[0]);
	    }
	}
	http.send(params);
}


function lookKinoNews(url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == XMLHttpRequest.DONE) {
    		var splitArray = xhr.responseText.split("<tr>");
    		if (splitArray.length > 1 ) {
	    		for (var i = 5; i < 10; i++) {
	    			var link = splitArray[i].slice(splitArray[i].indexOf("href=") + 6).split(" ")[0];
	    			link = link.substring(0, link.length - 1);
	    			var image = splitArray[i].slice(splitArray[i].indexOf("src=") + 5).split(" ")[0];
	    			document.getElementById("film").innerHTML += "<div><img src='" + image.substring(0, image.length - 1) + "' />" +
	    				'<a href="http://'+ url.split("/")[2] + link +'" target="_blank" class="open_tab">' +
	    					 splitArray[i].slice(splitArray[i].indexOf("titlefilm") + 11).split("<")[0] + '</a>' + "</div>";
	    		}
    		} else {
    			document.getElementById("film").innerHTML = "<div class='error_sorry'>Извините, похожие фильмы не найдены...</div>";
    		}
    	}
	}
	xhr.open('GET', url, true);
	xhr.send(null);
}

var rusWord = $('#rusWord');
var enWord = $('#enWord');

enWord.on('keypress', function(e){
	if(e.keyCode == 13){
	    render(enWord.val(), rusWord, "ru" );
	}
});

rusWord.on('keypress', function(e){
	if(e.keyCode == 13){
	    render(rusWord.val(), enWord, "en" );
	}
});

function render(selectedText, inputElem, lang){
  $.ajax({
        url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140219T202649Z.14cf94ea5878dfac.c384fd8844422602dda22df054a4c64b073205dc&text="+selectedText+"&lang="+ lang +"&format=html&options=1",
        dataType: "json",
        success: function(response) {
          inputElem.val(response["text"]);
      }
  });
}
