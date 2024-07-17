<?php

// Establish database connection
$servername = "127.0.0.1";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$database = "tabark"; // Your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Default values for pagination
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? $_GET['page'] : 1;
$limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? $_GET['limit'] : 10000000000000; // Default limit is 10 records per page

// Get operationType from GET request
$operationType = isset($_GET['operationType']) ? $_GET['operationType'] : '';

// Validate operationType (if necessary)
// Ensure operationType is properly escaped to prevent SQL injection
$operationType = $conn->real_escape_string($operationType);

// Calculate offset for pagination
$offset = ($page - 1) * $limit;

// SQL query to fetch paginated data based on operationType
$sql = "SELECT * FROM operations WHERE operationType = '$operationType' ORDER BY id DESC LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);

// Fetching data row by row
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Sending JSON response with pagination metadata
$response = array(
    'currentPage' => $page,
    'data' => $data
);

// Calculate total number of rows for pagination metadata
$count_sql = "SELECT COUNT(*) AS total FROM operations WHERE operationType = '$operationType'";
$count_result = $conn->query($count_sql);
$total_rows = $count_result->fetch_assoc()['total'];


$response['lastPage'] = ceil($total_rows / $limit);

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);

// Close connection
$conn->close();

?>
