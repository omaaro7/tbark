<?php

// Database connection parameters
$servername = "127.0.0.1";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$database = "tabark"; // Your MySQL database name

// Create database connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to fetch data with pagination
function getDataByOperationTypeAndBaky($operationType, $baky, $page = 1, $limit = 10000000000000)
{
    global $conn;

    // Calculate offset
    $offset = ($page - 1) * $limit;

    // Sanitize input to prevent SQL injection
    $operationType = $conn->real_escape_string($operationType);
    $baky = $conn->real_escape_string($baky);

    // SQL query to fetch total count of records
    $countSql = "SELECT COUNT(*) AS total FROM operations WHERE operationType = '$operationType' AND baky = '$baky' ";
    $countResult = $conn->query($countSql);
    $totalRecords = $countResult->fetch_assoc()['total'];

    // Calculate total pages
    $lastPage = ceil($totalRecords / $limit);

    // SQL query to fetch paginated data
    $sql = "SELECT * FROM operations WHERE operationType = '$operationType' AND baky = '$baky' ORDER BY id DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    // Fetching data row by row
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Prepare response array
    $response = array(
        'currentPage' => $page,
        'lastPage' => $lastPage,
        'data' => $data
    );

    // Sending JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Check if operationType, baky, and page parameters are set in GET request
if (isset($_GET['operationType']) && isset($_GET['baky'])) {
    $operationType = $_GET['operationType'];
    $baky = $_GET['baky'];
    $page = isset($_GET['page']) ? $_GET['page'] : 1; // Default page is 1 if not provided
    $limit = isset($_GET['limit']) ? $_GET['limit'] : 100000000000000; // Default limit is 10 if not provided
    
    getDataByOperationTypeAndBaky($operationType, $baky, $page, $limit);
} else {
    echo "Please provide operationType, baky, and page parameters";
}

// Close connection
$conn->close();

?>
