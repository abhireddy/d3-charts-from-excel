<?php
	$filename = $_POST['filename'];
	$title = $_POST['title'];
	$description = $_POST['description'];

	//update DB record
	$link = mysqli_connect('us-cdbr-iron-east-03.cleardb.net', 'b253f1008c6fa9', '3755331b', 'heroku_d54ce66a7bbf72b'); //, 'ebdb', 3306);
	$stmt = mysqli_prepare($link, "UPDATE charts SET title=?, description=? WHERE filename=?");
	mysqli_stmt_bind_param($stmt, 'sss', $title, $description, $filename);
	//execute statement
	mysqli_stmt_execute($stmt);
	//close statement and connection
	mysqli_stmt_close($stmt);
	//close connection
	mysqli_close($link);
?>