var thelists;//the lists array
var clists;//the cookie list object
var repo;
var list;
var email =$.cookie("email");
var userd;
var uid;
var isnew;

$('#yourlists').live('pageinit', function(event) {
	console.log('in bind pageinit for yourlists');
    if (cookiesEnabled()==false){
    	alert("Cookies need to be enabled in order for this app to work.");
    	console.log("cookies are not enabled");
    	exit();
    }	
    //see if there is a list in the query string URL vars
    //like http://10.0.1.18/stuff2get/www/index.html?repo=Mytest&list=Frogs&email=tim@pathboston.com
    urlps = getUrlVars();
	console.log(window.location.href);
	repo = urlps['repo'];
	list= urlps['list'];
	email= urlps['email'];
	console.log(repo != undefined);
	if (repo != undefined  && list !=undefined){
		theurl =  serviceURL + "newsetup.php";
		newList();
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
});

$('#share').live('pageinit', function(event) {
	clists = new cookieList("lists");
	thelists = clists.items();	
	console.log(thelists);
	$.each(thelists, function(index, alist) {
		alistsp = alist.split(".");
		rep = alistsp[0];
		lis = alistsp[1];
		$('#list2share').append('<li data-theme="b"><a href="food2buy.html?repo=' + rep + '&list=' + lis + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  lis + '</span><br/>repository: ' + rep + '</p></a><a href="#" data-icon="arrow-u" class="ashare" id=' + rep + '.' + lis + '>remove</a></li>');
	});
	$('#list2share').listview('refresh');	
});

$("#newlist").click(function (e) {
	e.stopImmediatePropagation();
    e.preventDefault();
    repo = $("#repo").val();
    list = $("#list").val();
    theurl =  serviceURL + "addlist.php";
	newList();
});

function newList(){
    $.ajax({
	     type: "GET",
	     url: theurl,
	     data: "repo=" + repo + "&list=" + list + "&email=" +email,
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

$("#joinexist").click(function (e) {
	e.stopImmediatePropagation();
    e.preventDefault();
    repo = $("#repo").val();
    list = $("#list").val();
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
				$('#allyourlists').append('<li data-theme="b"><a href="food2buy.html?repo=' + repo + '&list=' + list + '" data-ajax="false" ><p><span style="font-size: 2.25em;">'  +  list + '</span><br/>repository: ' + repo + '</p></a></li>');
				$('#allyourlists').listview('refresh');						
			}else {
				alert("That list doesn't exist. Want to create a new (setup) list?");
			}					
     	}
     });
});

//header button that moves to the delete lists & cookies
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

//delete buttonsthat show up after you hit the delete header button
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

$('body').on('click', ".ashare", function (e) { 
	e.stopImmediatePropagation();
	e.preventDefault();
	var $sho = $(this); //this is delete link pressed
    did = $sho.attr('id'); //the id of that link
    lp =  did.split("."); //use the original cookie list from pageinit
    repo = lp[0];
    list = lp[1];
    semail = $("#shemail").val();
    if (IsEmail(semail)==true) {
     	urri ='mailto:'+ semail  + '?subject=share this list with me' + '&cc=' + email + '&body=Hi, I think it would be cool if we shared this ' + list +' list on our phones. That way when either of us modified it we would see the update. http://' + location.host + '/stuff2get/www/index.html%3Frepo=' + repo + '%26list=' + list + '%26email=' + semail  + '%26shared=1';
    	window.location = urri;
		alert('clicked ashare ' + semail + repo + list + urri);   	
    } else {
    	alert('That does not seem to be avalid email');  
    }	
});




