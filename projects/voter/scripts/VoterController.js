(function(){
    var app = angular.module("VoterApp");
    app.controller('VoterController', ['$scope', '$location', 'DataService', 'Competition', function($scope, $location, DataService, Competition){
        let init = function(){
            self.Loading = true;
            let loginPromise = DataService.CheckSession();
            loginPromise.done(function(data){
                if(data == false){
                    initCompetition();
                }else{
                    $location.path("/alreadyvoted")
                }
            });
        },
        initCompetition = function(){
            let compPromise = DataService.GetCurrentCompetition();
            compPromise.done(function(data){
                if(!data){
                    self.Empty = true;
                    console.log("Empty");
                }else{
                    self.loadCompetition(data);
                }
                self.Loading = false;
            });
        }, self = this;
        this.loadCompetition = function(data){
            this.Competition = new Competition(data);
            if(this.Competition.IsClosed){
                $location.path("/unavailable");
            }
            this.Selections.First = this.Competition.Couples.slice();
            this.Selections.Second = this.Competition.Couples.slice();
            this.Selections.Third = this.Competition.Couples.slice();
        };
        this.SetVote = function(couple){
            this.Selected = couple;
        };
        this.SubmitVotes = function(){
            if(!this.CanVote()){
                return;
            }
            this.Loading = true;
            let promise = DataService.SubmitVotes(this.Placements);
            promise.done(function(){
                this.Loading = false;
                $location.path("/thankyou");
            });
        };
        this.CanVote = function(){
            return this.Placements.First != null && this.Placements.Second != null && this.Placements.Third != null;
        };
        this.Placements = {
            First: null,
            Second: null,
            Third: null,
        };
        this.Selections = {
            First: [],
            Second: [],
            Third: []
        };
        this.Events = {
            First: function(){

                this.Selections.Second
            },
            Second: function(){
                console.log("second");
            },
            Third: function(){
                console.log("third");
            },
        }
        this.Competition = {};
        this.Loading = false;
        this.Empty = false;

        init();
    }]);
})();
