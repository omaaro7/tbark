<?php

$servername = "127.0.0.1"; 
$username = "root"; 
$password = ""; 
$database = "tabark"; 


$conn = new mysqli($servername, $username, $password, $database);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if (isset($_GET['id'])) {
        $id = $_GET['id']; 

        $sql = "SELECT * FROM shopinfo WHERE id = $id";
        $result = $conn->query($sql);

        $row = $result->fetch_assoc();
        echo json_encode($row);

    } else { 
        $sql = "SELECT * FROM shopinfo ORDER BY id DESC"; 
        $result = $conn->query($sql);

        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        
        $rows = array_reverse($rows);
        echo json_encode($rows);

    }
}

$conn->close();
?>
