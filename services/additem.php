<?php
include_once('tm/dbinfo.php');
include('tm/ChromePhp.php');
$repo = $_GET['repo'];
$list = $_GET['list'];
$stuff = $_GET['stuff'];

ChromePhp::log("stuff=" . $stuff . "&repo=" . $repo . "&list=" . $list);

$sql = "INSERT INTO `lists`(`repo`, `list`, `stuff`, `need`) VALUES (?,?,?,1)";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$q=$dbh->prepare($sql);
	$q->execute(array($repo, $list, $stuff));  
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}
?>