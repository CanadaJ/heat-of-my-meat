<?php
	header('Content-Type: application/json');
	$limit = $_POST['limit'];
	$values = array();
	$db = new SQLite3('temperatures.db');
	$stmt = $db->prepare('SELECT temp FROM temps ORDER BY ROWID DESC LIMIT ?');
	$stmt->bindValue(1, $limit, SQLITE3_INTEGER );
	$temps = $stmt->execute();
	while($row=$temps->fetchArray()) {
			$values[] = $row;
	}
	echo json_encode($values);
?>