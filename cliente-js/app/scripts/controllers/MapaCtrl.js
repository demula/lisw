'use strict';

angular.module('clienteJsApp')
    .controller('MapaCtrl', ['$scope', '$resource', function ($scope, $resource) {
        // Traer recursos
        var Mapa = $resource('/lisw/api/v2/mapas/:mapaId/?format=json', {mapaId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });
        var Sala = $resource('/lisw/api/v2/salas/:salaId/?format=json', {salaId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });
        var Evento = $resource('/lisw/api/v2/eventos/:eventoId/?format=json', {eventoId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });
        var Expositor = $resource('/lisw/api/v2/expositores/:expositorId/?format=json', {expositorId: '@id'},
            {
                'get': {method: 'GET'},
                'list': { method: 'GET', isArray: false }
            });

        $scope.mapa;
        $scope.sala;
        $scope.eventos_filtered = [];
        $scope.expositores_filtered = [];

        var mapa = Mapa.get({mapaId: 1}, function (m) {
            $scope.mapa = mapa;
            $scope.drawSalas();
        });

        var sala;
        var eventos = Evento.list(function () {
            eventos = eventos.objects;
        });
        var expositores = Expositor.list(function () {
            expositores = expositores.objects;
        });

        // Pintar mapa
        $scope.mapaStyle = {
            'background-color': 'white',
            'background-position': '1px 0px',
            'background-repeat': 'no-repeat'
        };
        $scope.infoPanelStyle = {
            'height': '469px',
            'overflow-y': 'scroll'
        };
        $scope.drawMapa = function () {
            $scope.mapaStyle['background-image'] = 'url("/' + $scope.mapa.imagen + '")';
            /*aquí va la resolución de la imagen*/
            $scope.mapaStyle['width'] = '663px';
            $scope.mapaStyle['height'] = '469px';
        }

        // Pintar salas en el mapa
        $scope.drawSalas = function () {
            for (var i in $scope.mapa.salas) {
                var sala = $scope.mapa.salas[i]
                var puntos = sala.puntos.split(',');
                var shape = new Kinetic.Polygon({
                    points: puntos,
                    fill: sala.color,
                    opacity: 0,
                    // custom attr
                    id: sala.id,
                    nombre: sala.nombre
                });
                $scope.shapesLayer.add(shape);
            }
            $scope.drawMapa();
            $scope.stage.add($scope.shapesLayer);
            $scope.stage.add($scope.tooltipLayer);
        }

        // Pintar tooltip
        $scope.updateTooltip = function (tooltip, x, y, text) {
            tooltip.getText().setText(text);
            tooltip.setPosition(x, y);
            tooltip.show();
        }

        // Setup de kinetic
        $scope.stage = new Kinetic.Stage({
            container: 'container',//id del div
            width: 663,  //aquí va la resolución de la imagen otra vez
            height: 469
        });
        $scope.shapesLayer = new Kinetic.Layer();
        $scope.tooltipLayer = new Kinetic.Layer();

        $scope.tooltip = new Kinetic.Label({
            opacity: 0.75,
            visible: false,
            listening: false,
            text: {
                text: '',
                fontFamily: 'Calibri',
                fontSize: 18,
                padding: 5,
                fill: 'white'
            },
            rect: {
                fill: 'black',
                pointerDirection: 'down',
                pointerWidth: 10,
                pointerHeight: 10,
                lineJoin: 'round',
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: 10,
                shadowOpacity: 0.5
            }
        });
        $scope.tooltipLayer.add($scope.tooltip);

        // Acciones
        $scope.stage.on('mouseover', function (event) {
            var shape = event.targetNode;
            shape.setOpacity(0.5);
            $scope.shapesLayer.draw();
        });
        $scope.stage.on('mouseout', function (event) {
            var shape = event.targetNode;
            shape.setOpacity(0);
            $scope.shapesLayer.draw();
            $scope.tooltip.hide();
        });
        $scope.stage.on('mousemove', function (event) {
            var shape = event.targetNode;
            var mousePos = $scope.stage.getMousePosition();
            var x = mousePos.x;
            var y = mousePos.y - 5;
            $scope.updateTooltip($scope.tooltip, x, y, shape.attrs.nombre);
        });
        $scope.stage.on('click', function (event) {
            var shape = event.targetNode;
            sala = Sala.get({salaId: shape.attrs.id}, function (s) {
                $scope.sala = sala;
                $scope.eventos_filtered = _.filter(eventos, function(evento){
                    return evento.sala.id == sala.id;
                });
                $scope.expositores_filtered = _.filter(expositores, function(expositor){
                    return expositor.sala.id == sala.id;
                });
                $scope.salaStyle['color'] = $scope.sala.color;
            });
        });

        // tooltip redraw animation
        var anim = new Kinetic.Animation(null, $scope.tooltipLayer);
        anim.start();
    }]);

