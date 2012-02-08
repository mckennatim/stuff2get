<?php
// http://10.0.1.18/stuff2get/services/deletelist.php?email=tim@pathboston.com&repo=Trey&list=Radios
include_once('tm/dbinfo.php');
include('tm/ChromePhp.php');

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
			ChromePhp::log('{"error":{"text":'. $e->getMessage() .'}}');
		} 
		//check if there are other users using for repo and list, if not delete whole list
		$sql = "SELECT COUNT(*) FROM `users` WHERE `repo`=? AND `list`=?";
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$q=$dbh->prepare($sql);
			$q->execute(array($repo, $list));  
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
			ChromePhp::log('{"error":{"text":'. $e->getMessage() .'}}');
		} 
		$fc = $q->fetchColumn();
		ChromePhp::log('fc= '.$fc);
  		if ($fc < 1) {		
  			ChromePhp::log('in fetch deleteing anyway '. $fc);
			$sql = "DELETE FROM `lists` WHERE `repo`=? AND `list`=?";			
			try {
				$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$q2=$dbh->prepare($sql);
				$q2->execute(array($repo, $list));  
			} catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}'; 
				ChromePhp::log('{"error":{"text":'. $e->getMessage() .'}}');
			}		
		}
$dbh=null;		


?>