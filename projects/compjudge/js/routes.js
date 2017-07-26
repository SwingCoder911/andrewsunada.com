var Routes = Backbone.Router.extend({
    routes: {
      '': 'login'
    },

    initialize: function() {

    },
    login: function() {
        if(true)
        this.header = new Header();
        this.nav = new Nav();
    }
});

window.routes = new Routes();
Backbone.history.start();
