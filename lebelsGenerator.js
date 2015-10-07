var xml, xmlNames = [];
var map = new Object();

function genOutput(){
	clearData();
	parseXMLIfNeed();
	genTags();
	genMapping();
}
function clearData(){
	$('#tagsOutput')[0].value = '';
	$('#mappingOutput')[0].value = '';
}
function parseXMLIfNeed(){
	debugger;
	if (!xml){
		xml = $('#customLabelsLastXml')[0].value;
		var xmlDoc = $.parseXML( xml );
  		xml = $( xmlDoc );
		var fullNameNodes = xml.find( 'fullName' );
		
		for(var i in fullNameNodes){
			try{
				var fullName = fullNameNodes[i].firstChild.nodeValue; ////var fullName = fullNameNodes[i].childNodes[0].data;
				
				// Remove the prefix name from the full name
				var prefixName = $('#prefixName')[0].value;
				// to do..
				var fullNameWithoutPrefix = fullName.replace(prefixName,'');

				xmlNames.push(fullNameWithoutPrefix.toLowerCase());
			}catch(e){
				break;
			}
		}
	}
}
function genTags(){
	var prefixName = $('#prefixName')[0].value;
	var categories = $('#categories')[0].value;
	var language = $('#language')[0].value;
	var wordList = $('#labelsArray')[0].value.split(/[\n,]+/);


	var lebels='';
	for (var i in wordList){
		var word = wordList[i].trim();
		var find = ' ';
		var re = new RegExp(find, 'g');
		var wordWithUnderline = word.replace(re, "_");

		var foundIndex = xmlNames.indexOf(wordWithUnderline.toLowerCase());
		if (foundIndex == -1){
			// add to map
			map[word] = '{!$Label.'+prefixName+wordWithUnderline+'}';

			// Create the label tags hirrarchy
			var label = '<labels>\n'
							+'\t<fullName>'+prefixName+wordWithUnderline+'</fullName>\n'
					        +'\t<categories>'+ categories +'</categories>\n'
					        +'\t<language>'+ language +'</language>\n'
					        +'\t<protected>false</protected>\n'
					        +'\t<shortDescription>'+prefixName+wordWithUnderline+'</shortDescription>\n'
					        +'\t<value>'+word+'</value>\n'
						+'</labels>\n';
			lebels+=label;
			xmlNames.push(wordWithUnderline);
		}else{
			console.log(word+' has exist');
			map[word] = '{!$Label.'+prefixName+xmlNames[foundIndex]+'} - (was exist)';
		}
	}
	$('#tagsOutput')[0].value = lebels;
}
function genMapping(){
	var res = '';
	for (var property in map) {
	    if (map.hasOwnProperty(property)) {
	        res+= property + ' : ' +map[property]+'\n';
	    }
	}
	$('#mappingOutput')[0].value = res;
}