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

		// Append the new note to the element with id="myList"
		// $('#myList').append('<a href="#" class="list-group-item" id="note' + numItems + '" value="1" onClick="complete('+numItems+')">');
		
		$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' +(numItems+1)+ '" data-comp="false"></li>');
		$('#note' + numItems).append('<h4 class="list-group-item-heading"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' + item + '</h4><i class="fa fa-times fa-2x fa-fw remove" aria-hidden="true"></i><i class="fa fa-square-o fa-2x fa-fw" aria-hidden="true" id="check"></i>');

		// if there isn't content in text area don't add anything extra
		if($('#myComment').val() == "") {
			// $('#myList').append('');
		} else {
			// Remove any html or white space on input
			var comment = $('#myComment').val().trim();
			if(isHTML(comment)) {
				comment = $(comment)[0].textContent;
			}
			comment = comment.trim();

			// append the information from the text area to the li
			$('#note' + numItems).append('<p class="list-group-item-text desc">' + comment + '</p>');

		}

		// add item to list of entries
		entries.push(item);
		// console.log(entries);
		// increment number of items
		numItems = numItems + 1;

		// Reset input boxes
		$('#myText').val('');
		$('#myComment').val('');
	}
});

// ******************************************************** //
// 		jQuery Function to change stylings when li clicked	//
// 		 - Checked off and change color						//
// ******************************************************** //
$('ul').delegate('#check', 'click', function () {
	$listElem = $(this).parent();
	if ($listElem.data("comp")) {
		// task is complete
		$listElem.data("comp", false);
		$listElem.find('.desc').css("display", "block");
		$listElem.find('#check').attr('class', 'fa fa-square-o fa-2x fa-fw');
		$listElem.appendTo('#myList');
	} else {
		// task is not complete
		$listElem.data("comp", true);
		$listElem.find('.desc').css("display", "none");
		$listElem.find('#check').attr('class', 'fa fa-check-square fa-2x fa-fw');		
		$listElem.appendTo('#otherList');
	}
});

// ******************************************************** //
// 		jQuery Function to remove an li element 			//
// 		 - x icon											//
// ******************************************************** //
$('ul').delegate('.remove', 'click', function () {
	$(this).parent().remove();
});

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
function tick() {
	console.log("!");
    var d = new Date();
    var amPm = (d.getHours() >= 12) ? 'PM' : 'AM';
    var time = (d.getHours()) + ':' + (d.getMinutes()) + ' ' + amPm;
    $('#time').html(time);
    var date = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    $('#date').html(date);
    t = setTimeout(tick,5000);
}

$(document).ready(function () {
	tick();
});
