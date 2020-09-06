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
	
	$("#admin").submit(function(event) {
			
		console.log($("#user").val());
		$.post('/admin/login', {user: $("#user").val(), pass: $("#pass").val()}, function(x) {
			if(x=='auth') {
				alert('auth');
			}
		});
	});
	
	$(".add").click(function(e1) {
		if($("#" + e1.currentTarget.id + " p").text()) {
			var form = "<form class=\"add-form\" id=\"form-"+ e1.currentTarget.id.slice(4) + 
					   "\"><input type=\"text\" id=\"input-" + e1.currentTarget.id.slice(4) + 
					   "\"><input type=\"submit\"></form>";
			$("#"+ e1.currentTarget.id).html(form);
			$(document.body).append(form);
			
			$(".add-form").submit(function(e) {
				console.log("submitted " + e.currentTarget.id);
				console.log($("#input-" + e.currentTarget.id.slice(5))[0].value);
				
				$.post('/admin/add', {item_name: e.currentTarget.id.slice(5), 
										name: $("#input-"+e.currentTarget.id.slice(5))[0].value}, function(x) {
					if(x=='yes') {
						alert('success');
					}
				}).fail(function() { alert('err'); });
			});
		}
	});
});
