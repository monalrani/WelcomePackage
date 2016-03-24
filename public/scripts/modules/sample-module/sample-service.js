define(['angular', './sample-module'], function(angular, sampleModule) {
    'use strict';

    sampleModule.value('version', '0.1');
    
    sampleModule.factory('sampleFactory', ['$http','$rootScope', function($http,$rootScope) {
    	console.log("In SampleFactory");
		 function getTestMessage(successHandler) {
		    	$http.get('http://predix-sample-service.run.aws-usw02-pr.ice.predix.io/rest/testMessage')
		    	.success(function(response) {
		    		successHandler(response);
		            console.log("getTestMessage got an success response: " + response);
		        }).error(function(response) {
		            console.log("getTestMessage got an error response: " + JSON.stringify(response));
		        })
	        }
		 function getMapMarkers(successHandler) {
			 $http.get('http://predix-sample-service.run.aws-usw02-pr.ice.predix.io/rest/map/markers')
			 .success(function(response) {
				 successHandler(response);
				 console.log("getMapMarkers got an success response: " + response);
			 }).error(function(response) {
				 console.log("getMapMarkers got an error response: " + JSON.stringify(response));
			 })
		 }
	    	return {
	    		getTestMessage : getTestMessage,
	    		getMapMarkers : getMapMarkers
	        }
    }])

    return sampleModule;
});
