(function(){
    /**
     * Data layer that needs to be fleshed out
     */
    var app = angular.module("VoterApp");
    app.service('DataService', ['ApiService', function(ApiService){
        let processResponse = function(response){
            if(response == "false"){
                return false;
            }
            return response;
        };
        this.GetCompetitions = function(){
            let dfd = $.Deferred();
            let responsePromise = ApiService.Post({
                "Method": "GetCompetitionList"
            });
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };

        this.GetCompetition = function(id){
            let dfd = $.Deferred();
            let responsePromise = ApiService.Post({
                "Method": "GetCompetition",
                "Id": id
            });
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };

        this.AddComp = function(form){
            let dfd = $.Deferred();
            let postData = $.extend(true, form, {
                "Method": "CreateCompetition"
            });
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };

        this.RemoveComp = function(form){
            let dfd = $.Deferred();
            let postData = $.extend(true, form, {
                "Method": "DeleteCompetition"
            });
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };

        this.AddCouple = function(compId, form){
            let dfd = $.Deferred();
            let postData = $.extend(true, form, {
                "Method": "AddCouple",
                "Id": compId
            });
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };

        this.SaveCouple = function(couple){
            let dfd = $.Deferred();
            let postData = $.extend(true, couple, {
                "Method": "SaveCouple"
            });
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.DeleteCouple = function(couple){
            let dfd = $.Deferred();
            let postData = {
                "Method": "DeleteCouple",
                "Id": couple.Id
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.ActivateCompetition = function(id){
            let dfd = $.Deferred();
            let postData = {
                "Method": "MakeCompetitionCurrent",
                "Id": id
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.CloseCompetition = function(id){
            let dfd = $.Deferred();
            let postData = {
                "Method": "CloseCompetition",
                "Id": id
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.DeleteCompetition = function(id){
            let dfd = $.Deferred();
            let postData = {
                "Method": "DeleteCompetition",
                "Id": id
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.DeActivateCompetition = function(id){
            let dfd = $.Deferred();
            let postData = {
                "Method": "MakeCompetitionNotCurrent",
                "Id": id
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.OpenCompetition = function(id){
            let dfd = $.Deferred();
            let postData = {
                "Method": "OpenCompetition",
                "Id": id
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.GetCurrentCompetition = function(){
            let dfd = $.Deferred();
            let postData = {
                "Method": "GetCurrentCompetition"
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.SubmitVotes = function(placements){
            let dfd = $.Deferred();
            let postData = $.extend(true, placements, {
                "Method": "Vote"
            });
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.CheckSession = function(){
            let dfd = $.Deferred();
            let postData = {
                "Method": "CheckSession"
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.GetCompetitionPlacements = function(){
            let dfd = $.Deferred();
            let postData = {
                "Method": "GetCompetitionPlacements"
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.Login = function(form){
            let dfd = $.Deferred();
            let postData = $.extend(true, form, {
                "Method": "Login"
            });
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
        this.CheckLogin = function(){
            let dfd = $.Deferred();
            let postData = {
                "Method": "CheckLogin"
            };
            let responsePromise = ApiService.Post(postData);
            responsePromise.done(function(response){
                //handle data
                dfd.resolve(processResponse(response));
            });
            return dfd.promise();
        };
    }]);
})();
