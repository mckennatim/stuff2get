var thelists;//the lists array
var clists;//the cookie list object
var repo;
var list;
var email;
var userd;
var uid;
var isnew;
var map;
var service;
var infowindow;
var dlat;
var dlon;
var typ;
var directionsService;
var directionsDisplay;

//home_page:  check for url varables and then if shared=0(joinlist) or 1(newlist) else show lists ans links
$('#yourlists').live('pageinit', function(event) {
	console.log('in bind pageinit for yourlists');
    if (cookiesEnabled()==false){
    	alert("Cookies need to be enabled in order for this app to work.");
    	console.log("cookies are not enabled");
    	exit();
    }
    email =$.cookie("email");	
    //see if there is a list in the query string URL vars
//likehttp://10.0.1.18/stuff2get/www/index.html?repo=Mytest&list=Frogs&email=tim@pathboston.com&shared=0
    urlps = getUrlVars();
	console.log(urlps);
	repo = urlps['repo'];
	list= urlps['list'];
	etest =urlps['email']; 
	isshared = urlps['shared'];
	console.log(etest);
	if (etest != undefined) {
		email= urlps['email'];
		$.cookie("email", email);	
	}
	console.log(repo != undefined);
	if (repo != undefined  && list !=undefined){
		if (isshared == 0) { //puts in some fake food items
			theurl =  serviceURL + "newsetup.php";
		} else { //isshared=1
			theurl =  serviceURL + "joinexist.php";
		}	
		impList(); //
	//there are no url vars, so startup by reading lists out of cookies	
	} else {
		clists = new cookieList("lists");
		thelists = clists.items();
		console.log(thelists);
		llen=thelists.length;
		//alert(llen);
		if (llen==0){
			location.href='nolists.html';		
		}else {
			$.each(thelists, function(index, alist) {
				alistsp = alist.split(".");
				rep = alistsp[0];
				lis = alistsp[1];
				$('#allyourlists').append('<li data-theme="b"><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  lis + '</span><br/>repository: ' + rep + '</p></a></li>');
			});
			//rep;
			$("#repo").val(rep);
			console.log(thelists.length);
			$('#aboutyl').append('ducks are people too ');
			$('#allyourlists').listview('refresh');
		}		
	}
	placeLinks();
});

//home->options->list_options: initalization lists lists
$('#listopt').live('pageinit', function(event) {
	clists = new cookieList("lists");
	thelists = clists.items();	
	console.log(thelists);
	$.each(thelists, function(index, alist) {
		alistsp = alist.split(".");
		rep = alistsp[0];
		lis = alistsp[1];
		$('#lioptions').append('<li data-theme="b"><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  lis + '</span><br/>repository: ' + rep + '</p></a></li>');
	});
	$('#lioptions').listview('refresh');	
});

//home->options->link_options:  initalizes links by loading from localStorage
$('#linkopt').live('pageinit', function(event) {
	displayLinks();
});

//page_button: on form that appears in home->options->list_options after you press +newls in header pressing it calls addlist.php with repo and list and then fires newList()
$('body').on('click', "#newlist2", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();    
    repo = $("#repo2").val();
    list = $("#list2").val();
    email =$.cookie("email");	
    theurl =  serviceURL + "addlist.php";
    console.log('in click newlist2 heading to newList with ' + theurl);
	newList();
});

//called by newlist2: adds a list to list_options page and then clears and rebuilds home page (allyourlists)
function newList(){
    $.ajax({
	     type: "GET",
	     url: theurl,
	     data: {repo: repo, list: list, email: email},
	     dataType: "json",
	     success: function(da){
	      	//returns an object with exists=1 or 0
			userd = da.items;
			console.log(userd);
			$.each(userd, function(index, userinfo) {
	      	  	exi = userinfo.exists;
	      	  	console.log(exi);
			});
			//alert('about to set a cookie');
			var lists = new cookieList("lists");
			lists.add(repo + "." + list);	
			$('#lioptions').append('<li data-theme="b"><a href="food2buy.html?repo=' + repo + '&list=' + list + '" data-ajax="false"><p><span style="font-size: 2.25em;">'  +  list + '</span><br/>repository: ' + repo + '</p></a></li>');	
			$('#lioptions').listview('refresh');
			$('#addalist').remove();
			$('#allyourlists').trigger('create');	
			//$('#allyourlists').listview('refresh');						
     	}
    });
}

//called by yourlists.pageinit: creates lists from cookies
function impList(){
    $.ajax({
	     type: "GET",
	     url: theurl,
	     data: {repo: repo, list: list, email: email},
	     dataType: "json",
	     success: function(da){
	      	//returns an object with exists=1 or 0
			userd = da.items;
			console.log(userd);
			$.each(userd, function(index, userinfo) {
	      	  	exi = userinfo.exists;
	      	  	console.log(exi);
			});
			//alert('about to set a cookie');
			var lists = new cookieList("lists");
			lists.add(repo + "." + list);	
			$('#allyourlists').append('<li data-theme="b"><a href="food2buy.html?repo=' + repo + '&list=' + list + '" data-ajax="false"><p><span style="font-size: 2.25em;">'  +  list + '</span><br/>repository: ' + repo + '</p></a></li>');
			$('#allyourlists').listview('refresh');
			location.href= 'index.html';									
     	}
    });
}

//page_button that appears on ListOptions page after you click the header button 'joinls'. Fires the php script that tells the db you joined. Adds the joined list to cookies. Refreshes list in ListOptions 
$('body').on('click', "#joinlist2", function (e) { 
	e.stopImmediatePropagation();
    e.preventDefault();
    repo = $("#repoj").val();
    list = $("#listj").val();
    email = $.cookie("email");
    $.ajax({
	     type: "GET",
	     url: serviceURL + "joinexist.php",
	     data: {repo: repo, list: list, email: email},
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
				$('#lioptions').append('<li data-theme="b"><a href="food2buy.html?repo=' + repo + '&list=' + list + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  list + '</span><br/>repository: ' + repo + '</p></a></li>');
				$('#lioptions').listview('refresh');	
				$('#addalist').remove();					
			}else {
				$('#addalist').remove();
				alert("That list doesn't exist. Want to create a new (setup) list?");
			}					
     	}
     });
});

