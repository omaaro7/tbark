<?php

// Database connection parameters
$host = '127.0.0.1'; // Change this to your database host
$dbname = 'tabark'; // Change this to your database name
$username = 'root'; // Change this to your database username
$password = ''; // Change this to your database password

// Establish database connection using PDO
$pdo = null;
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Error: Could not connect. " . $e->getMessage()]));
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve all POST data
    $data = $_POST;

    // Specify the table and columns
    $table = 'best_clients';
    $columns = ['client_name', 'client_number', 'client_credit'];

    // Ensure all required columns are present in the POST data
    foreach ($columns as $column) {
        if (!isset($data[$column])) {
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "Missing required field: $column"]);
            exit;
        }
    }

    // Prepare the SQL statement dynamically
    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    $sql = "INSERT INTO $table (" . implode(', ', $columns) . ") VALUES ($placeholders)";
    $stmt = $pdo->prepare($sql);

    // Execute the prepared statement with the provided data
    try {
        $stmt->execute(array_values($data));
        echo json_encode(["message" => "Data inserted successfully."]);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Only POST requests are allowed."]);
}
?>
