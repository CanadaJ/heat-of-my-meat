<?php
	header('Content-Type: application/json');
	$limit = $_POST['limit']; // number of results wanted
	$values = array();
	$db = new SQLite3('temperatures.db');
	$stmt = $db->prepare('SELECT temp FROM temps ORDER BY ROWID DESC LIMIT ?');
	$stmt->bindValue(1, $limit, SQLITE3_INTEGER );
	$temps = $stmt->execute();
	while($row=$temps->fetchArray()) {
			$values[] = $row; // iterate the results and add them to the values array
	}
	echo json_encode($values);
?>