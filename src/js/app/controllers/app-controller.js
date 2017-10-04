'use strict';

var $ = require('jquery');
window.jQuery = $;
var Mousetrap = require('mousetrap');
// var moment = require('moment');
window.Tether = require('tether');
// var Popper = require('popper.js');
require('bootstrap');

module.exports = function ($scope, $window, $filter, $http) {

    $scope.player = undefined;
    $scope.players = [];

    $scope.debug = false;
    $scope.floor = 0;
    $scope.ceil = 100;
    $scope.initialValue = 0;
    $scope.value = undefined;
    $scope.interval = 250;
    $scope.gameOver = false;
    $scope.incrementValue = 5;

    var myTimer = undefined;
    $scope.keys = ['e', 'v', 'm'];
    $scope.key1 = 'e';
    $scope.key2 = 'v';
    $scope.key3 = 'm';

    $scope.firstKey = undefined;

    var keysPressed = [];

    function reset() {
        $scope.value = $scope.initialValue;
        $scope.gameOver = false;
        myTimer = undefined;
        keysPressed = [];

        $scope.player = {
            'name': undefined,
            'keystrokes': 0
        };

        sanitizeValue();
    }

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest')
            this.$eval(fn);
        else
            this.$apply(fn);
    };

    function highlight(key) {
        $(key).addClass('active');
    }

    function clearHighlight(key) {
        $(key).removeClass('active');
    }

    function bindKeys() {
        /*Mousetrap.bind($scope.key1 + ' ' + $scope.key2 + ' ' + $scope.key3, function (e) {
            incrementValue();
        });*/

        for (var i = 0; i < $scope.keys.length; i++) {
            Mousetrap.bind($scope.keys[i], function () {
                highlight('#button-'+ parseInt(i+1));
                $scope.simulateKeyPress($scope.keys[i]);
            });

            Mousetrap.bind($scope.keys[i], function () {
                clearHighlight('#button-' + parseInt(i + 1));
            }, 'keyup');
        }


        /*Mousetrap.bind($scope.keys[0], function () {
            highlight('#button-1');
            $scope.simulateKeyPress($scope.keys[0]);
        });

        Mousetrap.bind($scope.keys[1], function () {
            highlight('#button-2');
            $scope.simulateKeyPress($scope.keys[1]);
        });

        Mousetrap.bind($scope.keys[2], function () {
            highlight('#button-3');
            $scope.simulateKeyPress($scope.keys[2]);
        });


        Mousetrap.bind($scope.keys[0], function () {
            clearHighlight('#button-1');
        }, 'keyup');

        Mousetrap.bind($scope.keys[1], function () {
            clearHighlight('#button-2');
        }, 'keyup');

        Mousetrap.bind($scope.keys[2], function () {
            clearHighlight('#button-3');
        }, 'keyup');

        */

        Mousetrap.bind('space', function (e) {
            if (keysPressed.length == 0) {
                highlight('#button-1');
                $scope.simulateKeyPress($scope.keys[0]);
            } else if (keysPressed.length == 1) {
                highlight('#button-2');
                $scope.simulateKeyPress($scope.keys[1]);
            } else if (keysPressed.length == 2) {
                highlight('#button-3');
                $scope.simulateKeyPress($scope.keys[2]);
            }

        });

        Mousetrap.bind('space', function (e) {
            clearHighlight('#button-1');
            clearHighlight('#button-2');
            clearHighlight('#button-3');
        }, 'keyup');
    }

    $scope.init = function () {

        reset();
        bindKeys();

        if (!$scope.debug) {
            startGame();
        }
    };

    function startGame() {
        setTimeout(function () {
            decrementValue();
        }, $scope.interval);
    }

    function gameOver() {
        clearTimeout(myTimer);
        Mousetrap.reset();
        clearHighlight('#button-1');
        clearHighlight('#button-2');
        clearHighlight('#button-3');

        $('#myModal').modal();

        $scope.safeApply(function () {
            $scope.gameOver = true;
        });
    }

    function decrementValue() {
        if ($scope.value > $scope.floor) {
            $scope.safeApply(function () {
                $scope.value--;
            });
        }

        myTimer = setTimeout(function () {
            decrementValue();
        }, $scope.interval);
    }

    function sanitizeValue() {
        if ($scope.value > $scope.ceil) {
            $scope.value = $scope.ceil;
            gameOver();
        }
    }

    function incrementValue() {
        if ($scope.value < $scope.ceil) {
            $scope.safeApply(function () {
                $scope.value += $scope.incrementValue;
                $scope.player.keystrokes++;
                sanitizeValue();
            });
        }
    }

    $scope.simulateKeyPress = function (character) {

        if (character == $scope.keys[0]) {
            keysPressed = [];
            keysPressed.push(character);

        } else if ((character == $scope.keys[1]) && (keysPressed[0] == $scope.keys[0]) && (keysPressed.length == 1)) {
            keysPressed.push(character);

        } else if ((character == $scope.keys[2]) && (keysPressed[1] == $scope.keys[1]) && (keysPressed.length == 2)) {
            keysPressed.push(character);

            incrementValue();
            keysPressed = [];
        }

        /*if (keysPressed[0] != $scope.key1) {
            keysPressed[0] = $scope.key1;
            Mousetrap.trigger($scope.key1);
            console.log(keysPressed);
        } else {
            if (keysPressed[1] != $scope.key2) {
                keysPressed[1] = $scope.key2;
                Mousetrap.trigger($scope.key2);
                console.log(keysPressed);
            } else {
                if (keysPressed[2] != $scope.key3) {
                    keysPressed[2] = $scope.key3;
                    Mousetrap.trigger($scope.key3);
                    console.log(keysPressed);
                    incrementValue();
                } else {

                }
            }
        }*/

        /*if (!$scope.firstKey) {
            $scope.firstKey = character;
        } else {

            if ($scope.firstKey != character) {
                Mousetrap.trigger($scope.key1 + ' ' + $scope.key2);
                $scope.firstKey = undefined;
            }

        }*/

    };

    $scope.submit = function () {
        $('#myModal').modal('hide');

        $scope.players.push({
         'name': $scope.player.name,
         'keystrokes': $scope.player.keystrokes
         });
    };

};