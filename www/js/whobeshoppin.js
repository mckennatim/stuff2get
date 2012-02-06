var serviceURL = "http://" + location.host + "/stuff2get/services/";

$('#yourlists').bind('pageinit', function(event) {
	console.log('in bind pageinit for yourlists');
	var lists = new cookieList("lists");
	thelists = lists.items();
	llen=thelists.length;
	//alert(llen);
	if (llen==0){
		$.mobile.changePage( $('#dontknowyou') );
	}else if (llen==1){
		onelist = thelists[0];
		onearr = onelist.split(".");
		var rep = onearr[0];
		var lis = onearr[1];
		console.log('about to try to load food2buy.html');
		location.href= 'food2buy.html?repo=' + rep + '&list=' + lis;
	}else {
		$.each(thelists, function(index, alist) {
			alistsp = alist.split(".");
			rep = alistsp[0];
			lis = alistsp[1];
			$('#allyourlists').append('<li><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" >Repo: ' + rep + '& List: ' + lis + '</a></li>');
		});
		console.log(thelists.length);
		$('#aboutyl').append('ducks are people too ');
		$('#allyourlists').listview('refresh');
	}
});

//load thelist page to start
$('#dontknowyou').bind('pageinit', function(event) {
	console.log('in bind pageinit');
	$("#repo").val( createRandomWord(6) );
	//$('#dontknowyou').listview('refresh');
});

var repo;
var list;
var email;
var userd;
var uid;
var isnew;

$("#newsetup").click(function (e) {
	e.stopImmediatePropagation();
    e.preventDefault();
    repo = $("#repo").val();
    list = $("#list").val();
    email = $("#email").val();
    $.ajax({
	     type: "GET",
	     url: serviceURL + "newsetup.php",
	     data: "repo=" + repo + "&list=" + list + "&email=" +email,
	     dataType: "json",
	     success: function(da){
	      	//alert(da.items);
			userd = da.items;
			console.log(userd);
			$.each(userd, function(index, userinfo) {
	      	  	uid = userinfo.uid;
	      	  	isnew = userinfo.isnew;
			});
			//alert('about to set a cookie');
			var lists = new cookieList("lists");
			lists.add(repo + "." + list);
			$.cookie("repo", "repo", { expires: 700 });
			//alert('set a cookie for repo ');
			$.cookie("list", list, { expires: 700 });
			$.cookie("email", email, { expires: 700 });								
     	}
     });
	//alert("clicked newsetup " + repo + list + email);
    //Do important stuff....
});

$("#joinexist").click(function (e) {
	e.stopImmediatePropagation();
    e.preventDefault();
    repo = $("#repo").val();
    list = $("#list").val();
    email = $("#email").val();
    $.ajax({
	     type: "GET",
	     url: serviceURL + "joinexist.php",
	     data: "repo=" + repo + "&list=" + list + "&email=" +email,
	     dataType: "json",
	     success: function(da){
	      	//alert(da.items);
			userd = da.items;
			$.each(userd, function(index, userinfo) {
	      	  	exists = userinfo.exists;
			});
			console.log(exists);
			if (exists==1) {
				//alert('about to set a cookie');
				var lists = new cookieList("lists");
				lists.add(repo + "." + list);
				$.cookie("repo", "repo", { expires: 700 });
				//alert('set a cookie for repo ');
				$.cookie("list", list, { expires: 700 });
				$.cookie("email", email, { expires: 700 });
				location.href= 'food2buy.html?repo=' + repo + '&list=' + list;					
			}else {
				alert("That list doesn't exist. Want to create a new (setup) list?");
			}					
     	}
     });
	//alert("clicked joinexist");
    //Do important stuff....
});

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
 
//This is not production quality, its just demo code.
var cookieList = function(cookieName) {
	//When the cookie is saved the items will be a comma seperated string
	//So we will split the cookie by comma to get the original array
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
	        //Save the items to a cookie.
	        //EDIT: Modified from linked answer by Nick see 
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
	  }
}  