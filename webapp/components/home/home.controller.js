(function() {
    'use strict';
    angular.module('home')
        .controller('HomeController', homeCtrl);

    /*@ngInject*/
    function homeCtrl($scope, activeDirectory) {
        $scope.personList = [];

        $scope.colors = ['#1abc9c', '#37d078', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', 'black'];
        $scope.addPerson = addPerson;
        $scope.removePerson = removePerson;
        $scope.toogleSelect = toogleSelect;
        $scope.getSelectedColor = getSelectedColor;


        function addPerson(person) {
            if (person) {
                var index = _.findIndex($scope.personList, function(p) {
                    return person.username === p.username;
                });

                if (index !== -1) {
                    return;
                }

                $scope.isFetchingUser = true;
                activeDirectory.getAccountInfo(person.username).then(function(respons) {
                    var userInfo = respons.data[0];
                    userInfo.isSelected = true;
                    userInfo.color = getRandomColor();
                    $scope.personList.push(userInfo);
                    $scope.isFetchingUser = false;
                }, function(error) {
                    $scope.isFetchingUser = false;
                    throw error;
                });

            }
        }

        function removePerson(person) {
            _.remove($scope.personList, function(value) {
                return value.username === person.username;
            });
        }

        function toogleSelect(person) {
            person.isSelected = !person.isSelected;
        }

        function getRandomColor() {
            if ($scope.personList.length === 0) {
                return $scope.colors[0];
            }

            var lastColor = _.last($scope.personList).color;
            var lastColorIndex = _.findIndex($scope.colors, function(val) {
                return lastColor === val;
            });

            var retval = $scope.colors[(lastColorIndex + 1) % ($scope.colors.length - 1)];

            return retval;
        }

        function getSelectedColor(person) {
            return person.isSelected ? person.color : 'bg-active';
        }
    }
})();