<?php

// Database connection parameters
$host = "127.0.0.1";
$username = "root";
$password = "";
$database = "tabark";

// Establish a connection to the database
$conn = mysqli_connect($host, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Default pagination parameters
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? $_GET['page'] : 1;
$records_per_page = isset($_GET['limit']) && is_numeric($_GET['limit']) ? $_GET['limit'] : 10; // Number of records to show per page

// Check if simCardNumber is provided in the URL
if (isset($_GET['simCardNumber'])) {
    $simCardNumber = $_GET['simCardNumber'];

    // Calculate the starting offset for the SQL query based on pagination
    $offset = ($page - 1) * $records_per_page;

    // Prepare SQL query with LIMIT and OFFSET for pagination
    $sql = "SELECT * FROM operations WHERE simCardNumber = '$simCardNumber' ORDER BY id DESC LIMIT $records_per_page OFFSET $offset";

    // Execute SQL query
    $result = mysqli_query($conn, $sql);

    // Check if there are any results
    if (mysqli_num_rows($result) > 0) {
        // Fetch data from the result set
        $operations = mysqli_fetch_all($result, MYSQLI_ASSOC);

        // Count total number of records for pagination (if needed)
        // For simplicity, assuming total count without considering LIMIT
        $sql_count = "SELECT COUNT(*) AS total_records FROM operations WHERE simCardNumber = '$simCardNumber'";
        $result_count = mysqli_query($conn, $sql_count);
        $row_count = mysqli_fetch_assoc($result_count);
        $total_records = $row_count['total_records'];

        // Calculate last page number
        $last_page = ceil($total_records / $records_per_page);

        // Prepare response data
        $response = array(
            "current_page" => $page,
            "lastPage" => $last_page,
            "data" => $operations
        );

        // Output data as JSON
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

} else {
    // simCardNumber parameter is missing in the URL
    echo json_encode(array("error" => "simCardNumber parameter is required"));
}

// Close the database connection
mysqli_close($conn);

?>
