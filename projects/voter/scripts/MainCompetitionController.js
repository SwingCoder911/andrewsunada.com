(function(){
    var app = angular.module("VoterApp");
    app.controller('MainCompetitionController', ['$scope', 'DataService', 'Competition', '$routeParams', '$location', 'MainCompetition', function($scope, DataService, Competition, $routeParams, $location, MainCompetition){
        const ADDABLE_STATE = "addable";
        const ADDING_STATE = "adding";
        const PENDING_STATE = "pending";
        let init = function(){
            let promise = DataService.GetCurrentCompetition();
            self.Loading = true;
            promise.done(function(data){
                self.loadCompetition(data);
                self.Loading = false;
            });
        },self = this;

        this.loadCompetition = function(data){
            this.Competition = new Competition(data);
        };
        this.login = function(){
            let promise = DataService.CheckLogin();
            promise.done(function(success){
                if(success == "true"){
                    self.loadCompetition(MainCompetition);
                }else{
                    $location.path('/login');
                }
            })

        };
        this.Loading = false;
        this.Competition = {};

        this.ActivateCompetition = function(){
            let promise = DataService.ActivateCompetition(this.Competition.Id);
            promise.done(() => {
                init();
            });
        };
        this.DeActivateCompetition = function(){
            let promise = DataService.DeActivateCompetition(this.Competition.Id);
            promise.done(() => {
                init();
            });
        };
        this.CloseCompetition = function(){
            let promise = DataService.CloseCompetition(this.Competition.Id);
            promise.done(() => {
                init();
            });
        };
        this.OpenCompetition = function(){
            let promise = DataService.OpenCompetition(this.Competition.Id);
            promise.done(() => {
                init();
            });
        };
        this.DeleteCompetition = function(){
            let promise = DataService.DeleteCompetition(this.Competition.Id);
            promise.done(() => {
                $location.path('/competition-list/')
            });
        };

        this.AddCouple = {
            State: ADDABLE_STATE,
            ActivateForm: function(){
                this.State = ADDING_STATE;
            },
            Form: {
                Partner1: "",
                Partner2: ""
            },
            Error: false,
            Execute: function(){
                //Lazy validation
                if(this.Form.Partner1 == "" || this.Form.Partner2 == ""){
                    this.Error = "Please fill out both partners";
                    return;
                }else{
                    this.Error = false;
                }
                self.AddCouple.State = PENDING_STATE;
                let promise = DataService.AddCouple(self.Competition.Id, this.Form);
                promise.done(function(){
                    self.AddCouple.State = ADDABLE_STATE;
                    init();
                });
                promise.fail(function(){
                    //Add fail messaging
                    self.AddCouple.State = ADDABLE_STATE;
                })
            }
        };
        this.ReloadCouples = function(){
            init();
        };
        this.login();
    }]);
})();
