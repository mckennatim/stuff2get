<?php
// http://10.0.1.18/webeshoppin/stuff2get/services/joinexist.php?email=mck&repo=derdt&list=groceries
include_once('tm/dbinfo.php');
include('/tm/ChromePhp.php');

$repo = $_GET['repo'];
$list= $_GET['list'];
$email = $_GET['email'];

ChromePhp::log($repo . $list . $email);

$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
$sql = "SELECT COUNT(*) FROM users WHERE repo=? AND list=?";
$q=$dbh->prepare($sql);
//so the $dbh is an database object $q is a statement object which, once executed,  has the resultset hung on it.
$exists=0;
if ($res = $q->execute(array($repo, $list))) {
    //Check the number of rows that match the SELECT statement 
    ChromePhp::log($q);
  	if ($q->fetchColumn() == 0) {
    	//LIST DOESN'T EXIST $exists = "0";
    	echo '{"items":[{"exists":"0"}]}'; 
	} else {
		//LIST EXISTS
		//add user
		$sql = "INSERT INTO `users`( `repo`, `list`, `email`) VALUES (?,?,?)";
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$q=$dbh->prepare($sql);
			$q->execute(array($repo, $list, $email));  
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		} 
		$dbh = null;
		echo '{"items":[{"exists":"1"}]}'; 
	}
}
?>