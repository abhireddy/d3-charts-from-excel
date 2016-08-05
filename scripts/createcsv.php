<?php
	$data = $_POST['data'];
	$filename = $_POST['filename'];
	$chart = $_POST['chart'];
	$expiration = $_POST['expiration'];
	//$expiration = 20160810;
	//$expiration = "CURRENT_TIMESTAMP";

//	$expiration2 = new DateTime();
//	$expiration3 = $expiration2->getTimestamp();

	//create CSV from data
	$fp = fopen('../'.$filename, 'w');
	foreach ($data as $fields) {
	    fputcsv($fp, $fields);
	}
	fclose($fp);

	//create DB record
	$link = mysqli_connect('us-cdbr-iron-east-03.cleardb.net', 'b253f1008c6fa9', '3755331b', 'heroku_d54ce66a7bbf72b'); //, 'ebdb', 3306);
	$stmt = mysqli_prepare($link, "INSERT INTO charts (filename, charttype, expiration) VALUES (?, ?, ?)");
	mysqli_stmt_bind_param($stmt, 'sss', $filename, $chart, $expiration);
	//execute statement
	mysqli_stmt_execute($stmt);
	//close statement and connection
	mysqli_stmt_close($stmt);
	//close connection
	mysqli_close($link);
?>