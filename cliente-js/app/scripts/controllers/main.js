'use strict';

angular.module('clienteJsApp')
    .controller('navbarCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (elem) {
            return ($location.path().split('/')[1] == elem ? 'active' : '');
        };
    }])
    .controller('loginCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

        $scope.isUserLoggedIn = function () {
            return $rootScope.username != undefined;
        }

        $scope.login = function () {
            $http.get('/lisw/login.json')
                .success(function(data, status, headers, config){
                    //$rootScope.csrf = data.match(/name='csrfmiddlewaretoken' value='([A-Za-z0-9]*)'/gi)[0].split("'")[3];
                    $rootScope.csrf = data.csrf;
                    function transform(data){
                        return "username="+data['username']+"&password="+data['password'];
                    }
                    $http.post('/lisw/login.json',
                               { 'username':$scope.username,'password':$scope.password },
                               {headers: {'X-CSRFToken' : $rootScope.csrf,
                                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                                transformRequest: transform
                               })
                        .success(function(data, status, headers, config){
                            console.log(data);
                            if (data.errors == undefined){
                                $rootScope.username = data.username;
                                $rootScope.password = data.username;
                            } else {
                                console.log(data.errors);
                            }

                        })
                        .error(function(data, status, headers, config){
                            console.log('Error al autenticar');
                            $rootScope.username = undefined;
                            $rootScope.password = undefined;
                            $scope.username = "";
                            $scope.password = "";
                        });
                })
                .error(function(data, status, headers, config){
                    console.log('Error al obtener codigo xcsrf para autenticacion');
                });

        };
        $scope.logout = function () {
            $http.get('/lisw/logout/')
                .success(function(data, status, headers, config){
                    console.log(data);
                    $rootScope.username = undefined;
                    $rootScope.password = undefined;
                    $scope.username = "";
                    $scope.password = "";
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
    }])
    .controller('PersonasCtrl', ['$scope', '$resource', function ($scope, $resource) {
        var Asistente = $resource('/lisw/api/v2/asistentes/:asistenteId/?format=json', {asistenteId:'@id'},
            {'list': { method: 'GET', isArray: false }});
        $scope.asistentes = [];
        var asistentes = Asistente.list(function() {
            $scope.asistentes = asistentes.objects;
        });


        var Conferenciante = $resource('/lisw/api/v2/conferenciantes/:conferencianteId/?format=json', {conferencianteId:'@id'},
            {'list': { method: 'GET', isArray: false }});
        $scope.conferenciantes = [];
        var conferenciantes = Conferenciante.list(function() {
            $scope.conferenciantes = conferenciantes.objects;
        });
        //var e = Evento.get({eventoId:1}, function() {
        //  $scope.eventos.push(e);
        //});
    }])
    .controller('EventosCtrl', ['$scope', '$resource', function ($scope, $resource) {
        var Evento = $resource('/lisw/api/v2/eventos/:eventoId/?format=json', {eventoId:'@id'},
            {'list': { method: 'GET', isArray: false }});
        $scope.eventos = [];
        var eventos = Evento.list(function() {
            $scope.eventos = eventos.objects;
        });
        //var e = Evento.get({eventoId:1}, function() {
        //  $scope.eventos.push(e);
        //});

        $scope.eventosRows = [];
        var updateEventosRow = function() {
            //$scope.eventosRows = _.range(Math.ceil(eventos.objects.length/2));
            var eventosRows = [];
            for (var i = 0; i < Math.ceil($scope.eventos.length/2)+1; i++){
               eventosRows.push($scope.eventos.slice(i*2, i*2+2));
            }
            $scope.eventosRows = eventosRows;
        }
        $scope.$watch('eventos', updateEventosRow, true);
    }])
    .controller('ExpositoresCtrl', ['$scope', '$resource', function ($scope, $resource) {
        var Expositor = $resource('/lisw/api/v2/expositores/:expositorId/?format=json', {expositorId:'@id'},
                                {'list': { method: 'GET', isArray: false }});
        $scope.expositores = [];
        var expositores = Expositor.list(function() {
            $scope.expositores = expositores.objects;
        });
        //var e = Evento.get({eventoId:1}, function() {
        //  $scope.eventos.push(e);
        //});
        $scope.expositoresRows = [];
        var updateExpositoresRow = function() {
            //$scope.expositoresRows = _.range(Math.ceil(expositores.objects.length/2));
            var expositoresRows = [];
            for (var i = 0; i < Math.ceil($scope.expositores.length/2)+1; i++){
                expositoresRows.push($scope.expositores.slice(i*2, i*2+2));
            }
            $scope.expositoresRows = expositoresRows;
        }
        $scope.$watch('expositores', updateExpositoresRow, true);
    }]);

