(function(){
    var app = angular.module("VoterApp");
    app.directive('adminNav', function(){
        return{
            templateUrl: 'scripts/components/admin-nav/admin-nav.tmpl.html'
        }
    });
})();
