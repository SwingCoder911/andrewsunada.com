(function(){
    var app = angular.module("VoterApp");
    app.directive('coupleItem', function(){
        return{
            scope: {
                couple: '=coupleItem'
            },
            link: function(scope, elem, attrs, ctrl){
                scope.editMode = false;
                scope.form = {
                    partner1: scope.couple.Partner1.slice(0),
                    partner2: scope.couple.Partner2.slice(0)
                };
                scope.toggleEdit = function(){
                    scope.editMode = !scope.editMode;
                };
                scope.deleteItem = function(){
                    var promise = ctrl.DeleteItem(scope.couple);
                    promise.done(() =>{
                        scope.$parent.$parent.competitionController.ReloadCouples();
                    });
                };
                scope.saveChanges = function(){
                    scope.couple.Partner1 = scope.form.partner1.slice(0);
                    scope.couple.Partner2 = scope.form.partner2.slice(0);
                    var promise = ctrl.SaveItem(scope.couple);
                    promise.done(() =>{
                        scope.toggleEdit();
                    });

                };
                scope.cancelChanges = function(){
                    scope.form = {
                        partner1: scope.couple.Partner1.slice(0),
                        partner2: scope.couple.Partner2.slice(0)
                    };
                    scope.toggleEdit();
                };
            },
            controller: ['$scope', 'DataService', function($scope, DataService){
                this.SaveItem = function(couple){
                    return DataService.SaveCouple(couple);
                };
                this.DeleteItem = function(couple){
                    return DataService.DeleteCouple(couple);
                };
            }],
            templateUrl: 'scripts/components/couple-item/couple-item.tmpl.html'
        }
    });
})();
