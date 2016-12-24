<?php
	$fields = array();
	$fields[0] = "label";
	$fields[1] = "$24,356.75";

	foreach ($fields as &$value) {
		$value = preg_replace('/[^a-zA-Z0-9.]/','',$value);
		echo $value;
	}
	
	//$cleanfields = preg_replace('/[^a-zA-Z0-9.]/','',$fields);

	echo $fields[1];
?>