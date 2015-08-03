if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

function populateStates(){
	var statesList = [
			/*'AL', 'AK',*/ 'AZ',/* 'AR', 'CA', 'CO', 'CT', 'D.C.', 'DE', 'FL',
			'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
			'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
			'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
			'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',*/ 'UT'/*, 'VT',
			'VA', 'WA', 'WV', 'WI', 'WY', 'Puerto Rico', 'American Samoa',
			'Guam', 'Northern Mariana Islands', 'U.S. Virgin Islands',
			'Outside the U.S.'*/
	];

	var stateSelect = document.getElementById('stateSelect');

	for (var i = 0; i < statesList.length; i++){
		state = statesList[i];
		var option = document.createElement("option");
		option.value = state;
		option.innerHTML = state;
		
		stateSelect.appendChild(option);
	}
}

function populateCigaretteBrands(){
	var cigaretteBrands = [
		'Marlboro'/*, 'Camel', 'L&M', 'Newport', 'Dunhill',
		'Pall Mall', 'Winston', 'Parliament'*/
	];

	var cigSelect = document.getElementById('cigaretteBrands');

	for (var i = 0; i < cigaretteBrands.length; i++){
		brand = cigaretteBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		cigSelect.appendChild(option);
	}
}

function populateSmokelessBrands(){
	var smokelessBrands = [
		'Copenhagen'/*, 'Skoal', 'Husky', 'Grizzly', 'Kodiak',
		'Red Man', 'Levi Garrett', 'Longhorn', 'Marlboro',
		'Camel', 'Lucky Strike', 'Knox'*/
	];

	var smokelessSelect = document.getElementById('smokelessBrands');

	for (var i = 0; i < smokelessBrands.length; i++){
		brand = smokelessBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		smokelessSelect.appendChild(option);
	}
}

function populateCigarBrands(){
	var cigarBrands = [
		'ACID'/*, 'Macanudo', 'H. Upmann', 'Ashton', 'Montecristo',
		'Romeo y Julieta', 'Padron'*/
	];

	var cigarSelect = document.getElementById('cigarBrands');

	for (var i = 0; i < cigarBrands.length; i++){
		brand = cigarBrands[i];
		var option = document.createElement("option");
		option.value = brand;
		option.innerHTML = brand;

		cigarSelect.appendChild(option);
	}
}

function roundToTwoPlaces(value){
	return (Math.round((value + 0.00001) * 100) / 100);
}

var findLinksInText = function(text){
	var LINK_PATTERN = /##(https?:\/\/)?([\dA-Za-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?(\?[\w\W]+)?:::([\w\W])+##/;
	var match = LINK_PATTERN.exec(text);

	var link = null;

	if (match && match.length && match.length > 0){
		var linkText = match[0].replace('##', '').replace('##', '');
		var linkTokens = linkText.split(':::');

		if (!(linkTokens[0].startsWith('http://') || linkTokens[0].startsWith('https://'))){
			linkTokens[0] = 'http://' + linkTokens[0];
		}

		link = "<a href=\"" + linkTokens[0] + "\">" + linkTokens[1] + "</a>";
	}

	var matchText = match ? match[0] : null;

	return {
		matchText: matchText,
		link: link
	};
}

var addLinksToPost = function(post){
	matchResults = findLinksInText(post.content);
	if (matchResults.matchText){
		post.content = post.content.replace(matchResults.matchText, matchResults.link);
	}
}

// Courtesy of StackOverflow user 'Miles'
function daydiff(first, second) {
    return (second-first)/(1000*60*60*24);
}

var generateChartData_twoWeeks = function(nicotineUsages){
	var labels = [];
	var usageData = {
		'cigarette': [0, 0, 0, 0, 0, 0, 0],
		'smokeless': [0, 0, 0, 0, 0, 0, 0],
		'cigar': [0, 0, 0, 0, 0, 0, 0],
		'patch': [0, 0, 0, 0, 0, 0, 0],
		'lozenge': [0, 0, 0, 0, 0, 0, 0],
		'gum': [0, 0, 0, 0, 0, 0, 0],
		'ecig': [0, 0, 0, 0, 0, 0, 0]
	};

	var today = new Date();
	today.setDate(today.getDate() - 14);

	for (var i = 0; i < DAYS_PER_TWO_WEEKS; i+=2){
		var date = new Date(today);
		date.setDate(date.getDate() + i);

		var dateString = (date.getMonth() + 1) + '/' + date.getDate();
		labels.push(dateString);
	}

	for (var i = 0; i < nicotineUsages.length; i++){
		var nextUsage = nicotineUsages[i];
		var dateUsed = new Date(nextUsage.dateUsed);
		var dayOfMonthUsed = dateUsed.getDate();

		var daysFromStart = daydiff(today, dateUsed);
		var usageIndex = Math.round(daysFromStart / 2);
		usageData[nextUsage.nicotineType][usageIndex] += nextUsage.quantityUsed;
	}

	return {
		labels: labels,
		usageData: usageData
	}
}

