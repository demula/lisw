'use strict';

angular.module('clienteJsApp', ['ui.bootstrap', 'ngCookies', 'ngResource'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/mapa', {
                templateUrl: 'views/mapa.html',
                controller: 'MapaCtrl'
            })
            .when('/personas', {
                templateUrl: 'views/personas.html',
                controller: 'PersonasCtrl'
            })
            .when('/eventos', {
                templateUrl: 'views/eventos.html',
                controller: 'EventosCtrl'
            })
            .when('/expositores', {
                templateUrl: 'views/expositores.html',
                controller: 'ExpositoresCtrl'
            })
            .when('/administracion', {
                templateUrl: 'views/administracion.html',
                controller: 'AdministracionCtrl'
            })
            .otherwise({
                redirectTo: '/mapa'
            });
    }])
    .run(['$rootScope', '$location', '$cookieStore', function ($rootScope, $location, $cookieStore) {

        $rootScope.user = $cookieStore.get('user') || 'no_cookie_in_browser';
        $cookieStore.remove('user');

    }]);
