/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
            .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService', function ($q, predixUserService) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo){
                            deferred.resolve(userInfo);
                        }, function(){
                            deferred.reject({code: 'UNAUTHORIZED'});
                        });
                        return deferred.promise;
                    }]
                }
            })
            .state('dashboards', {
                //parent: 'secure',
                url: '/dashboards',
                templateUrl: 'views/sunburst-chart.html',
	        	controller: 'SunBurstChartCtrl'
               /* templateUrl: 'views/dashboards.html',
                controller: 'DashboardsCtrl'*/
            })
            .state('home', {
            	url: '/home',
            	templateUrl: 'views/home-page.html',
            	controller: 'HomePageCtrl'
            })
            .state('pxcharts', {
                url: '/pxcharts',
                templateUrl: 'views/px-charts.html',
                controller: 'PXChartCtrl'
            })
            .state('bubbleChart', {
                url: '/bubbleChart',
                templateUrl: 'views/bubble-chart.html',
                controller: 'BubbleChartCtrl'
            })
	        .state('centricBubbleChart', {
	        	url: '/centricBubbleChart',
	        	templateUrl: 'views/centric-bubble-chart.html',
	        	controller: 'CentricBubbleChartCtrl'
	        })
	        .state('sunburstChart', {
	        	url:'/sunburstChart',
	        	templateUrl: 'views/sunburst-chart.html',
	        	controller: 'SunBurstChartCtrl'
        })


        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            document.querySelector('px-app-nav').markSelected('/dashboards');
            $state.go('dashboards');
        });

    }]);
});
