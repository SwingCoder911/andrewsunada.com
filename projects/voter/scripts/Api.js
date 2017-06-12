(function(){
    var app = angular.module("VoterApp");
    app.service('ApiService', function($http){
        this.Post = function(postData){
            let dfd = $.Deferred();
            let config = {
                "Content-Type": 'application/x-www-form-urlencoded'
            };

            $http({
                method: "POST",
                url: "includes/api/call.php",
                data: $.param(postData),
                headers : config
            })
            .success(function(response){
                dfd.resolve(response);
            })
            .error(function(error){
                dfd.fail(error);
            });
            return dfd.promise();
        };
    });
})();
