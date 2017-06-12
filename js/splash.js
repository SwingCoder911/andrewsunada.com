var  ProjectMenu = Backbone.View.extend({
	el: $("header"),
	events: {
		"click header .nav-icon": "openNav",
		"click header .close-icon": "closeNav"
	},
	navActive: false,
	initialize: function(){
		this.render();
	},
	render: function(){
		this.fillSocial();
		this.fillNav();
	},
	fillSocial: function(){
		var contentTemp, container = this.$el.find('.social-container');
		$.get('/include/social.html', function(response){
			container.html(response);
		});
	},
	fillNav: function(){
		var contentTemp, container = this.$el.find('.nav-container');
		$.get('/include/nav.html', function(response){
			container.html(response);
		});
	},
	openNav: function(){
		this.$el.find('.nav-container').addClass("active");
	},
	closeNav: function(){
		this.$el.find('.nav-container').removeClass("active");	
	}	
});

$(document).ready(function(){
	window.projectMenu = new ProjectMenu({el: $('.splash')});
});

