<?php
	//get filename from URL
	$filename = "csv/".intval($_GET['i']).".csv";

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

	$sql = "SELECT * FROM charts WHERE filename = '".$filename."'";
	$result = $conn->query($sql);
	//store results in array
	$row = $result->fetch_assoc();
	//close connection
	$conn->close();
?>

<!DOCTYPE html>
<html>

<head>
<!-- d3js.org -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<!-- onehackoranother.com/projects/jquery/tipsy/ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tipsy/1.0.2/jquery.tipsy.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.tipsy/1.0.2/jquery.tipsy.css">
<!-- custom stylesheets -->
<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/chart.css">
<!-- http://codepen.io/Savantos/pen/mHIpt -->
<link rel="stylesheet" href="../css/button.css">
<script src="../js/charts.js"></script>
</head>

<body>
  <div id="charttitle" class="title"></div>
  <div id="chartdescription"></div>
  <div id="chart"></div>
</body>

<script>
	var fileName = "../".concat("<?php echo htmlspecialchars($row['filename']); ?>"),
		chartType = "<?php echo htmlspecialchars($row['charttype']); ?>",
		title = "<?php echo htmlspecialchars($row['title']); ?>",
		description = "<?php echo htmlspecialchars($row['description']); ?>",
		deleted = "<?php echo htmlspecialchars($row['deleted']); ?>";

	if (fileName == "../") {
		$("#charttitle").text("Invalid URL.");		
	} else if (deleted = 1) {
		$("#charttitle").text("This chart has expired.");
	} else {
	    //pass data to PHP script to download CSV from S3 bucket.
	    $.ajax({
	      url: "scripts/getcsv.php",
	      type: "post",
	      data: { filename: "<?php echo htmlspecialchars($row['filename']); ?>" },
	      success: function() {
  			$("#charttitle").text(title);
			$("#chartdescription").text(description);
	    	drawChart(fileName, chartType);
	      }
	    });
	}
</script>
</html>