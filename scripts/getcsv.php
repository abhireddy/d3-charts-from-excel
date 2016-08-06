<?php
	//upload CSV to Amazon S3 bucket
	require('../vendor/autoload.php');

	// file to download
	//$filename = "csv/306575767.csv";
	$filename = $_POST['filename'];
	//$filepath = "../" + $filename;

	$s3 = Aws\S3\S3Client::factory(array(
    	'key' => 'AKIAJRSJS5K26A4IH4FQ',
    	'secret' => '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'
    ));

    $bucket = "snapchart";
	

	// this will simply read AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env vars
	//$s3 = Aws\S3\S3Client::factory();
	//$bucket = getenv('S3_BUCKET_NAME')?: die('No "S3_BUCKET_NAME" config var in found in env!');
 
	$result = $s3->getObject(array(
	    'Bucket' => $bucket,
	    'Key'    => $filename,
	    'SaveAs' => "../".$filename
	));
?>