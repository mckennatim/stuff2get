<?php
// http://10.0.1.18/webeshoppin/stuff2get/services/addlist.php?email=mck&repo=derdt&list=groceries
include_once('tm/dbinfo.php');
include('/tm/ChromePhp.php');

$repo = $_GET['repo'];
$list= $_GET['list'];
$email = $_GET['email'];

ChromePhp::log($repo . $list . $email);

$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  

		$sql = "DELETE FROM `users` WHERE `repo`=? AND `list`=? AND `email`=?";
		
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$q=$dbh->prepare($sql);
			$q->execute(array($repo, $list, $email));  
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		} 
		
		$sql = "DELETE FROM `lists` WHERE `repo`=? AND `list`=?";
		
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$q=$dbh->prepare($sql);
			$q->execute(array($repo, $list));  
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
$dbh=null;		


?>