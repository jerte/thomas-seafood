$(document).ready(function() {
	$(".add").click(function(e1) {
		if($("#" + e1.currentTarget.id + " p").text()) {
			var form = "<form class=\"add-form\" id=\"form-"+ e1.currentTarget.id.slice(4) + 
					   "\"><input type=\"text\" id=\"input-" + e1.currentTarget.id.slice(4) + 
					   "\"><input type=\"submit\"></form>";
			$("#"+ e1.currentTarget.id).html(form);
			
			$(".add-form").submit(function(e) {
				$.post('/admin/add', {item_name: e.currentTarget.id.slice(5), 
										name: $("#input-"+e.currentTarget.id.slice(5))[0].value}, function(x) {
					if(x=='yes') {
						alert('success');
					}
				}).fail(function() { alert('err'); });
			});
		}
	});

	$(".add-pic").click(function(e) {
		if($("#" + e.currentTarget.id + " p").text()) {
			
			var form = "<form class=\"add-pic-form\" id=\"form-" + e.currentTarget.id.slice(8) + 
						"\" action=\"/admin/add/image\" method=\"post\" encType=\"multipart/form-data\">" + 
						"<input name=\"item_name\" value=\"" + e.currentTarget.id.slice(8) + "\">" + 
						"<input name=\"img\" type=\"file\">" + 
						"<input type=\"submit\"></form>";
			console.log(form);
			$("#" + e.currentTarget.id).html(form);
		}
	});
});
