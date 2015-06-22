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
		link = "<a href=\"" + linkTokens[0] + "\">" + linkTokens[1] + "</a>";
	}

	var matchText = match ? match[0] : null;

	return {
		matchText: matchText,
		link: link
	};
}