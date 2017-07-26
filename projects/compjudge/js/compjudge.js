var  Header = Backbone.View.extend({
    el: "header",
    initialize: function(){
        this.path = "/compjudge";
        this.render();
    },
    render: function(){
        var template, self = this;
        $.get(this.path + "/content/header.php", function(response){
            template = _.template(response, {});
            self.$el.html(template);
        });
        return this;
    }
});

var Nav = Backbone.View.extend({
    el: "nav",
    pages: [],
    initialize: function(){
        this.path = "/compjudge";
        this.render();
    },
    render: function(){
        var template, self = this;
        $.get(this.path + "/content/nav.php", function(response){
            template = _.template(response, {});
            self.$el.html(template);
        });
        return this;
    }
});
/*window.headerSection = new Header();
window.navSection = new Nav();*/