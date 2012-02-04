<?php
include_once('tm/dbinfo.php');
include('/tm/ChromePhp.php');
$fid=$_GET['fid'];

$sql = "DELETE FROM `lists` WHERE id=?";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$q=$dbh->prepare($sql);
	$q->execute(array($fid));  
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}


?>