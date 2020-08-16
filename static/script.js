function partition(arr, low, high) {
	var pivot = arr[high][0];
	var i = low - 1;

	for(var j=low; j<high; j++) {
		if( arr[j][0] > pivot ) {
			i += 1;
			var temp = arr[j];
			arr[j] = arr[i];
			arr[i] = temp;
		}	
	}
	var temp = arr[i+1];
	arr[i+1] = arr[high];
	arr[high] = temp;
	return i+1
}

function quicksort_dates(arr, low, high) {
	if( low < high ) {
		pi = partition(arr, low, high);
		quicksort_dates(arr, low, pi-1);
		quicksort_dates(arr, pi+1, high);
	}
}


$(document).ready(function() {
	$.get("https://api.github.com/users/jerte/repos", function(data) {
		var repos = []
		data.forEach(function(i) {
			repos.push([new Date(i['pushed_at']), i['name'], i['html_url'], 
						i['language']]);
		});
		
		quicksort_dates(repos, 0, repos.length-1);
		
		var git_html = "";
		var i;
		for(i=0; i<repos.length; i++) {
			if( i % 4==0 ) {
				git_html += "<tr><td class=\"project invisibleLink underlineHover\"><a href=\"" + 
						repos[i][2]+ "\">" + repos[i][1] + 
						"<p class=\"margin0\">(" + repos[i][3] + ")</p></td>";

			} else {
				git_html += "<td class=\"project invisibleLink underlineHover\"><a href=\"" + 
						repos[i][2]+ "\">" + repos[i][1] + 
						"<p class=\"margin0\">(" + repos[i][3] + ")</p></td>";
			}
		}
		$("#git").html(git_html);
	});

	$("#git").click(function() {
		window.location = $(this).find('a').attr('href');
	});
		
	
});
