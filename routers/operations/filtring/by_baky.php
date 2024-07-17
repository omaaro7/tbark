<?php

// Database connection details
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "tabark";

// Create connection
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
// Set the PDO error mode to exception
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// API endpoint for getting data from the 'operations' table
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Extract operationType from the URL
    $operationType = isset($_GET['operationType']) ? $_GET['operationType'] : '';
    
    // Pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1; // Default page is 1
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 1000000000; // Default limit is 10 records per page

    // Calculate offset for pagination
    $offset = ($page - 1) * $limit;

    // Fetch data from the 'operations' table where 'baky' column > 0 and 'operationType' matches
    $query = "SELECT * FROM operations WHERE CAST(baky AS UNSIGNED) > 0 AND operationType = :operationType ORDER BY id DESC LIMIT :limit OFFSET :offset";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':operationType', $operationType);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch all rows as associative arrays
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Count total rows (for pagination)
    $countQuery = "SELECT COUNT(*) as total FROM operations WHERE CAST(baky AS UNSIGNED) > 0 AND operationType = :operationType";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->bindParam(':operationType', $operationType);
    $countStmt->execute();
    $totalRows = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Calculate total pages
    $lastPage = ceil($totalRows / $limit);

    // Prepare response data
    $response = [
        'current_page' => $page,
        'lastPage' => $lastPage,
        'data' => $result
    ];

    // Return the result as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // Handle unsupported HTTP methods
    http_response_code(405);
    echo json_encode(array("message" => "Method Not Allowed"));
}

?>
