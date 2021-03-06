var entries= [];
var numItems = 0;


// ******************************************************** //
// 		JS Function to fix Name    							//
// 		 - Eliminates white space							//
//		 - Capiltalizes name								//
// ******************************************************** //
function toName(s) {
	// remove characters that aren't a-zA-Z
	s = s.replace( /[\s\n\r]+/g, ' ' );
	// separate all the words into an array
	var words = s.split(" ");

	var final = "";
	for (var i = 0; i < words.length; i++) {
		// set first letter of a word to uppercase
		final += words[i].charAt(0).toUpperCase() 
		if(words[i].length > 1)
			// set rest of the letters of each word to lowercase
			final += words[i].substring(1, words[i].length).toLowerCase();
		final += " ";
	}
	return final;
}

// ******************************************************** //
// 		JS Function to determine if HTML 					//
// 		 - Returns true if string contains html tags		//
// ******************************************************** //
function isHTML(str) {
	var a = document.createElement('div');
	a.innerHTML = str;
	for (var c = a.childNodes, i = c.length; i--; ) {
		if (c[i].nodeType == 1) 
			return true; 
	}
	return false;
}




// ******************************************************** //
//		JQuery Function to enable "enter" 					//
//		 - When enter hit, "add note" button clicked		//
// ******************************************************** //
$("#myText").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});
// ******************************************************** //
//		JQuery Function to enable "enter" 					//
//		 - When enter hit, "add note" button clicked		//
// ******************************************************** //
$("#myComment").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});

// ******************************************************** //
//		JQuery Function for Add Item Button 				//
//		 - When element with id="AddItemButton" clicked,	//
//			add note 										//
// ******************************************************** //
$('#addItemButton').click(function() {
	// make sure there is text in the item field
	if($('#myText').val() == "") {
		alert("Please enter an item");
	}
	else {

		// Remove any html or white space on input, capitalize the words
		var item = $('#myText').val().trim();
		if(isHTML(item)) {
			item = $(item)[0].textContent;
		}
		item = toName(item).trim();

		var comment = "";

		// Append the new note to the element with id="myList"
		// $('#myList').append('<a href="#" class="list-group-item" id="note' + numItems + '" value="1" onClick="complete('+numItems+')">');
		
		$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + new Date().getTime() + '" data-comp="false"></li>');
		$('#note' + numItems).append(
			'<h4 class="list-group-item-heading">'
				// + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' 
				+ '<strong>' + item + '</strong>' 
			+ '</h4>'
			+ '<button class="btn-custom remove" type="button"><i class="fa fa-times fa-2x fa-fw " aria-hidden="true"></i></button>' 
			+ '<button class="btn-custom" id="check" type="button"><i class="fa fa-square-o fa-2x fa-fw" aria-hidden="true"></i></button>'
		);

		// if there isn't content in text area don't add anything extra
		if($('#myComment').val() == "") {
			// $('#myList').append('');
		} else {
			// Remove any html or white space on input
			comment = $('#myComment').val().trim();
			if(isHTML(comment)) {
				comment = $(comment)[0].textContent;
			}
			comment = comment.trim();

			// append the information from the text area to the li
			$('#note' + numItems).append('<p class="list-group-item-text desc" style="display: block;">' + comment + '</p>');

		}

		// add item to list of entries
		entries.push({
			taskName: item, 
			description: comment, 
			created: new Date().getTime(), 
			completed: 0,
			removed: false
		});
		// increment number of items
		numItems = numItems + 1;

		console.log("----\nAfter addition: " + numItems + " items");
		console.log(entries);
		localStorage["newTab_SimpleList_tasks"] = JSON.stringify(entries);
		console.log(localStorage["newTab_SimpleList_tasks"]);
		

		// Reset input boxes
		$('#myText').val('');
		$('#myComment').val('');
		$('#myText').focus();
	}
});

// ******************************************************** //
// 		jQuery Function to change stylings when li clicked	//
// 		 - Checked off and change color						//
// ******************************************************** //
$('ul').delegate('#check', 'click', function () {
	$listElem = $(this).parent();
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].created == $(this).parent().attr('value')) {
			if ($listElem.data("comp")) {
				// task was complete
				entries[i].completed = 0;
			} else {
				// task is now complete
				entries[i].completed = new Date().getTime();
			}
		}
	}
	if ($listElem.data("comp")) {
		// task was complete
		$listElem.data("comp", false);
		$listElem.find('.desc').css("display", "block");
		$listElem.find('#check > i').attr('class', 'fa fa-square-o fa-2x fa-fw');
		$listElem.appendTo('#myList');
	} else {
		// task is now complete
		$listElem.data("comp", true);
		$listElem.find('.desc').css("display", "none");
		$listElem.find('#check > i').attr('class', 'fa fa-check-square fa-2x fa-fw');		
		$listElem.appendTo('#otherList');
	}
	localStorage["newTab_SimpleList_tasks"] = JSON.stringify(entries);
	calculateCompletionRate()
});

