<?php

$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "tabark";


$conn = new mysqli($servername, $username, $password, $database);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$page = isset($_GET['page']) && is_numeric($_GET['page']) ? $_GET['page'] : 1;
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? $_GET['limit'] : 10;


$page = max(1, $page);


$offset = ($page - 1) * $limit;


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        $sql = "SELECT * FROM operations WHERE id = $id";
        $result = $conn->query($sql);

        $row = $result->fetch_assoc();
        echo json_encode($row);

    } else {

        $count_sql = "SELECT COUNT(*) AS total FROM operations";
        $count_result = $conn->query($count_sql);
        $total_rows = $count_result->fetch_assoc()['total'];


        $total_pages = ceil($total_rows / $limit);


        $sql = "SELECT * FROM operations ORDER BY id DESC LIMIT $limit OFFSET $offset";
        $result = $conn->query($sql);

        $rows = array();
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }


        $response = array(
            'currentPage' => $page,
            'lastPage' => $total_pages,
            'data' => $rows
        );

        echo json_encode($response);

    }
}

$conn->close();
?>