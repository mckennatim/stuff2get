var serviceURL = "http://" + location.host + "/stuff2get/services/";

var cookieList = function(cookieName) {
	var cookie = $.cookie(cookieName);
	//Load the items or a new array if null.
	var items = cookie ? cookie.split(/,/) : new Array();
	//Return a object that we can use to access the array.
	//while hiding direct access to the declared items array
	//this is called closures see http://www.jibbering.com/faq/faq_notes/closures.html
	return {
	    "add": function(val) {
	        //Add to the items.
	        items.push(val);
	        //      http://stackoverflow.com/questions/3387251/how-to-store-array-in-jquery-cookie
	        $.cookie(cookieName, items.join(','), { expires: 700 });
	    },
	    "remove": function (val) { 
	        sidx = $.inArray(val, items);//find index of location
	        if (sidx>=-1) {
	        	items.splice(sidx,1);
	        }	        
	        $.cookie(cookieName, items, { expires: 700 }); 
	    },
	    "clear": function() {
	        items = null;
	        //clear the cookie.
	        $.cookie(cookieName, null);
	    },
	    "items": function() {
	        //Get all the items.
	        return items;
	    }
	  };
};

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function cookiesEnabled(){
	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
	if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled){ 
		document.cookie="testcookie";
		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
	}
	return (cookieEnabled);
}

function createRandomWord(length) {
    var consonants = 'bcdfghjklmnpqrstvwxyz',
        vowels = 'aeiou',
        rand = function(limit) {
            return Math.floor(Math.random()*limit);
        },
        i, word='', length = parseInt(length,10),
        consonants = consonants.split(''),
        vowels = vowels.split('');
    for (i=0;i<length/2;i++) {
        var randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
        word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
        word += i*2<length-1 ? randVowel : '';
    }
    return word;
}
 