define(['angular', './sample-module', ], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('SunBurstChartCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    	
    	function bubbleChart(){
    	
    		var
			width = 900,
			height = 900,
			radius = 15 * Math.max(width, height) / 100,
			x = d3.scale.linear().range([0, 2 * Math.PI]),
			y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
			padding = 5,
			duration = 1500;

		//var color = d3.scale.category20();

    	var color = d3.scale.ordinal().range(["white","#3C8BF5","#49A908","#9AE666"]);
		
		//var color = d3.scale.linear().domain([-100, 126]).range(["#EFEDF5", "#756BB1"]);
		//var color = d3.scale.threshold().domain([-100, 0, 126]).range(["red", "white", "blue"]);
		//var color = d3.scale.log().domain([0, 900000000]).range(["red", "green"]);

		var div = d3.select("#vis");

		//format currency
		var format = d3.format(",f");

		var format1 = d3.format("%");

		var content = d3.select("#col2");

		var content1 = d3.select("#annotation");

		div.select("img").remove();

		var svg = d3.select("#myBubbleChart")
			.append("svg")
			.attr("width", 350)
			.attr("height", 350)
			.append("g")
			.attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

		//div.append("p")
		// .attr("id", "intro")
		//.text("Click to zoom!");

		var partition = d3.layout.partition()
			.value(function(d)
			{
				return d.appropriation14;
			});

		var arc = d3.svg.arc()
			.startAngle(function(d)
			{
				return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
			})

			.endAngle(function(d)
			{
				return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
			})

			.innerRadius(function(d)
			{
				return Math.max(0, y(d.y));
			})

			.outerRadius(function(d)
			{
				return Math.max(0, y(d.y + d.dy));
			});

		// d3.json("budget.json", function(json) {
		//   var nodes = partition.nodes({children: json});

		d3.json("/sample-data/budget.json", function(error, root) {


			// var path = vis.selectAll("path").data(nodes);
			//   path.enter().append("path")
			var path = svg.selectAll("path")
				.data(partition.nodes(root))
				.enter()
				.append("path")
				.attr("id", function(d, i)
				{
					return "path-" + i;
				})

				.attr("d", arc)
				.attr("fill-rule", "evenodd")
				.style("fill", function(d)
				{
					return color((d.parent ? d : d.children).depth);
				})

				.on("click", click)
				.on("mouseover", mouseover)
      			.on("mouseout", mouseout);

			//add text
			var text = svg.selectAll("text")
				.data(partition.nodes(root));

			var textEnter = text
				.enter()
				.append("text")
				//starting opacity
				//hides all those but the inner ring
				.style("fill-opacity", function(d)
				{
						//if the depth is 1, innermost, then it's seen
						if (d.depth === 1)
						{
							return 1;
						}
						//else the depth is not one, then it's hidden
						else
						{
							return 0;
						}
				})
				//color fill
				//#000000 is black
				.style("fill", "#ffffff")
				.attr("text-anchor", function(d)
				{
					return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
				})

				.attr("dy", ".2em")
				//checks for multiline names
				.attr("transform", function(d)
				{
					var multiline = (d.name || "")
						.split(" ")
						.length > 1.5, angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90, rotate = angle + ( multiline ? -.5 : 0);

					return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
				})

				.on("click", click)
				//added mouseover and mouseout for the text as well.
				.on("mouseover", mouseover)
      			.on("mouseout", mouseout);

			//1st row of text
			textEnter
				.append("tspan")
				.attr("x", 0)
				.text(function(d)
				{
					return d.depth ? d.name.split(" ")[0] : "";
				});

			//2nd row of text
			textEnter
				.append("tspan")
				.attr("x", 0)
				.attr("dy", ".9em")
				.text(function(d)
				{
					return d.depth ? d.name.split(" ")[1] || "" : "";
				});

			//3rd row
			textEnter
				.append("tspan")
				.attr("x", 0)
				.attr("dy", ".9em")
				.text(function(d)
				{
					return d.depth ? d.name.split(" ")[2] || "" : "";
				});

			//fourth row (if necessary)
			textEnter
				.append("tspan")
				.attr("x", 0)
				.attr("dy", ".9em")
				.text(function(d)
				{
					return d.depth ? d.name.split(" ")[3] || "" : "";
				});

			//click function
			function click(d)
			{
				path
				.transition()
				//duration is predefined above at 1500 (1.75 seconds)
				.duration(duration)
				.attrTween("d", arcTween(d));

				// Somewhat of a hack as it relies on arcTween updating the scales.
				text
				.style("visibility", function(e)
				{

					return isParentOf(d, e) ? null : d3.select(this).style("visibility");
				})


				.transition()
				.duration(duration)
				.attrTween("text-anchor", function(d)
				{
					return function()

					{
						return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
					};
				})

				.attrTween("transform", function(d)
				{
					var multiline = (d.name || "")
						.split(" ")
						.length > 1.5;

					return function()
					{
						var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90, rotate = angle + ( multiline ? -.5 : 0);
						return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
					};
				})

				//.style("fill-opacity", function(e)
				//{
				//	return isParentOf(d, e) ? 1 : 0;
				//})
				//.style("fill-opacity", function(d)
				//{
						//if the depth is 1, innermost, then it's seen
				//		if (d.depth === 1)
				//		{
				//			return 1;
				//		}

						//else if (d.depth == 2 && d.children)
						//{
						//	return 1;
						//}
						//else the depth is not one, then it's hidden
				//		else
				//		{
				//			return 0;
				//		}
				//})

				.each("end", function(e)
				{
					d3.select(this)
					.style("visibility", isParentOf(d, e) ? null : "hidden");
				});

			}

			//mouseover function which will send the values to the legend
			function mouseover(d)
			{
				$("#col2").text("");
				content.append("div").attr("id","iw-container").append("div").attr("class","iw-title").append("i").attr("class","fa fa-info-circle")
				.attr("style","padding-right:20px;font-weight:bold;")
    			.text("	"+d.name)// + " - 2013 appropriations: " + d.appropriation13 + " - Which was a " + d.percentChange13 + "% change of the previous year.")
				content.append("p").attr("style","padding-left:10px !important;")
				.text("  Total Orders: " + format(d.appropriation14/10))
				content.append("p").attr("style","padding-left:10px !important;")
				.text("  New Customers: " + format((d.appropriation13)))
				content.append("p").attr("style","padding-left:10px !important;")
				.text(" Total Product Lines: " + format((d.appropriation12)))
				content1.append("p")
				.attr("id", "annotate")
				.text(d.annotation)
				if (d.annotation2 != null)
				{
				content1.append("br")
				content1.append("p")
				.text(d.annotation2);
				}

  			}

			//mouseout function which removes the values and replaces them with a blank space
  			function mouseout(d)
  			{

    			content.html(' ');
    			content1.html(' ');
    			
//    			content1.append("p").text('Order and Product Line information for Last 4 Quarters including Current');
    			$("#col2").text("Order and Product Line information for Last 4 Years");

  			}

		});

		d3.selectAll("input").on("change", function change()
		{
			var value = this.value === "show" ? 1 : 0;

			d3.selectAll("text")
			.style("fill-opacity", function(d)
				{
					if (value === 1)
					{
						return 1;
					}
					else
					{
						//if the depth is 1, innermost, then it's seen
						if (d.depth === 1)
						{
							return 1;
						}
						//else the depth is not one, then it's hidden
						else
						{
							return 0;
						}
					}
				});
		});

		function isParentOf(p, c)
		{
			if (p === c)
				return true;
			if (p.children)
			{
				return p.children.some(function(d)
				{
					return isParentOf(d, c);
				});
			}
			return false;
		}

		//to determine the innermost ring
		//function isInnermost(d)
		//{
			//if (d.children)
			//{
				//return true;
			//}
			//else
			//{
				//return false;
			//}
		//}

		// function colour(d) {
		//   if (d.children) {
		//     // There is a maximum of two children!
		//     var colours = d.children.map(colour),
		//         a = d3.hsl(colours[0]),
		//         b = d3.hsl(colours[1]);
		//     // L*a*b* might be better here...
		//     return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
		//   }
		//   return d.colour || "#fff";
		// }

		// Interpolate the scales!
		function arcTween(d)
		{
			var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]), yd = d3.interpolate(y.domain(), [d.y, 1]), yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
			return function(d, i)
			{
				return i ? function(t)
				{
					return arc(d);
				} : function(t)
				{
					x.domain(xd(t));
					y.domain(yd(t)).range(yr(t));
					return arc(d);
				};
			};
		}

		function maxY(d)
		{
			return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
		}

		// http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
		function brightness(rgb)
		{
			return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
		}
    		
    		
    		/*var width = 960,
    	    height = 700,
    	    radius = (Math.min(width, height) / 2) - 10;

    	var formatNumber = d3.format(",d");

    	var x = d3.scale.linear()
    	    .range([0, 2 * Math.PI]);

    	var y = d3.scale.sqrt()
    	    .range([0, radius]);

    	var color = d3.scale.category20c();

    	var partition = d3.layout.partition()
    	    .value(function(d) { return d.size; });

    	var arc = d3.svg.arc()
    	    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d[0].x))); })
    	    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d[0].x + d[0].dx))); })
    	    .innerRadius(function(d) { return Math.max(0, y(d[0].y)); })
    	    .outerRadius(function(d) { return Math.max(0, y(d[0].y + d[0].dy)); });

    	var svg = d3.select("#myBubbleChart").append("svg")
    	    .attr("width", width)
    	    .attr("height", height)
    	  .append("g")
    	    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    	d3.json("/sample-data/flare1.json", function(error, root) {
    	  if (error) throw error;
    	  svg.selectAll("path")
    	      .data(partition.nodes(root))
    	    .enter().append("path")
    	      .attr("d", arc)
    	      .style("fill", function(d) {
    	    	  
    	    	  for(var i=0;i<=d;i++){
    	    		  debugger;
    	    		  return color((d[i].children ? d[i] : d[i].parent).name); 
    	    	  }
    	    	  })
    	      .on("click", click)
    	    .append("title")
    	      .text(function(d) { return d[0].name + "\n" + formatNumber(d[0].value); });
    	});

    	function click(d) {
    	  svg.transition()
    	      .duration(750)
    	      .tween("scale", function() {
    	        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
    	            yd = d3.interpolate(y.domain(), [d.y, 1]),
    	            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    	        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
    	      })
    	    .selectAll("path")
    	      .attrTween("d", function(d) { return function() { return arc(d); }; });
    	}

    	d3.select(self.frameElement).style("height", height + "px");*/
    		
    		/*var diameter = 960,
    	    format = d3.format(",d"),
    	    color = d3.scale.category20c();
    	var bubble = d3.layout.pack()
    	    .sort(null)
    	    .size([diameter, diameter])
    	    .padding(1.5);

    	var svg = d3.select("#myBubbleChart").append("svg")
    	    .attr("width", diameter)
    	    .attr("height", diameter)
    	    .attr("class", "bubble");

    	d3.json("/sample-data/flare.json", function(error, root) {
    	  if (error) throw error;

    	  var node = svg.selectAll(".node")
    	      .data(bubble.nodes(classes(root))
    	      .filter(function(d) { return !d.children; }))
    	    .enter().append("g")
    	      .attr("class", "node")
    	      .attr("id",function(d) { return d.packageName; })
    	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    	  node.append("title")
    	      .text(function(d) { return d.className + ": " + format(d.value); });

    	  node.append("circle")
    	      .attr("r", function(d) { return d.r; })
    	      .style("fill", function(d) { 
    	    	  return color(d.packageName); });

    	  node.append("text")
    	      .attr("dy", ".3em")
    	      .style("text-anchor", "middle")
    	      .text(function(d) { return d.className.substring(0, d.r / 3); });
    	  
    	  node.on('click' , function(d){ 
    		  
    		  node.append("circle")
    	      .attr("r", function(d) { return d.r; })
    	      .style("fill", function(d) { 
    	    	  return color(d.packageName); });
    		  
    		  node.append("text")
    	      .attr("dy", ".3em")
    	      .style("text-anchor", "middle")
    	      .text(function(d) { return d.className.substring(0, d.r / 3); });
    		  
    		  $('#'+d.packageName+' circle').css("fill","green");
    		  node.append("circle")
    	      .attr("r", function(d) { return d.r; })
    	      .style("fill", function(d) { 
    	    	  alert(d.packageName);
    	    	  return "#ffffff"; });
    		  alert("on click:"+d.packageName) });
    	});

    	// Returns a flattened hierarchy containing all leaf nodes under the root.
    	function classes(root) {
    	  var classes = [];

    	  function recurse(name, node) {
    	    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    	    else classes.push({packageName: name, className: node.name, value: node.size});
    	  }

    	  recurse(null, root);
    	  return {children: classes};
    	}

    	d3.select(self.frameElement).style("height", diameter + "px");*/
    	}
    	
    	
    	bubbleChart();
    	
    	$rootScope.json1 = [
	                     {
	                    	    //"select": '<a href=\"http://www.google.com\">Search</a>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ''
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4700178902",
	                    	    "customerPO": "Silva",
	                    	    "customer": "Alexander",
	                    	    "product": "silvaalexander@scentric.com",
	                    	    "more": "(823) 415-2224"
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ""
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ""
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ""
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ""
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ""
	                    	  },
	                    	  {
	                    	    //"select": '<paper-checkbox noink></paper-checkbox>',
	                    	    "orderItemNo": "4008786",
	                    	    "customerPO": "4700178902",
	                    	    "customer": "Shell",
	                    	    "product": "Masonellan",
	                    	    "more": ""
	                    	  },
	                    	  {
	                    		  //"select": '<paper-checkbox noink></paper-checkbox>',
		                    	    "orderItemNo": "4008786",
		                    	    "customerPO": "4700178902",
		                    	    "customer": "Shell",
		                    	    "product": "Masonellan",
		                    	    "more": ""
	                    	  },
	                    	  {
	                    		  //"select": '<paper-checkbox noink></paper-checkbox>',
		                    	    "orderItemNo": "4008786",
		                    	    "customerPO": "4700178902",
		                    	    "customer": "Shell",
		                    	    "product": "Masonellan",
		                    	    "more": ""
	                    	  }
	                    	  
	                    	];
    	
    }]);
});
