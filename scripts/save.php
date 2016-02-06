<?php
	$data = $_POST['data'];
	$filename = $_POST['filename'];
	$fp = fopen('../'.$filename, 'w');
	foreach ($data as $fields) {
	    fputcsv($fp, $fields);
	}
	fclose($fp);
?>