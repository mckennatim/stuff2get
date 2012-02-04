<?php
include_once('tm/dbinfo.php');
include('/tm/ChromePhp.php');
$fid=$_GET['id'];
$done = $_GET['done'];

$sql = "UPDATE `lists` SET `need`=? WHERE id=?";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$q=$dbh->prepare($sql);
	$q->execute(array($done,$fid));  
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}


?>