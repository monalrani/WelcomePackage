define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('HomePageCtrl', ['$scope', '$rootScope', 'JsonService', 'sampleFactory', function ($scope, $rootScope, JsonService, sampleFactory) {
    	/*$scope.lastWeekChatArr = [{'image-src':'../images/Lorenzo_Simonelli.png', 'name':'Lorenzo Simonelli', 'message':'As a world leader in advanced technologies and services, GE Oil & Gas is well positioned to foster growth in India\'s domestic production - from extraction to transportation to end use.'},
                              {'image-src':'../images/Clay_Johnson.jpg', 'name':'Clay Johnson', 'message':'A great machine continues to get better. The LM6000-PF+ aeroderivative turbine takes power availability, efficiency & reliability to even greater heights'}];*/
    	$scope.lastMonthChatArr = [{'image-src':'../images/Ganesh_Bell.jpg', 'name':'Ganesh Bell', 'message':'FLX360 flying lead, multi-function subsea connection system. Innovative design increases long term equipment reliability and operating efficiency'},
                               {'image-src':'../images/Jeff_Connelly.jpg', 'name':'Jeff Connelly', 'message':'Enlarging fuel flexibility for Frame 5 DLN Gas Turbines. Maximizing gas turbine fuel flexibility without compromising efficiency or emissions performances'},
                               {'image-src':'../images/Kelly_Lafnitzegger.jpg', 'name':'Kelly Lafnitzegger', 'message':'Driving development with the Digital Solutions. Today, technology and the Internet are seen as new avenues to economic growth'},
                               {'image-src':'../images/Lorraine_Bolsinger.jpg', 'name':'Lorraine Bolsinger', 'message':'Response Max. A Predictivity solution to significantly increase maintenance efficiency while reducing cost and time'}];
   
       /* $scope.markersList = [{'latitude':'17.571375','longitude':'78.434186','title':'Tech Mahindra','name':'Tech Mahindra Technology Center','address':'Bhadurpally, Hyderabad'},
                              {'latitude':'17.459052','longitude':'78.371432','title':'Tech Mahindra','name':'Tech Mahindra Learning World','address':'Hitech City, Hyderabad'},
                              {'latitude':'18.375379','longitude':'73.948975','title':'Tech Mahindra','name':'Tech Mahindra Pvt. Limited','address':'Hinjewadi, Pune'},
                              {'latitude':'28.502488','longitude':'77.395935','title':'Tech Mahindra','name':'Tech Mahindra Pvt. Limited','address':'Noida'}
                              ];*/
        $rootScope.chartData = [[1397102460000, 11.4403],
                                 [1397139660000, 13.1913],
                                 [1397177400000, 12.8485],
                                 [1397228040000, 10.975],
                                 [1397248260000, 12.9377],
                                 [1397291280000, 13.3795],
                                 [1397318100000, 13.0869],
                                 [1397342100000, 17.3758]];
        /*$rootScope.chartData2 = {"series":[[1397102460000, 11.4403],
                                           [1397139660000, 13.1913],
                                           [1397177400000, 12.8485],
                                           [1397228040000, 10.975],
                                           [1397248260000, 12.9377],
                                           [1397291280000, 13.3795],
                                           [1397318100000, 13.0869],
                                           [1397342100000, 17.3758]]
                               };*/
        
        
        
        JsonService.get().then(function (msg) {
        	console.log(msg.data);
        	$scope.lastWeekChatArr = msg.data;
        });
        
        $scope.submitClicked = function($event) {
        	debugger;
        	console.log($scope.chatText);
        	var area = document.querySelector('iron-autogrow-textarea');
        	var chatText = area.value;
      	  	console.log(chatText);
      	  	var chatObj = {"image-src":"", 'name':"Logged User"};
      	  	chatObj.message = chatText;
      	  	$scope.lastWeekChatArr.push(chatObj);
      	  	$scope.lastMonthChatArr.push(chatObj);
      	  	$('#chattext').val('');
      	  	area.textarea.value='';
      	  	/*var util = require('util');
      	  	fs.writeFileSync('/sample-data/last-week-chat.json', util.inspect($scope.lastWeekChatArr) , 'utf-8');*/
        }
        
        sampleFactory.getTestMessage(function (response) {
        	console.log("getTestMessage got an response: in controller" + response);
        });
        
        sampleFactory.getMapMarkers(function (response) {
        	console.log("getMapMarkers got an response: in controller" + response);
        	$scope.markersList = response;
        });
        $scope.data = '[' +
        '{ "firstName":"John" , "lastName":"Doe" },' +
        '{ "firstName":"Anna" , "lastName":"Smith" },' +
        '{ "firstName":"Peter" , "lastName":"Jones" } ]';

        
        
    }]);
});
