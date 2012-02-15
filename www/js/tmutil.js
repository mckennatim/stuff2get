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

function initializeLinks(){
	var adeflks = new Array();
	var odeflk = new Object();
	odeflk.place = 'MA Farmers Markets';
	odeflk.address = 'List of Mass Farmers Markets';
	odeflk.phone = '781-893-8222';
	odeflk.url = "http://www.massfarmersmarkets.org/";
	odeflk.lat = 'MA Farmers Markets';
	odeflk.lon = 'MA Farmers Markets';
	adeflks.push(odeflk);
	localStorage.setItem('LINK01', JSON.stringify(odeflk));
	odeflk.place = 'CapeAnnFreshCatch CSF';
	odeflk.address = 'Gloucester, MA';
	odeflk.phone = '123';
	odeflk.url = "http://www.capeannfreshcatch.org/";
	odeflk.lat = 'cafc';
	odeflk.lon = 'cafc';
	adeflks.push(odeflk);
	localStorage.setItem('LINK02', JSON.stringify(odeflk));
	odeflk.place = 'Whole Foods';
	odeflk.address = '413 Centre Street, Jamaica Plain, MA 02130, United States';
	odeflk.phone = '(617) 553-5401';
	odeflk.url = "http://wholefoodsmarket.com/storespecials/JMP_specials.pdf";
	odeflk.lat = '42.32116';
	odeflk.lon = '-71.11067700000001';
	adeflks.push(odeflk);
	localStorage.setItem('LINK03', JSON.stringify(odeflk));
	odeflk.place = 'Trader Joes';
	odeflk.address = '1317 Beacon Street, Brookline, MA 02446, United States';
	odeflk.phone = '(617) 278-9997';
	odeflk.url = "http://www.traderjoes.com/products.asp";
	odeflk.lat = '42.342062';
	odeflk.lon = '-71.12072';
	adeflks.push(odeflk);
	localStorage.setItem('LINK04', JSON.stringify(odeflk));
	odeflk.place = 'Stop and Shop';
	odeflk.address = '301 Centre Street, Jamaica Plain, MA 02130, United States';
	odeflk.phone = '(617) 522-4305';
	odeflk.url = "http://stopandshop.shoplocal.com/stopandshop/default.aspx?action=entry&amp;pretailerid=-99254&amp;siteid=673&amp;storeID=2598877";
	odeflk.lat = '42.323001';
	odeflk.lon = '-71.10300799999999';
	adeflks.push(odeflk);	
	localStorage.setItem('LINK05', JSON.stringify(odeflk));
	odeflk.place = 'Dorchester Community Food Co-op';
	odeflk.address = ' Codman Square Great Hall (Corner of Washington St. and Talbot Ave. Dorchester, MA)';
	odeflk.phone = '(617) 522-4305';
	odeflk.url = "http://dotcommcoop.wordpress.com/";
	odeflk.lat = '42.2900';
	odeflk.lon = '-71.0718';
	adeflks.push(odeflk);	
	localStorage.setItem('LINK06', JSON.stringify(odeflk));					
}

 