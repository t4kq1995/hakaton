CURRENT_WEBSITE = "vk.com";

function parseVK() {
	/* check auth */
	checkAuth();
}

function checkAuth() {
	var localUrl = window.location.hostname;

	if (localUrl == CURRENT_WEBSITE) {
		if (document.getElementById("top_reg_link")) {
			sendRequest("empty", "empty", "empty", "empty", 3)
		} else {
			var profileFullInfo = document.getElementById("profile_full_info");
			var profileInfo = profileFullInfo.getElementsByClassName("profile_info")[3];
			var Audio = search(profileInfo, 1);

			/*film search*/
			var Film = search(profileInfo, 2);

			/*name search*/
			var Title = document.getElementById("title").innerHTML.split("</b>")[2];

			/*phone search*/
			var imgWrapper = document.getElementById("profile_photo_link");
			var Img = imgWrapper.getElementsByTagName("img")[0].getAttribute("src");

			sendRequest(Film, Audio, Title, Img, 0);
		}
	} else {
		sendRequest("empty", "empty", "empty", "empty", 1);
	}
}

function search(profileInfo, num){
	var miniBlock = profileInfo.getElementsByClassName("miniblock")[num];
	var current = miniBlock.getElementsByClassName("labeled")[0].innerHTML;
	var result = current.split(">")[1].split("<")[0];
	return result;
}

function sendRequest(film_like, audio_like, name, avatar, error) {
	if (error == 0)
		chrome.runtime.sendMessage({film: film_like, audio: audio_like, name: name, avatar: avatar, error: "undefined"});
	else
		chrome.runtime.sendMessage({error: error});
}

setInterval(parseVK, 1000);
