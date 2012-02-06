	var foods;
	var done;
	var fid;
	//var urlps;
	var repo;
	var list;
	var email;
	var qrep;
$('#thelist').live('pageinit', function(event) {
	console.log("is this firing ?");
	urlps = getUrlVars();
	console.log(window.location.href);
	repo = urlps['repo'];
	list= urlps['list'];
	email= urlps['email'];
	if (urlps['shared']==1) {
		reli = repo + "." + list;
		var lists = new cookieList("lists");
		//check if repo.list already there
		
		console.log(reli);
		console.log(lists.items());
		console.log($.inArray(reli, lists.items()));
		if ($.inArray(reli, lists.items())== -1){
			lists.add(reli);	
		}
		$.cookie("email", email, { expires: 700 });		
	}
	qrep='repo=' + repo + '&list=' + list;
	console.log(qrep);
	getFoodList(qrep);
	$('#needList').listview('refresh');

	console.log('out now' + window.location.href);
	
	//move items back and forth beteen current and completed
	$('input[type="checkbox"]').live('change', function(){
	    var $el = $(this);
	    fid = $el.attr('id');
	    if ($el.attr('checked')) {
	        $el.parent().prependTo('#doneList');
	        done = 0;
	    } else {
	        $el.parent().appendTo('#needList');
	        done = 1;
	    }
	    console.log(fid + ' will have done set to ' +done);
	    $.ajax({
	      type: "GET",
	      url: serviceURL + "chkupdate.php",
	      data: "id=" + fid + "&done=" + done
	     });
	});
	//header button that moves to the delete items page
	$('#deletebutton').click(function() {
		$.mobile.changePage( $('#deletestuff') );
		console.log('after p0age change');
		listWholeDB();
		return false; 
	});
	//remove items from database
	$('a.ditems').live("click", function() {
		var $el = $(this);
	    fid = $el.attr('id');
	    $el.remove();
	    tid= "#" + fid; 
	    $(tid).parent().remove();
	    console.log('angry brides #' + fid);
	    	$.ajax({
	      type: "GET",
	      url: serviceURL + "deleteitem.php",
	      data: "fid=" + fid
	     });
		$('#deleteList').listview('refresh');
		$('#thelist').listview('refresh');
	    return false;
	});
	
	//add items when not already in database
	$("input:jqmData(type='search')").bind('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		var optCount = $("#donelist > li:visible").size();
		if(optCount < 1) {
			if(code == 13 ) { //Enter keycode
				stuff =$(this).val(); 
				stuff = stuff.charAt(0).toUpperCase() + stuff.slice(1);
				console.log(stuff);
				$('#needList').append('<li><input type="checkbox" /> <span>' + stuff + '</span></li>');
				$('#needList').listview('refresh');
				$(this).val("");
				$.ajax({
				    type: "GET",
				    url: serviceURL + "additem.php",
				    data: {stuff: stuff, repo: repo, list: list}
				    //better than below, $ escapes weird characters for u
				    //data: "stuff=" + stuff +"&repo=" + repo + "&list=" + list
				});
			}
		}				
	});
	
	//sets up home page
	function getFoodList(qqrep) {
		nqrep = qqrep + '&need=1';
		dqrep = qqrep + '&need=0';
		console.log(qqrep);
		$.getJSON(serviceURL + 'getfoodlist.php', nqrep, function(data) {
			foods = data.items;
			console.log(foods);
			$.each(foods, function(index, food) {
				$('#needList').append('<li><input type="checkbox" id="' + food.id + '" /> <span>' + food.stuff + '</span></li>');
			});
			$('#needList').listview('refresh');
		});
		$.getJSON(serviceURL + 'getfoodlist.php', dqrep,  function(data) {
			foods = data.items;
			console.log(foods);
			$.each(foods, function(index, food) {
				$('#doneList').append('<li><input type="checkbox" checked="checked" id="' + food.id + '"/> <span>' + food.stuff + '</span></li>');
			});
			$('#doneList').listview('refresh');
		});	
	}
	
	function listWholeDB() {
		console.log(qrep);
		$.getJSON(serviceURL + 'getwholelist.php', qrep, function(data) {
			foods = data.items;
			console.log(foods);
			$.each(foods, function(index, food) {
				$('#deleteList').append('<li data-icon="delete" ><a  class="ditems" id="'+ food.id + '" data-iconpos="left" ><span>' + food.stuff + '</span></a></li>');
			});
			$('#deleteList').listview('refresh');
		});
	}
	
});
 
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
