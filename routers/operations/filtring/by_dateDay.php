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

// API endpoint to get data by dateDay with pagination
function getDataByDateDay($dateDay, $page, $records_per_page) {
    global $conn;

    // Sanitize input to prevent SQL injection
    $dateDay = $conn->real_escape_string($dateDay);

    // Calculate the starting offset for the SQL query based on pagination
    $offset = ($page - 1) * $records_per_page;

    // SQL query with LIMIT and OFFSET for pagination
    $sql = "SELECT * FROM operations WHERE dateDay = '$dateDay' ORDER BY id DESC LIMIT $records_per_page OFFSET $offset";
    $result = $conn->query($sql);

    // Check if there are any results
    if ($result->num_rows > 0) {
        // Fetching data row by row
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Calculate total number of records (if needed for lastPage calculation)
        // For simplicity, assuming total count without considering LIMIT
        $sql_count = "SELECT COUNT(*) AS total_records FROM operations WHERE dateDay = '$dateDay'";
        $result_count = $conn->query($sql_count);
        $row_count = $result_count->fetch_assoc();
        $total_records = $row_count['total_records'];

        // Calculate last page number
        $lastPage = ceil($total_records / $records_per_page);

        // Prepare response data
        $response = array(
            "currentPage" => $page,
            "lastPage" => $lastPage,
            "data" => $data
        );

        // Sending JSON response
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        // No records found
        echo json_encode([
            "current_page" => 1,
            "lastPage" => 1,
            "data" => []
        ]);
    }
}

// Default pagination parameters
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? $_GET['page'] : 1;
$records_per_page = isset($_GET['limit']) && is_numeric($_GET['limit']) ? $_GET['limit'] : 10; // Number of records per page

// Check if dateDay parameter is set in GET request
if (isset($_GET['dateDay'])) {
    $dateDay = $_GET['dateDay'];
    getDataByDateDay($dateDay, $page, $records_per_page);
} else {
    echo json_encode(array("error" => "Please provide dateDay parameter"));
}

// Close connection
$conn->close();

?>