//header_button on ListOptions adds delete class="delalist" buttons to list items
$('#delst').click(function() {
	console.log('just clicked delete button');
	console.log(thelists);
	$('#allyourlists').empty();
	$.each(thelists, function(index, alist) {
		alistsp = alist.split(".");
		rep = alistsp[0];
		lis = alistsp[1];
		$('#allyourlists').append('<li data-theme="b"><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  lis + '</span><br/>repository: ' + rep + '</p></a><a href="#deletestuff" data-icon="delete" class="delalist" id=' + rep + '.' + lis + '>remove</a></li>');	
	});		
	$('#allyourlists').listview('refresh');
	//empty ul list and rewrite
	return false; 
});

//list_button_class: delete buttons that show up after you hit the delete header button
$('body').on('click', ".delalist", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	var $ell = $(this); //this is delete link pressed
    did = $ell.attr('id'); //the id of that link
    //alert(thelists);
    $(this).closest('li').remove(); //remove the whole <li> that contains this <a>
	clists.remove(did) ;
	thelists = clists.items(); //update this global var first set in  pageinit
	//alert(thelists);
	$('#allyourlists').listview('refresh');
	lp =  did.split("."); //use the original cookie list from pageinit
    repo = lp[0];
    list = lp[1];
    console.log(list); 
    console.log(repo);
    email = $.cookie("email");
    console.log(email);  
    $.ajax({
	     type: "GET",
	     url: serviceURL + "deletelist.php",
	     data: "repo=" + repo + "&list=" + list + "&email=" +email,
	     dataType: "json",
	     success: function(da){console.log("ret from ajax");}
    });		
});   

