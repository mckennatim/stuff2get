<?php
include_once('tm/dbinfo.php');
include('tm/ChromePhp.php');
$repo = $_GET['repo'];
$list = $_GET['list'];

$sql = "SELECT stuff, id FROM `lists`WHERE repo=? AND list=? ORDER BY stuff";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->prepare($sql);  
	$stmt->execute(array($repo, $list));
	$needlist = $stmt->fetchAll(PDO::FETCH_OBJ);
	$dbh = null;
	echo '{"items":'. json_encode($needlist) .'}'; 
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}


?>