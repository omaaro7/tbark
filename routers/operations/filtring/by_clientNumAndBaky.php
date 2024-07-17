<?php
// Database connection parameters
$host = '127.0.0.1';
$username = 'root';
$password = ''; // Assuming password is empty for root
$database = 'tabark';

// Connect to MySQL database
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get parameters from the client
$client_number = $_GET['client_number']; // Assuming client_number is passed as a GET parameter
$operation_type = $_GET['operationType']; // Assuming operation_type is passed as a GET parameter
$page = isset($_GET['page']) ? $_GET['page'] : 1; // Default page is 1
$limit = isset($_GET['limit']) ? $_GET['limit'] : 10000000000; // Default limit is 10 records per page

// Calculate offset
$offset = ($page - 1) * $limit;

// Prepare SQL query to count total records
$countSql = "SELECT COUNT(*) as total FROM operations WHERE client_number = ? AND CAST(baky AS UNSIGNED) > 0 AND operationType = ? ";
$stmtCount = $conn->prepare($countSql);
$stmtCount->bind_param("ss", $client_number, $operation_type);
$stmtCount->execute();
$resultCount = $stmtCount->get_result();
$rowCount = $resultCount->fetch_assoc();
$totalRecords = $rowCount['total'];

// Calculate total pages
$lastPage = ceil($totalRecords / $limit);
$currentPage = $page;

// Prepare SQL query with pagination
$sql = "SELECT * FROM operations WHERE client_number = ? AND CAST(baky AS UNSIGNED) > 0 AND operationType = ? ORDER BY id DESC LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssii", $client_number, $operation_type, $offset, $limit);
$stmt->execute();
$result = $stmt->get_result();

// Fetch data as associative array
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Close statement
$stmt->close();
$stmtCount->close();

// Close connection
$conn->close();

// Prepare JSON response including pagination info
$response = [
    'currentPage' => $currentPage,
    'lastPage' => $lastPage,
    'data' => $data
];

// Return data as JSON
echo json_encode($response);
?>