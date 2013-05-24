'use strict';

angular.module('clienteJsApp').directive('fileBind', function () {
    return function (scope, elm, attrs) {
        elm.bind('change', function (evt) {
            scope.$apply(function () {
                //reset campos
                scope.shapesLayer.children.splice(2,scope.salas.length);
                scope.mapa = new scope.Mapa();
                var path_names = evt.target.value.split('\\')
                scope.mapa.imagen = 'mapas/' + path_names[path_names.length-1];  
                scope.salas = [];
                scope.sala = new scope.Sala();
                scope.sala.nombre = "";
                scope.sala.color = "#33B5E5";
                scope.sala.puntos = "";
                scope.puntos = [];
                

                //cargar imagen
                scope[ attrs.name ] = evt.target.files;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.src = e.target.result;
                    //scope.mapa.imagen = e.target.result;
                    img.onload = function () {
                        scope.$apply(function () {
                            scope.mapaStyle['background-image'] = 'url(' + e.target.result + ')';
                            /*aquí va la resolución de la imagen*/
                            scope.mapaStyle['width'] = img.width + 'px';
                            scope.mapaStyle['height'] = img.height + 'px';
                            scope.infoPanelStyle['height'] = img.height + 'px';

                            scope.stage.setWidth(img.width);
                            scope.stage.setHeight(img.height);
                            scope.fondo.setWidth(img.width);
                            scope.fondo.setHeight(img.height);
                            scope.stage.show();
                            scope.stage.draw();
                        });
                    };
                };
                reader.readAsDataURL(scope.files[0]);
            });
        });
    };
});

