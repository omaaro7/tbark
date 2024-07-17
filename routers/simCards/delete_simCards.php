<?php

// Database configuration
$host = '127.0.0.1';
$user = 'root';
$password = '';
$database = 'tabark';

// Connect to MySQL database
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// API endpoint to delete a simcard from the "simcards" table
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Check if ID parameter is provided
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // Prepare SQL statement
        $stmt = $conn->prepare("DELETE FROM simcards WHERE id = ?");
        $stmt->bind_param("i", $id);

        // Execute SQL statement
        if ($stmt->execute()) {
            // Data deleted successfully
            http_response_code(200);
            echo json_encode(array("message" => "Simcard deleted successfully"));
        } else {
            // Failed to delete data
            http_response_code(500);
            echo json_encode(array("error" => "Failed to delete simcard"));
        }

        // Close statement
        $stmt->close();
    } else {
        // ID parameter is missing
        http_response_code(400);
        echo json_encode(array("error" => "ID parameter is missing"));
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}

// Close connection
$conn->close();

?>
