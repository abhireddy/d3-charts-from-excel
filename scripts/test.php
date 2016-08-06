<?php
	$filename = "../index.html";

	//upload CSV to Amazon S3 bucket
	require('../vendor/autoload.php');

	// this will simply read AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env vars
	/*
	$s3 = Aws\S3\S3Client::factory();
	$bucket = getenv('S3_BUCKET')?: die('No "S3_BUCKET" config var in found in env!');
	*/

	$s3 = Aws\S3\S3Client::factory(array(
    'key' => 'AKIAJRSJS5K26A4IH4FQ',
    'secret' => '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'
    ));

	//$bucket = "snapchart";
	$bucket = getenv('S3_BUCKET_NAME')?: die('No "S3_BUCKET_NAME" config var in found in env!');
    $upload = $s3->upload($bucket, $filename, fopen('../'.$filename, 'rb'), 'public-read');
?>