// ******************************************************** //
// 		jQuery Function to remove an li element 			//
// 		 - x icon											//
// ******************************************************** //
$('ul').delegate('.remove', 'click', function () {
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].created == $(this).parent().attr('value')) {
			entries[i].removed = true;
			entries.splice(i, 1);
			console.log("----\nAfter remove:");
			console.log(entries);
			break;
		}
	}
	localStorage["newTab_SimpleList_tasks"] = JSON.stringify(entries);
	console.log(localStorage["newTab_SimpleList_tasks"]);
	$(this).parent().remove();
	calculateCompletionRate()
});

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
function tick() {
	// console.log("!");
    var d = new Date();
    var amPm = (d.getHours() >= 12) ? 'PM' : 'AM';
    var hours = (d.getHours() > 12) ? d.getHours() - 12 : d.getHours();
    var time = hours + ':' + ((d.getMinutes()<10?'0':'') + d.getMinutes()) + ' ' + amPm;
    $('#time').html(time);
    var date = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    $('#date').html(date);
    t = setTimeout(tick,5000);
}

function timeConvert(milli) {
    var seconds = (milli / 1000).toFixed(1);
    var minutes = (milli / (1000 * 60)).toFixed(1);
    var hours = (milli / (1000 * 60 * 60)).toFixed(1);
    var days = (milli / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
}

function getShortDate(d) {
	d = new Date(d)
	return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function calculateCompletionRate() {
	var time_diff = 0
	var month_year = []
	var first_created = new Date().getTime(),
		last_created = 0,
		last_completed = 0;
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].completed > 0) {
			time_diff += (entries[i].completed - entries[i].created); // completed - created
		}
		if (entries[i].created < first_created) { first_created = entries[i].created; }
		if (entries[i].created >= last_created) { last_created = entries[i].created; }
		if (entries[i].completed > last_completed) { last_completed = entries[i].created; }
	}
	time_diff /= entries.length; // average time to complete a task
	
	analysis_html = ''
	analysis_arr = [
		{name: 'Avg. Completion Time:', id: 'completion_time', data: (time_diff == 0) ? '' : timeConvert(time_diff)},
		// {name: 'Completion Rate:', id: 'completion_rate', data: time_rate},
		{name: 'First Task Created:', id: 'first_created', data: (first_created == 0) ? '' : getShortDate(first_created)},
		{name: 'Last Task Created:', id: 'last_created', data: (last_created == 0) ? '' : getShortDate(last_created)},
		{name: 'Last Task Completed:', id: 'last_completed', data: (last_completed == 0) ? '' : getShortDate(last_completed)},
	]
	for (i = 0; i < analysis_arr.length; i++) {
		if (analysis_arr[i].data != '') {
			analysis_html += 
				'<div class="col-sm-3 col-xs-6">'
					+ '<h5 class="product">' + analysis_arr[i].name + '</h5>'
					+ '<p class="product" id="' + analysis_arr[i].id + '">' + analysis_arr[i].data + '</p>'
				+ '</div>'
		}
	}
	$('#analysis').html(analysis_html)	
}

$(document).ready(function () {
	tick();

	if (localStorage["newTab_SimpleList_tasks"] != "") {
		entries = JSON.parse(localStorage["newTab_SimpleList_tasks"]);
	}
	// entries = [["help", "idk", 1], ["vir", "thakor", 2]];
	for (var i = 0; i < entries.length; i++) {
		if (!entries[i].removed && entries[i].completed == 0) {
			$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + entries[i].created + '" data-comp="false"></li>');
			$('#note' + numItems).append(
				'<h4 class="list-group-item-heading">'
					// + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' 
					+ '<strong>' + entries[i].taskName + '</strong>' 
				+ '</h4>'
				+ '<button class="btn-custom remove" type="button"><i class="fa fa-times fa-2x fa-fw " aria-hidden="true"></i></button>' 
				+ '<button class="btn-custom" id="check" type="button"><i class="fa fa-square-o fa-2x fa-fw" aria-hidden="true"></i></button>'
			);
			$('#note' + numItems).append('<p class="list-group-item-text desc" style="display: block;">' + entries[i].description + '</p>');
		} else if (!entries[i].removed) {
			$('#otherList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + entries[i].created + '" data-comp="true"></li>');
			$('#note' + numItems).append(
				'<h4 class="list-group-item-heading">'
					// + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' 
					+ '<strong>' + entries[i].taskName + '</strong>' 
				+ '</h4>'
				+ '<button class="btn-custom remove" type="button"><i class="fa fa-times fa-2x fa-fw " aria-hidden="true"></i></button>' 
				+ '<button class="btn-custom" id="check" type="button"><i class="fa fa-check-square fa-2x fa-fw" aria-hidden="true"></i></button>'
			);
			$('#note' + numItems).append('<p class="list-group-item-text desc" style="display: none;">' + entries[i].description + '</p>');

		}
		numItems++;
	}
	console.log("----\nAfter load: " + numItems + " items");
	console.log(entries);

	calculateCompletionRate()
});