var generateChartData_oneWeek = function(nicotineUsages){
	var labels = [];
	var usageData = {
		'cigarette': [0, 0, 0, 0, 0, 0, 0],
		'smokeless': [0, 0, 0, 0, 0, 0, 0],
		'cigar': [0, 0, 0, 0, 0, 0, 0],
		'patch': [0, 0, 0, 0, 0, 0, 0],
		'lozenge': [0, 0, 0, 0, 0, 0, 0],
		'gum': [0, 0, 0, 0, 0, 0, 0],
		'ecig': [0, 0, 0, 0, 0, 0, 0]
	};
	// week, 2 weeks, month, year
	// sun, mon, tue...
	// 1/21, 1/23, 1/25...
	// 1/21-1/27, 1/28-2/3, 2/4-2/10, 2/11-2/20 <- remainder?
	// Jul, Aug, Sept...

// --- ONE WEEK AGO FROM TODAY IS THE SAME DAY OF WEEK
	var dayOfWeekIndex = new Date().getDay();
	var startingIndex = dayOfWeekIndex;

	for (var i = 0; i < DAYS_PER_WEEK; i++){
		var dayOfWeek = DAY_OF_WEEK_MAPPINGS[dayOfWeekIndex.toString()];
		labels.push(dayOfWeek);

		dayOfWeekIndex = (dayOfWeekIndex === DAYS_PER_WEEK - 1) ? 0 : (dayOfWeekIndex + 1)
	}

	var calculateDayUsageIndex = function(startIndex, dayIndex){
		var trueIndex = 0;
		while (startIndex !== dayIndex){
			startIndex += 1;
			trueIndex += 1;
			if (startIndex >= DAYS_PER_WEEK){
				startIndex = 0;
			}
		}

		return trueIndex;
	}

	// nicotineUsages.sort(function(a, b){
	// 	return (a.dateUsed - b.dateUsed);
	// });
	for (var i = 0; i < nicotineUsages.length; i++){
		var nextUsage = nicotineUsages[i];
		var dayUsed = new Date(nextUsage.dateUsed).getDay();

		var usageIndex = calculateDayUsageIndex(startingIndex, dayUsed);
		usageData[nextUsage.nicotineType][usageIndex] += nextUsage.quantityUsed;
		// increment counts, don't need the sort...?
	}

	return {
		labels: labels,
		usageData: usageData
	}
}

var chartDataFunctionMappings = {
	'week': function(nicotineUsages){
		return generateChartData_oneWeek(nicotineUsages);
	},
	'two weeks': function(nicotineUsages){
		return generateChartData_twoWeeks(nicotineUsages);
	}
}

function generateChartData(nicotineUsages, nicotineTypes, timespan){
	var datasetList = [];
	var chartAxisData = chartDataFunctionMappings[timespan](nicotineUsages);

	if (nicotineTypes.includes('cigarette')){
		console.log('num 1');
		datasetList.push({
            label: "Cigarettes used",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: chartAxisData.usageData['cigarette']
        });
	}
	if (nicotineTypes.includes('smokeless')){
		console.log('num 2');
		datasetList.push({
            label: "Dips/pouches taken",
            fillColor: "rgba(255,130,188,0.2)",
            strokeColor: "rgba(255,130,188,1)",
            pointColor: "rgba(255,130,188,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(255,130,188,1)",
            data: chartAxisData.usageData['smokeless'] 
        });
	}
	if (nicotineTypes.includes('cigar')){
		console.log('num 3');
		datasetList.push({
            label: "Cigars used",
            fillColor: "rgba(142, 209, 79,0.2)",
            strokeColor: "rgba(142, 209, 79,1)",
            pointColor: "rgba(142, 209, 79,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(142, 209, 79,1)",
            data: chartAxisData.usageData['cigar'] 
        });
	}
	if (nicotineTypes.includes('ecig')){
		
	}
	if (nicotineTypes.includes('lozenge')){
		console.log('num 4');
		datasetList.push({
            label: "Nicotine lozenges used",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: chartAxisData.usageData['lozenge'] 
        });
	}
	if (nicotineTypes.includes('patch')){
		
	}
	if (nicotineTypes.includes('gum')){
		
	}

	console.log('nuh nuh, nuh nuhhh: ' + datasetList);
	var data = {
	    labels: chartAxisData.labels,
	    datasets: datasetList
	};
	var options = {
	    ///Boolean - Whether grid lines are shown across the chart
	    scaleShowGridLines : true,
	    //String - Colour of the grid lines
	    scaleGridLineColor : "rgba(0,0,0,.05)",
	    //Number - Width of the grid lines
	    scaleGridLineWidth : 1,
	    //Boolean - Whether to show horizontal lines (except X axis)
	    scaleShowHorizontalLines: true,
	    //Boolean - Whether to show vertical lines (except Y axis)
	    scaleShowVerticalLines: true,
	    //Boolean - Whether the line is curved between points
	    bezierCurve : true,
	    //Number - Tension of the bezier curve between points
	    bezierCurveTension : 0.4,
	    //Boolean - Whether to show a dot for each point
	    pointDot : true,
	    //Number - Radius of each point dot in pixels
	    pointDotRadius : 4,
	    //Number - Pixel width of point dot stroke
	    pointDotStrokeWidth : 1,
	    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	    pointHitDetectionRadius : 20,
	    //Boolean - Whether to show a stroke for datasets
	    datasetStroke : true,
	    //Number - Pixel width of dataset stroke
	    datasetStrokeWidth : 2,
	    //Boolean - Whether to fill the dataset with a colour
	    datasetFill : true,
	    //String - A legend template
	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
	};

	return {
		data: data,
		options: options
	};
}