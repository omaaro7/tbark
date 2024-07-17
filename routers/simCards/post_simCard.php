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

// API endpoint to insert data into the "simcards" table
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if all required fields are provided
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['number']) && isset($data['name']) && isset($data['type'])) {
        $number = $data['number'];
        $name = $data['name'];
        $type = $data['type'];

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO simcards (number, name, type) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $number, $name, $type);

        // Execute SQL statement
        if ($stmt->execute()) {
            // Data inserted successfully
            http_response_code(201);
            echo json_encode(array("message" => "Simcard created successfully"));
        } else {
            // Failed to insert data
            http_response_code(500);
            echo json_encode(array("error" => "Failed to create simcard"));
        }

        // Close statement
        $stmt->close();
    } else {
        // Required fields are missing
        http_response_code(400);
        echo json_encode(array("error" => "Missing required fields"));
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
}

// Close connection
$conn->close();

?>
