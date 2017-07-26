(function(){
    var app = angular.module("VoterApp");
    app.controller('CompetitionListController', ['$scope', 'DataService', 'Competition', function($scope, DataService, Competition){
        const ADDABLE_STATE = "addable";
        const ADDING_STATE = "adding";
        const PENDING_STATE = "pending";
        let init = function(){
            let compPromise = DataService.GetCompetitions();
            self.Loading = true;
            compPromise.done(function(data){
                self.loadData(data);
                self.Loading = false;
            });
        }, self = this;
        this.loadData = function(rows){
            self.Competitions = [];
            rows.forEach(function(row){
                self.Competitions.push(new Competition(row));
            });
        };
        this.Loading = false;
        this.Competitions = [];
        this.EditComp = function(id){
            for(let i = 0, len = this.Competitions.length; i < len; i++){
                if(this.Competitions[i].Id == id){
                    this.Competitions[i].Edit();
                    return;
                }
            }
        };
        this.DeleteComp = function(id){
            for(let i = 0, len = this.Competitions.length; i < len; i++){
                if(this.Competitions[i].Id == id){
                    this.Competitions[i].Delete();
                    init();
                    return;
                }
            }
        };
        this.AddComp = {
            State: ADDABLE_STATE,
            ActivateForm: function(){
                this.State = ADDING_STATE;
            },
            Form: {
                Name: ""
            },
            Execute: function(){
                self.AddComp.State = PENDING_STATE;
                let promise = DataService.AddComp(this.Form);
                promise.done(function(){
                    self.AddComp.State = ADDABLE_STATE;
                    init();
                });
                promise.fail(function(){
                    //Add fail messaging
                    self.AddComp.State = ADDABLE_STATE;
                })
            }
        };
        init();
    }]);
})();