//list_button_class: up_arrow 
$('body').on('click', ".ashare", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	var $sho = $(this); //this is share link pressed
    did = $sho.attr('id'); //the id of that link
    lp =  did.split("."); //use the original cookie list from pageinit
    repo = lp[0];
    list = lp[1];
    semail = $("#email2").val();
    if (IsEmail(semail)==true) {
     	urri ='mailto:'+ semail  + '?subject=share this list with me' + '&cc=' + email + '&body=Hi, I think it would be cool if we shared this ' + list +' list on our phones. That way when either of us modified it we would see the update. http://' + location.host + '/stuff2get/www/index.html%3Frepo=' + repo + '%26list=' + list + '%26email=' + semail  + '%26shared=1';
    	window.location = urri;
		//alert('clicked ashare ' + semail + repo + list + urri);   	
    } else {
    	alert('That does not seem to be avalid email');  
    }	
});

// ListOptions header navbar buttons//

//header_button: in list_options: that adds a form for joining a list (with a joinlist2 button)
$('body').on('click', "#joinls", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$('#addalist').empty();	
	nform='<p>You would need to know the repo and list names of an existing list.</p><form><div data-role="fieldcontain"><label for="name">Repo:</label><input type="text" name="repo" id="repoj" value=""  /><br><label for="name">List:</label><input type="text" name="list" id="listj" value="" /><input type="submit" data-theme="a" id="joinlist2" value="Join Existing List"/></div></form>';
 	$('#addalist').append(nform);
 	$('#addalist').trigger('create');	
});

//header_button: in list_options: that adds a form for creating a new list (with a newlist2 button)
$('body').on('click', "#newls", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$('#addalist').empty();	
	nform='<p>Accept or choose your own repository name and select a list name. (no spaces or punct., just lettters)</p><form><div data-role="fieldcontain"><label for="name">Repo:</label><input type="text" name="repo" id="repo2" value="' + createRandomWord(6) + '"  /><br><label for="name">List:</label><input type="text" name="list" id="list2" value="" /><input type="submit" data-theme="a" id="newlist2" value="New List"/></div></form>';
 	$('#addalist').append(nform);
 	$('#addalist').trigger('create');
});

//header_button: in list_options: that rebulilds the list with a delete icon and delete links
$('body').on('click', "#deletels", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$('#lioptions').empty();
	$.each(thelists, function(index, alist) {
		alistsp = alist.split(".");
		rep = alistsp[0];
		lis = alistsp[1];
		$('#lioptions').append('<li data-theme="b"><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  lis + '</span><br/>repository: ' + rep + '</p></a><a href="#deletestuff" data-icon="delete" class="delalist" id=' + rep + '.' + lis + '>remove</a></li>');	
	});		
	$('#lioptions').listview('refresh');
	$('#addalist').empty();	
	nform='<p>Pressing the x next to a list will remove it from the device. If there are other users of the list, their data will not be affected.</p>';
 	$('#addalist').append(nform);
 	$('#addalist').trigger('create');		
});

//header_button: in list_options: that rebulilds the list with a up_arrow icon and creates a form below
$('body').on('click', "#sharels", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$('#lioptions').empty();
	$.each(thelists, function(index, alist) {
		alistsp = alist.split(".");
		rep = alistsp[0];
		lis = alistsp[1];
		$('#lioptions').append('<li data-theme="b"><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  lis + '</span><br/>repository: ' + rep + '</p></a><a href="#" data-icon="arrow-u" class="ashare" id=' + rep + '.' + lis + '>remove</a></li>');	
	});		
	$('#lioptions').listview('refresh');
	$('#addalist').empty();	
	nform='<form><div data-role="fieldcontain"><label for="name">Email</label><input type="email" name="email2" id="email2" value="" /></div></form><p>Enter the email address of the person you would like to share with then click on the share arrow on the right side of the list.';
 	$('#addalist').append(nform);
 	$('#addalist').trigger('create');
});

//--------------------------LINK SECTION-------------------------//
//$("#findlks").click(initiate_geolocation); 

