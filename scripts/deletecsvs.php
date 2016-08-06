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

	//script runs from app/.heroku/php/lib/php
	//trying to get to app/vendor/autoload.php
	require('../../../../vendor/autoload.php');
	$s3 = Aws\S3\S3Client::factory();
	$bucket = getenv('S3_BUCKET_NAME')?: die('No "S3_BUCKET_NAME" config var in found in env!');

	// delete each filename that returns for the query
	while ($row = $result->fetch_assoc()) {
		$result2 = $s3->deleteObject(array(
			'Bucket' => $bucket,
			'Key'    => $row['filename']
		));

		$sql = "UPDATE charts SET deleted=1 WHERE filename='".htmlspecialchars($row['filename'])."'";
		$conn->query($sql);
	}

	//close connection
	$conn->close();
?>