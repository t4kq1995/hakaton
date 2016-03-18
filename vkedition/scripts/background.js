chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.error == "undefined") {
		var like_film = request.film;
		var like_audio = request.audio;
		localStorage["like_film"] = like_film;
		localStorage["like_audio"] = like_audio;
		localStorage["title"] = request.name;
		localStorage["avatar"] = request.avatar;
		localStorage.removeItem("auth_VK_error");
		console.log("OK!");
	} else {
		localStorage["auth_VK_error"] = request.error;
		localStorage.removeItem("like_film");
		localStorage.removeItem("like_audio");
		localStorage.removeItem("title");
		localStorage.removeItem("avatar");
		console.log("Error!");
	}
});