//page_button 'SearchForEstablishments' on FindLinks page that checks where you are and searches google for links
$('#findlks').click(function(e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	initiate_geolocation(); //gets device location
	console.log('Lat: ' + dlat + ' ' +   'Lon: ' + dlon );  
	key= $("#squery").val();
	mi= $("#miles").val();
	me = Math.round(mi*1609.34);
	typ = new Array();
	if ($('#groc').attr('checked')){
		typ.push('grocery_or_supermarket');
		key +='market|foods|trader|';
	} 
	if ($('#build').attr('checked')){
		//typ.push('home_goods_store');
		typ.push('hardware_store');
		key +='home|lumber|building|plumbing|';
	} 
	if ($('#farm').attr('checked')){
		key +='farmer|farmer\'s+market|csa|';
	} 		
	$('#foundlinks').empty();	
	initializePlace();//google place search
	return false;
});

//called by #findlks page button on FindLinks page. Sends google place request and then hangs on callback 
function initializePlace() {
  var dloc = new google.maps.LatLng(dlat,dlon);
  map = new google.maps.Map(document.getElementById('map_canvas'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: dloc,
      zoom: 15
    });
    console.log('me and typ = ' + me + typ + key);
  var request = {
    location: dloc,
    radius: me,
    types: typ,
    keyword: key
  };
  service = new google.maps.places.PlacesService(map);
  service.search(request, placeCallback);
}

//called by initializePlace(): Is callback function that returns from google with place info. That gets put into a #foundlinks list on the FindLinks page
function placeCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
       console.log(results[i]); 
      console.log(results[i].name); 
      console.log(results[i].vicinity); 
      console.log(results[i].reference); 
      	$('#foundlinks').append('<li data-theme="c"  id="' +results[i].reference + '"><p><span style="font-size: 1.5em;" class="rn">'  +  results[i].name + '</span><br/><input type="checkbox" class="selks" /><span class="rv"> ' + results[i].vicinity + '</span></p></li>');
    }
   	$('#foundlinks').append('<br/><p>&nbsp; If you cannot find the place you are looking for <br/>&nbsp; check off something like it and then edit it later.</p><li data-theme="b"><a href="#" data-role="button" name="savelks" id="savelks" data-theme="b">Save checked links</a></li>');	
    $('#foundlinks').listview('refresh');
  }
}

//page_button 'Save Checked Links' on FindLinks page that appears prog. by #findlks after the #foundlinks checkbox list. Takes the selected links id of each and gets place detail info from google then hangs
$('body').on('click', "#savelks", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	var selectedItems = new Array();
$(".selks:checked").each(function() {
		tha = new Array();
		thi=$(this);
		th=$(this).parent();
		thp =th.parent();
		thid= thp.attr('id');
		tha['id']=thid;
		var request = {
           reference: thid
		};
		service = new google.maps.places.PlacesService(map);
		service.getDetails(request, dcallback);
	});
});

//called by service.getDetails(request, dcallback) which got called when user saves checked links (#savlks) . Creates an object of place details that it stringifys and puts in localStorage. Then it calls on displayLinks() to recreate the #lkoptions link list on the LinkOptions page
function dcallback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
  		var pobj = new Object();
  		pid = 'LINK' + place.id;
	    pobj.place = place.name;
		pobj.address = place.formatted_address;
		pobj.phone = place.formatted_phone_number;
		pobj.url = place.website;    
		if (pobj.url==undefined){pobj.url="#";}
		pobj.lat = place.geometry.location.Qa;
		pobj.lon = place.geometry.location.Ra;
		localStorage.setItem(pid, JSON.stringify(pobj));
		console.log(place);
  		console.log(place.id);
	    console.log(place.name);
		console.log(place.formatted_address);
		console.log(place.formatted_phone_number);
		console.log(place.website);    
		console.log(place.geometry.location.Qa);
		console.log(place.geometry.location.Ra);
		displayLinks(); //recreate the #lkoptions link list on the LinkOptions page
		$('#foundlinks').empty();  
		$('#foundlinks').listview('refresh');   
  }
}

//header_navbar_button on LinkOptions page goes to FindLinks (#addlinks) page
$("#addlk").click(initiate_geolocation);  

//called by addlk button on LinkOptions page && by #findlks SearchForEstablishments button on FindLinks page. Gets geolocation from device and hangs.
function initiate_geolocation() {  
    navigator.geolocation.getCurrentPosition(handle_geolocation_query);  
}  

