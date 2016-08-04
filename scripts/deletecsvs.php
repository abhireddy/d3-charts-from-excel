<?php
	$servername = "us-cdbr-iron-east-03.cleardb.net";
	$username = "b253f1008c6fa9";
	$password = "3755331b";
	$dbname = "heroku_d54ce66a7bbf72b";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$today = Date("Y-m-d");

	echo $today;
	$sql = "SELECT filename FROM charts WHERE deleted = 0 and expiration >= '".$today."'";
	$result = $conn->query($sql);

	// delete each filename that returns for the query
	while ($row = $result->fetch_assoc()) {
		unlink('../'.htmlspecialchars($row['filename']));
		$sql = "UPDATE charts SET deleted=1 WHERE filename='".htmlspecialchars($row['filename'])."'";
		$conn->query($sql);
	}

	//close connection
	$conn->close();


?>