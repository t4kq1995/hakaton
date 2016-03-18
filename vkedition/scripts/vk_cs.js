chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('chrome.runtime.onMessage.addListener');
    if (request.action == "textChange"){
     	console.log('Text i d like to see')
    }
});

chrome.runtime.sendMessage({ action: "show" });
$(document).ready(function (){
	$(document).on('mouseup','body',function(e){
		if (e.ctrlKey) {
			render(getSelectionText());
			chrome.runtime.sendMessage({action: "textChange"});
   		}
	});
});

function render(selectedText){
	var lang = JSON.parse(checkLang(selectedText))["lang"];
	var realLang = (lang == "en") ? "ru" : "en";
	console.log("realLang: "+realLang+ "  lang:  "+ lang);
	$.ajax({
		    url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140219T202649Z.14cf94ea5878dfac.c384fd8844422602dda22df054a4c64b073205dc&text="+selectedText+"&lang="+realLang,
		    dataType: "json",
		    success: function(response) {
		    	alert(selectedText +" → "+ response["text"]);
			}
	});
}

function checkLang(text){
	var jqXHR = $.ajax({
	    url: "https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20140219T202649Z.14cf94ea5878dfac.c384fd8844422602dda22df054a4c64b073205dc&text="+text,
	    dataType: "json",
	    success: function(response) {
	    	return response["lang"];
		},
		async: false
	});
	return jqXHR.responseText;
}

function getSelectionText() {
    if (window.getSelection) {
        try
{            return window.getSelection().toString();
        } catch (e) {
            console.log('Cant get selection text')
        }
    }
}