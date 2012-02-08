<?php
// http://10.0.1.18/webeshoppin/stuff2get/services/newsetup.php?email=mck&repo=derdt&list=groceries
include_once('tm/dbinfo.php');
include('tm/ChromePhp.php');

$repo = $_GET['repo'];
$list= $_GET['list'];
$email = $_GET['email'];

ChromePhp::log($repo . $list . $email);

$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
$sql = "SELECT COUNT(*) FROM users WHERE repo=? AND list=? AND email=?";
$q=$dbh->prepare($sql);
//so the $dbh is an database object $q is a statement object which, once executed,  has the resultset hung on it.
$isnew=0;
if ($res = $q->execute(array($repo, $list, $email))) {
    //Check the number of rows that match the SELECT statement 
  	if ($q->fetchColumn() == 0) {
  		ChromePhp::log('in if execute ' . $q->fetchColumn() );
  		$isnew="1";
  		//no row matched - insert new record
		$sql = "INSERT INTO `users`( `repo`, `list`, `email`) VALUES (?,?,?)";
		
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$q=$dbh->prepare($sql);
			$q->execute(array($repo, $list, $email));  
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
			ChromePhp::log('{"error":{"text":'. $e->getMessage() .'}}');
		} 
		mysql_connect ($dbhost, $dbuser, $dbpass) or die("can't connect");
		mysql_select_db ($dbname) or die("db unavailable");
		$sql= "INSERT INTO `lists` (`repo`, `list`, `stuff`, `need`)
		VALUES 
		('$repo', '$list', 'Milk', '0'),
		('$repo', '$list', 'OJ', '1'),
		('$repo', '$list', 'Bread', '0'),
		('$repo', '$list', 'Brown Rice', '1'),
		('$repo', '$list', 'Apples', '1'),
		('$repo', '$list', 'Coffee', '1'),
		('$repo', '$list', 'Greean tea', '0'),	
		('$repo', '$list', 'Paper towels', '0')	"; 
		
		mysql_query($sql) or die("Dead inserting");
    }
    //rows matched -- get record 
    else {
    	$isnew = "0";
	}
}
$sql = "SELECT * FROM users WHERE repo=? AND list=? AND email=?";
$q=$dbh->prepare($sql);
$q->execute(array($repo, $list, $email));  
$res = $q->fetchAll(PDO::FETCH_ASSOC);
$ress = $res[0];//need to get inside $res since fetchAll is getting rows plural
$ress['isnew']=$isnew; //add to (db)associative array 
$resss[0]=$ress;
ChromePhp::log($res);
ChromePhp::log($resss);
$dbh = null;
echo '{"items":'. json_encode($resss) .'}'; 
?>