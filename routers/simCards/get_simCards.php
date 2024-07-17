<?php

// Database configuration
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'tabark';

// Connect to MySQL database
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to fetch all simcards
function getAllSimcards($conn) {
    // Prepare SQL statement
    $stmt = $conn->prepare("SELECT * FROM simcards ORDER BY id DESC");

    // Execute SQL statement
    $stmt->execute();

    // Get result
    $result = $stmt->get_result();

    // Fetch data
    $simcards = $result->fetch_all(MYSQLI_ASSOC);

    // Close statement
    $stmt->close();

    return $simcards;
}

// Function to fetch a simcard by ID
function getSimcardById($conn, $id) {
    // Prepare SQL statement
    $stmt = $conn->prepare("SELECT * FROM simcards WHERE id = ?");
    $stmt->bind_param("i", $id);

    // Execute SQL statement
    $stmt->execute();

    // Get result
    $result = $stmt->get_result();

    // Check if simcard exists
    if ($result->num_rows === 0) {
        return null;
    }

    // Fetch data
    $simcard = $result->fetch_assoc();

    // Close statement
    $stmt->close();

    return $simcard;
}

// API endpoint to get all simcards
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Get simcard by ID
        $id = $_GET['id'];
        $simcard = getSimcardById($conn, $id);

        if ($simcard === null) {
            http_response_code(404);
            echo json_encode(array("error" => "Simcard not found"));
        } else {
            echo json_encode($simcard);
        }
    } else {
        // Get all simcards
        $simcards = getAllSimcards($conn);
        echo json_encode($simcards);
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}

// Close connection
$conn->close();

?>