//callback from initiate geolocation that sets the device dlat and dlon
function handle_geolocation_query(position){  
	dlat=position.coords.latitude;
	dlon=position.coords.longitude;      
}  

//called from dcallback <-service.getDetails(request, dcallback)<-Save_checked_links_Button to recreate a #lkoptions link list on LinkOption page out of localStorage 
function displayLinks() {
	initiate_geolocation();
	$('#lkoptions').empty();   
	for(var i=0, len=localStorage.length; i<len; i++) {
		console.log(i);
	    var key = localStorage.key(i);	    
	    if (key.substr(0,4)=='LINK') {
	    	var value = localStorage[key];
	    	var lobj =JSON.parse(value);
	    	console.log('retrievedObject: ', JSON.parse(value));
	    	console.log(key + " => " + value);
	    	$('#lkoptions').append('<li data-theme="b" alt="' +lobj.lat + ',' + lobj.lon + '" id="' +key + '"><a href="' + lobj.url + '"><p><span style="font-size: 1.7em;" class="rn">'  +  lobj.place + '</span><br/><span class="rv"> ' + lobj.address + '</span></p></a><a class="lob" data-role="button" data-icon="info" href="tel:' + lobj.phone + '">' + lobj.phone + '</a></li>');
	    }
	    $('#lkoptions').listview('refresh');   
	}
}

//called when page is initalized. Places link list on home(yourlists) page out of localStorage 
function placeLinks() {
	$('#sales').empty();   
	for(var i=0, len=localStorage.length; i<len; i++) {
		console.log(i);
	    var key = localStorage.key(i);	    
	    if (key.substr(0,4)=='LINK') {
	    	var value = localStorage[key];
	    	var lobj =JSON.parse(value);
	    	console.log('retrievedObject: ', JSON.parse(value));
	    	console.log(key + " => " + value);
	    	$('#sales').append('<li data-theme="d" alt="' +lobj.lat + ',' + lobj.lon + '" id="' +key + '"><a href="' + lobj.url + '"><p><span style="font-size: 1.7em;" class="rn">'  +  lobj.place + '</span><br/><span class="rv"> ' + lobj.address + '</span></p></a><a class="lob" data-role="button" data-icon="info" href="tel:' + lobj.phone + '">' + lobj.phone + '</a></li>');
	    }
	    $('#sales').listview('refresh');   
	}
}


//header button: delete Redraws link list from localStorage with delete button and dlob class
$('body').on('click', "#deletelk", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	makeLinkDeleteIcons();
});

//list_button X produced by the delete navbar button LinkOptioons page. Finds the id,removes from local storage  and re-displayLinks(). 
$('body').on('click', ".dlob", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$this = $(this);
	var dlid = $this.parent().attr('id');
	console.log(dlid);
	localStorage.removeItem(dlid);
	makeLinkDeleteIcons();
});

function makeLinkDeleteIcons(){
	$('#lkoptions').empty();   
	for(var i=0, len=localStorage.length; i<len; i++) {
		console.log(i);
	    var key = localStorage.key(i);	    
	    if (key.substr(0,4)=='LINK') {
	    	var value = localStorage[key];
	    	var lobj =JSON.parse(value);
	    	console.log('retrievedObject: ', JSON.parse(value));
	    	console.log(key + " => " + value);
	    	$('#lkoptions').append('<li data-theme="b" alt="' +lobj.lat + ',' + lobj.lon + '" id="' +key + '"><a href="' + lobj.url + '"><p><span style="font-size: 1.7em;" class="rn">'  +  lobj.place + '</span><br/><span class="rv"> ' + lobj.address + '</span></p></a><a class="dlob" data-role="button" data-icon="delete" href="tel:' + lobj.phone + '">' + lobj.phone + '</a></li>');
	    }
    }
	$('#lkoptions').listview('refresh');   	
}

