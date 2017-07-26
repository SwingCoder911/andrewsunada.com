(function($){

	//Create option for padding
	var dropdownWidth = 100;
	var mainField = null;

	$.fn.nesteddropdown = function(options){
		dropdownWidth = (getMeasurement(this, 'width') + getMeasurement(this, 'padding', 'x'));
		mainField = this;
		var settings = $.extend({
			data: []
		}, options),
		listYPosition = getMeasurement(this, 'height') + getMeasurement(this, 'padding', 'y') + getMeasurement(this, 'margin', 'y'),
		containerDiv, ul,
		listStyle = {
			width: dropdownWidth,
			top: this.css('height')
		},
		containerStyle = {
			width: dropdownWidth
		},
		fieldStyle = {
			width: getMeasurement(this, 'width')
		};
		listStyle.top = listYPosition + "px";
		if(!this.is('input') || ((this.attr('type') !== undefined) && (this.attr('type') !== 'text')) || (settings.data.length == 0)){
			return this;
		}
		ul = generateListDom(settings.data);
		this.wrap('<div class="nested-dropdown-container"></div>');
		this.addClass('nested-dropdown-field');
		containerDiv = this.parent('.nested-dropdown-container');
		containerDiv.css(containerStyle);
		containerDiv.append(ul);
		ul.css(listStyle);
		this.css(fieldStyle);
		includeStyles();
		return this;
	};

	var includeStyles = function(){
		$('head').append('<link rel="stylesheet" href="css/nesteddropdown.css" type="text/css" />');
	};

	var generateListDom = function(list){
		var domMap = {}, ul = $('<ul class="nested-dropdown-list"></ul>'), sublist, categoryCount = {},
		getListItem = function(val){
			return $('<li><p class="label">' + val + '</p></li>');
		},
		subListStyle = {
			width: dropdownWidth,
			left: dropdownWidth
		};

		for(var i = 0, datalen = list.length; i < datalen; i++){
			if(list[i].category !== ''){
				if(categoryCount[list[i].category] === undefined){
					sublist = $('<ul class="submenu"></ul>').clone();
					sublist.css(subListStyle);
					domMap[list[i].label] = getListItem(list[i].label);
					sublist.append(domMap[list[i].label]);
					domMap[list[i].category].append(sublist);
					domMap[list[i].category] = domMap[list[i].label];
					categoryCount[list[i].category] = 1;
				}else{
					domMap[list[i].label] = getListItem(list[i].label);
					domMap[list[i].category].after(domMap[list[i].label]);
					categoryCount[list[i].category]++;
				}

			}else{
				domMap[list[i].label] = getListItem(list[i].label);
				ul.append(domMap[list[i].label]);
			}
		}
		return ul;
	};

	var getMeasurement = function(elem, attribute, dimension){
		var temp, tempSet;
		if(dimension === undefined){
			dimension = 'x';
		}
		switch(attribute){
			case 'height':
				return parseInt(elem.css('height').replace(/[^-\d\.]/g, ''));
			break;
			case 'width':
				return parseInt(elem.css('width').replace(/[^-\d\.]/g, ''));
			break;
			case 'padding':
			case 'margin'://Take into account x x x x as well as x x
				temp = elem.css(attribute);
				if(-1 != temp.indexOf(' ')){
					tempSet = temp.split(' ');
					if(dimension === 'x'){
						return parseInt(tempSet[1].replace(/[^-\d\.]/g, '')) * 2;
					}else{
						return parseInt(tempSet[0].replace(/[^-\d\.]/g, '')) * 2;
					}
				}
				return parseInt(elem.css(attribute).replace(/[^-\d\.]/g, '')) * 2;
			break;
		}
	};
	var hasSubmenus = function(li){
		if(li.children('ul').length > 0){
			return true;
		}
	};

	var closeChildrenDropdowns = function(li){
		if(hasSubmenus(li)){
			li.removeClass('clicked');
			li.children('ul').children('li').each(function(){
				closeChildrenDropdowns($(this));
			});
		}
	};

	var checkTopLevel = function(text){
		if(text === ''){
			$('.nested-dropdown-container .nested-dropdown-list').hide();
			$('.nested-dropdown-container .nested-dropdown-list > li').each(function(){
				$(this).show();
			});
			return;
		}
		var results = $('.nested-dropdown-container .nested-dropdown-list > li').length;
		text = text.toLowerCase();

		$('.nested-dropdown-container .nested-dropdown-list > li').each(function(){
			$(this).show();
		});
		$('.nested-dropdown-container .nested-dropdown-list > li').filter(function(){
			var nonMatch = (-1 === $(this).children('p').text().toLowerCase().indexOf(text));
			if(nonMatch){
				results--;
			}
			return nonMatch;
		}).hide();
		if(results === 0){
			$('.nested-dropdown-container .nested-dropdown-list').hide();
		}else{
			$('.nested-dropdown-container .nested-dropdown-list').show();
		}
		return;
	};

	$(document).on('click', '.nested-dropdown-list li > p', function(){
		var item = $(this).parent('li');
		if(hasSubmenus(item)){
			if(!item.hasClass('clicked')){
				item.addClass('clicked');
				item.siblings('li').each(function(){
					closeChildrenDropdowns($(this));
				});
			}else{
				closeChildrenDropdowns(item);
			}
		}else{
			mainField.val($(this).text());
		}
	});

	$(document).on('keyup', '.nested-dropdown-field', function(){
		checkTopLevel($(this).val());
	});

	/**
	  *	Create functionality for up down/sideways arrows
	  */
}(jQuery));