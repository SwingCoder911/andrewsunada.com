var  HomeModel = Backbone.Model.extend({
    load: function(){
        this.container = $(".project-list");
        this.header = this.container.find(".list-header");
        this.list = this.container.find("ul.list-content");
    },
    urlRoot: "/ajax/xkcd/",
}),HomeView = Backbone.View.extend({
    el: ".center",
    initialize: function(){
        this.model = new HomeModel();
        this.render();
    },
    render: function(){
        var self = this;
        this.model.fetch({
            success: function(model, response){
                self.renderCenter(response);
            }
        });
    },
    renderCenter: function(response){
        var image = this.$el.find("img");
        image.attr("src", response.img);
        image.attr("title", response.title);
        this.$el.find(".xkcd-label").html(response.transcript);
    }
}), home, homeView;
$(document).ready(function(){
    homeView = new HomeView();
});