angular.module('clienteJsApp')
    .controller('AdministracionCtrl', ['$scope', '$resource','$location', function ($scope, $resource, $location) {
        // Traer recursos
        $scope.Mapa = $resource('/lisw/api/v2/mapas/:mapaId/?format=json', {mapaId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });
        $scope.Sala = $resource('/lisw/api/v2/salas/:salaId/?format=json', {salaId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });
            
        $scope.Condicion = $resource('/lisw/api/v2/condiciones/:condicionId/?format=json', {condicionId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });

        $scope.mapa = new $scope.Mapa();
        $scope.salas = [];
        
            

        $scope.sala = new $scope.Sala();
        $scope.sala.nombre = "";
        $scope.sala.color = "#33B5E5";
        $scope.sala.puntos = "";
        
        $scope.imagen = new Image();
        $scope.puntos = [];


        $scope.addSala = function () {
            var sala = angular.copy($scope.sala);
            var firstAndLastPoint = $scope.puntos[$scope.puntos.length-1];
            var closedPoints = $scope.puntos.concat(firstAndLastPoint);
            sala.puntos = _.flatten(closedPoints).join(",");
            $scope.salas.push(sala);

            var puntos = sala.puntos.split(',');
            var shape = new Kinetic.Polygon({
                points: puntos,
                fill: sala.color,
                opacity: .2,
                // custom attr
                nombre: sala.nombre
            });
            $scope.shapesLayer.add(shape);
            
            $scope.sala = new $scope.Sala();
            $scope.sala.nombre = "";
            $scope.sala.color = "#33B5E5";
            $scope.sala.puntos = "";
            $scope.puntos = [];
        };

        $scope.uploadImagen = function () {
            console.log("Subiendo imagen");
            console.log($scope.files[0]);

//            $http.get('/lisw/upload.json')
//                .success(function(data, status, headers, config){
//                    //$rootScope.csrf = data.match(/name='csrfmiddlewaretoken' value='([A-Za-z0-9]*)'/gi)[0].split("'")[3];
//                    $rootScope.csrf = data.csrf;
//                    function transform(data){
//                        return "username="+data['username']+"&password="+data['password'];
//                    }
//                    $http.post('/lisw/login.json',
//                        { 'username':$scope.username,'password':$scope.password },
//                        {headers: {'X-CSRFToken' : $rootScope.csrf,
//                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//                            transformRequest: transform
//                        })
//                        .success(function(data, status, headers, config){
//                            console.log(data);
//                            if (data.errors == undefined){
//                                $rootScope.username = data.username;
//                                $rootScope.password = data.username;
//                                $rootScope.isStaff = data.staff == "True"? true : false;
//                            } else {
//                                console.log(data.errors);
//                            }
//
//                        })
//                        .error(function(data, status, headers, config){
//                            console.log('Error al autenticar');
//                            $rootScope.username = undefined;
//                            $rootScope.password = undefined;
//                            $rootScope.isStaff = undefined;
//                            $scope.username = "";
//                            $scope.password = "";
//                            $scope.isStaff = false;
//                        });
//                })
//                .error(function(data, status, headers, config){
//                    console.log('Error al obtener codigo xcsrf para autenticacion');
//                });

        };

        $scope.guardarMapa = function () {
            console.log("Guardando mapa");
            $scope.mapa.resource_uri = "";
            var condiciones_resources = [];
            var salas_resources = [];
            for (var i = 0; i< $scope.salas.length;i++){
                var condicion = new $scope.Condicion(); 
                condicion.abierta = true;
                condicion.ip_camara = "192.168.1."+i;
                condicion.ruido_db = -10;
                condicion.temperatura = 24;
                condicion.$save(function(resource, putResponseHeaders) {
                    condiciones_resources.push(resource.resource_uri);
                    if (condiciones_resources.length == $scope.salas.length){
                        for (var i = 0; i< $scope.salas.length;i++){
                            $scope.salas[i].condicion = condiciones_resources[i];
                            $scope.salas[i].$save(function(resource, putResponseHeaders) {
                                salas_resources.push(resource.resource_uri);
                                if (salas_resources.length == $scope.salas.length){
                                    $scope.mapa.salas = salas_resources;
                                    $scope.mapa.$save(function(resource, putResponseHeaders){
                                        $location.path("/mapa/"+resource.id);
                                    });
                                }
                            });
                        } 
                    }
                    
                });
            }
        };


        // Pintar mapa
        $scope.mapaStyle = {
            'background-color': 'white',
            'background-position': '1px 0px',
            'background-repeat': 'no-repeat'
        };
        $scope.infoPanelStyle = {
            'height': '469px'
        };

        // Pintar salas en el mapa
        var drawAddSala = function () {
            $scope.stage.draw();
        };
        //$scope.$watch('salas', drawSalas, true);




        // Setup de kinetic
        $scope.stage = new Kinetic.Stage({
            container: 'container'
        });

        $scope.shapesLayer = new Kinetic.Layer();
        $scope.fondo = new Kinetic.Rect({
            width: 1,
            height: 1,
            opacity: 0
        });
        $scope.shapesLayer.add($scope.fondo);
        
        var currentSala;

        var updateCurrentSala = function() {
            var firstAndLastPoint = $scope.puntos[$scope.puntos.length-1];
            var closedPoints = $scope.puntos.concat(firstAndLastPoint);
            if (currentSala == undefined && $scope.puntos.length > 2){
                currentSala = new Kinetic.Polygon({
                points: closedPoints,
                fill: $scope.sala.color,
                opacity: .2,
                // custom attr
                nombre: $scope.sala.nombre
                });
                $scope.shapesLayer.add(currentSala);
            } else {
                if(currentSala != undefined){
                    currentSala.setPoints(closedPoints);
                    currentSala.setFill($scope.sala.color);
                }
            }
            $scope.stage.draw();
        };
        $scope.$watch('puntos', updateCurrentSala, true);
        $scope.$watch('sala.color', updateCurrentSala, true);

        $scope.stage.add($scope.shapesLayer);


        // Acciones
        $scope.stage.on('click', function (e) {
            var mousePos = $scope.stage.getMousePosition();
            $scope.$apply(function () {
                if(e.ctrlKey){
                    $scope.puntos.pop();
                } else {
                    if(e.button == 0) {
                        $scope.puntos.push([mousePos.x,mousePos.y]);
                    }
                }           
                console.log($scope.puntos);
            });
        });
    }]);

