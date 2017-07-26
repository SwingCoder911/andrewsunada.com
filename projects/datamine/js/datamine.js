$(function(){
	$('.generate').click(function(){
		var postal = $('.postal').val(), category = $('.category').val(), loader = $('img.loading-bar'), form = $('.mining-form'), exporter = $('.export'),
			loaderHidden = false, formValid = true;

		//Validation
		if(postal == ''){
			$('.postal').addClass("error");
			formValid = false;
		}else{
			$('.postal').removeClass("error");
		}
		if(category == ''){
			$('.category').addClass("error");
			formValid = false;
		}else{
			$('.category').removeClass("error");
		}
		if(!formValid){
			return;
		}
		storeCategory(category);
		//Clean up url system
		if(form.hasClass('initial')){
			form.switchClass('initial', 'upper', 300, function(){
				if(loaderHidden){ return;}
				loader.css("display", "block");
			});
			exporter.switchClass('initial', 'upper', 300);
		}else{
			loader.css("display", "block");
		}
		$.get('processRequest.php', {
			'postal_code': postal,
			'category': category
		}, function(response){
			response = JSON.parse(response);
			loader.hide();
			loaderHidden = true;
			if(response.code === 'success'){
				printTable(response);
			}else if (response.code === 'error'){
				printError(response);
			}
		});
	});

	function printTable(response){
		var container = $('.results-container'), messages = $('.messages'), table, data = response.data, row = $("<tr></tr>").clone();
		container.html("");
		messages.html("");
		messages.hide();
		table = $("<table></table>");
		row.addClass("header");
		for(var key in response.headers){
			row.append("<th>" + response.headers[key] + "</th>");
		}
		table.append(row);
		for(var dKey in data){
			row = $("<tr></tr>").clone();
			for(var key in response.headers){
				row.append("<td>" + data[dKey][key] + "</td>");
			}
			table.append(row);
		}
		container.append(table);
		console.log(data);
	};

	function printError(data){
		var container = $('.results-container'), messages = $('.messages'), list, errorMessages = data.errors;
		container.html("");
		messages.html("");
		container.hide();
		messages.addClass('error');
		list = $("<ul></ul>");
		for(var i = 0, dataLength = errorMessages.length; i < dataLength; i++){
			list.append("<li>" + errorMessages[i] + "</li>");
		}
		messages.append(list);
		messages.show();
		console.log(data);
	};

	function storeCategory(category){
		var autoCompleteArray = localStorage.getItem('autocomplete');
		autoCompleteArray = JSON.parse(autoCompleteArray);
		if(!autoCompleteArray){
			autoCompleteArray = [category];
		}
		if(-1 !== autoCompleteArray.indexOf(category)){
			return;
		}
		autoCompleteArray.push(category);
		autoCompleteArray = JSON.stringify(autoCompleteArray);
		localStorage.setItem('autocomplete', autoCompleteArray);
	};

	function getCategory(){
		var autoCompleteArray = localStorage.getItem('autocomplete');
		autoCompleteArray = JSON.parse(autoCompleteArray);
		if(!autoCompleteArray){
			return [];
		}
		return autoCompleteArray;
	};

	/*$('.category').autocomplete({
		source: getCategory(),
		open: function(){
			$("ul.ui-menu").width(172);
		}
	});*/
	var settings = {
		data: [
			{label: "Batman", category: ""},
			{label: "Robin", category: ""},
			{label: "Penguin", category: ""},
			{label: "Joker", category: ""},
			{label: "Bruce Wayne", category: "Batman"},
			{label: "Thomas Wayne", category: "Batman"},
			{label: "Dick Grayson", category: "Robin"},
			{label: "Jason Todd", category: "Robin"},
			{label: "Old", category: "Bruce Wayne"},
			{label: "Robin", category: "Dick Grayson"},
			{label: "Nightwing", category: "Dick Grayson"},
		]
	};
	$('.category').nesteddropdown(settings);
});