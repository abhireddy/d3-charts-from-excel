<?php
	$data = $_POST['data'];
	$filename = $_POST['filename'];
	$chart = $_POST['chart'];
	$expiration = $_POST['expiration'];

	//create CSV from data
	$fp = fopen('../'.$filename, 'w');
	foreach ($data as $fields) {
		// remove special chars (e.g. $ or %, which can't be read by D3. 
		foreach ($fields as &$value) {
			$value = preg_replace('/[^a-zA-Z0-9.]/','',$value);
		}

		// add next row to CSV
	    fputcsv($fp, $fields);
	}
	fclose($fp);

	//upload CSV to Amazon S3 bucket
	require('../vendor/autoload.php');

	// this will simply read AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env vars
	$s3 = Aws\S3\S3Client::factory();
	$bucket = getenv('S3_BUCKET_NAME')?: die('No "S3_BUCKET_NAME" config var in found in env!');

/*
	$s3 = Aws\S3\S3Client::factory(array(
    	'key' => 'AKIAJRSJS5K26A4IH4FQ',
    	'secret' => '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'
    ));
    $bucket = "snapchart";
*/	
    $upload = $s3->upload($bucket, $filename, fopen('../'.$filename, 'rb'), 'public-read');

	//create DB record
	$link = mysqli_connect('us-cdbr-iron-east-03.cleardb.net', 'b253f1008c6fa9', '3755331b', 'heroku_d54ce66a7bbf72b');
	$stmt = mysqli_prepare($link, "INSERT INTO charts (filename, charttype, expiration) VALUES (?, ?, ?)");
	mysqli_stmt_bind_param($stmt, 'sss', $filename, $chart, $expiration);
	//execute statement
	mysqli_stmt_execute($stmt);
	//close statement and connection
	mysqli_stmt_close($stmt);
	//close connection
	mysqli_close($link);
?>