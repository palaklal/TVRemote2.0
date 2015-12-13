//handle AJAX request
document.addEventListener('DOMContentLoaded', function() {
	var btn = document.getElementById('btn');
	btn.addEventListener('click', function(event) {
		event.preventDefault();
		var url = "http://tvremote.herokuapp.com/api/shows"; //switch back and forth from localhost:3000
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.addEventListener('load', function() {
			var divFiltered = document.getElementById('filtered');
			var img = document.getElementById('current');
			img.src = JSON.parse(req.responseText).name;
		});
		req.send();
	});
});