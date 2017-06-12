(function(){
    var app = angular.module("VoterApp");
    app.controller('LoginController', ['$location', 'DataService', function($location, DataService){
        var self = this;
        this.Form = {
            Username: "",
            Password: ""
        };
        this.Login = function(){
            if(this.Form.Username == "" || this.Form.Password == ""){
                return;
            }
            this.Loading = true;
            let promise = DataService.Login(this.Form);
            promise.done(function(success){

                if(success == "true"){
                    $location.path("/admin");
                }else{
                    self.Loading = false;
                    self.Form.Username = "";
                    self.Form.Password = "";
                }
            })
        };
        this.Loading = false;
    }]);
})();
