<?php
// http://10.0.1.18/webeshoppin/stuff2get/services/addlist.php?email=mck&repo=derdt&list=groceries
include_once('tm/dbinfo.php');
include('tm/ChromePhp.php');

$repo = $_GET['repo'];
$list= $_GET['list'];
$email = $_GET['email'];

ChromePhp::log($repo . $list . $email);

$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  

		$sql = "INSERT INTO `users`( `repo`, `list`, `email`) VALUES (?,?,?)";
		
		try {
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$q=$dbh->prepare($sql);
			$q->execute(array($repo, $list, $email));  
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		} 
$dbh=null;		

		mysql_connect ($dbhost, $dbuser, $dbpass) or die("can't connect");
		mysql_select_db ($dbname) or die("db unavailable");
		$sql= "INSERT INTO `lists` (`repo`, `list`, `stuff`, `need`)
		VALUES 
		('$repo', '$list', 'AA sample stuff', '1'),
		('$repo', '$list', 'AB just delete', '1'),					
		('$repo', '$list', '2x4-6/10,4/12', '1'),
		('$repo', '$list', 'Kawasaki gpz500', '0'),
		('$repo', '$list', 'Harley Davidson', '1'),
		('$repo', '$list', 'tea pot', '1'),
		('$repo', '$list', 'waffle iron', '0')"; 
		mysql_query($sql) or die("Dead inserting");
		echo '{"items":[{"exists":"1"}]}'; 

?>