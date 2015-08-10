
var title = document.title;

showTime = function() {
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();

	var timeStr = "" + ((hours > 12) ? hours - 12 : hours);

	timeStr += ((minutes < 10) ? ":0" : ":") + minutes;
	timeStr += ((seconds < 10) ? ":0" : ":") + seconds;
	timeStr += (hours >= 12) ? " P.M." : " A.M.";

	document.title = ":) " + timeStr + " " + title;

	setTimeout(showTime, 1000);
};

showTime();