//header navbar button: edit Redraws link list from localStorage with edit(grid) button and elob class
$('body').on('click', "#editlk", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$('#lkoptions').empty();   
	for(var i=0, len=localStorage.length; i<len; i++) {
		console.log(i);
	    var key = localStorage.key(i);	    
	    if (key.substr(0,4)=='LINK') {
	    	var value = localStorage[key];
	    	var lobj =JSON.parse(value);
	    	console.log('retrievedObject: ', JSON.parse(value));
	    	console.log(key + " => " + value);
	    	$('#lkoptions').append('<li data-theme="b" alt="' +lobj.lat + ',' + lobj.lon + '" id="' +key + '"><a href="' + lobj.url + '"><p><span style="font-size: 1.7em;" class="rn">'  +  lobj.place + '</span><br/><span class="rv"> ' + lobj.address + '</span></p></a><a class="elob" data-role="button" data-icon="grid" href="tel:' + lobj.phone + '">' + lobj.phone + '</a></li>');
	    }
	    $('#lkoptions').listview('refresh');   
    }
});

//list_button grid produced by the edit navbar button LinkOptioons page. ...  and re-displayLinks(). 
$('body').on('click', ".elob", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	$this = $(this);
	var ekey = $this.parent().attr('id');
	var value = localStorage.getItem(ekey);
	var ae =JSON.parse(value);
	console.log(ekey + " => " + value);
	$('#elkdiv').empty();	
	nform='<p>Often you can find a link to the weekly specials. Replace the generic url link with that.</p><form id="elkfo"><div data-role="fieldcontain"><input type="hidden" id="eid" name="eid" value="' + ekey + '"  ><label for="name">Place:</label><input type="text" name="place" id="eplace" value="' + ae.place + '"  /><br/><label for="name">Address:</label><input type="text" name="address" id="eaddress" value="' + ae.address + '" /><br/><label for="name">Phone:</label><input type="text" name="phone" id="ephone" value="' + ae.phone + '" /><br/><label for="name">URL:</label><input type="text" name="url" id="eurl" value="' + ae.url + '" /><br/><label for="name">Latitude:</label><input type="text" name="lat" id="elat" value="' + ae.lat + '" /><br/><label for="name">Logitude:</label><input type="text" name="lon" id="elon" value="' + ae.lon + '" /><br/><input type="submit" data-theme="a" id="saveEditedLink" value="Save Edited Link"/></div></form>';
 	$('#elkdiv').append(nform);
 	$('#elkdiv').trigger('create');
});

//page_button on LinkOptions page that is created when edit(grid) list button is pressed.
$('body').on('click', "#saveEditedLink", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	ekey=$('#eid').val();	
	var eobj = new Object();
	eobj.place = $('#eplace').val();	
	eobj.address = $('#eaddress').val();	
	eobj.phone = $('#ephone').val();	
	eobj.url = $('#eurl').val();	
	eobj.lat = $('#elat').val();	
	eobj.lon = $('#elon').val();	
	eobj.place = $('#eplace').val();	
	localStorage.setItem(ekey, JSON.stringify(eobj));
	console.log(ekey + " => " + JSON.stringify(eobj));
	$('#elkdiv').empty();
 	$('#elkdiv').trigger('create');
	displayLinks();
});

//page_button on LinkOptions page that is created when edit(grid) list button is pressed.
$('body').on('click', "#redolks", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	initializeLinks();
	$('#elkdiv').empty();
 	$('#elkdiv').trigger('create');
	displayLinks();
});




/*

function initialize_Directions(){
  directionsDisplay = new google.maps.DirectionsRenderer();
  var devloc = new google.maps.LatLng(dlat, dlon);
  console.log(devloc);
  var myOptions = {
    zoom:14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: devloc
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  directionsDisplay.setMap(map);		
}

function calcRoute() {
  var start = dlat + ',' + dlon;
  var end = dest;
  console.log(start +' end ' +end);
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) {
  	console.log(status);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}

var haight = new google.maps.LatLng(37.7699298, -122.4469157);
var mmap;

  function initialize() {
  	console.log(haight);
    directionsDisplay = new google.maps.DirectionsRenderer();
    var myOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: haight
    }
    mmap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    directionsDisplay.setMap(mmap);
  }

*/