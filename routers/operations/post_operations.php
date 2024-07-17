<?php

// Database connection parameters
$host = '127.0.0.1'; // Change this to your database host
$dbname = 'tabark'; // Change this to your database name
$username = 'root'; // Change this to your database username
$password = ''; // Change this to your database password

// Establish database connection using PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error: Could not connect. " . $e->getMessage());
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from the POST request dynamically
    $data = [];
    foreach ($_POST as $key => $value) {
        $data[$key] = $value;
    }

    // Prepare SQL statement to insert data into the operations table
    $columns = implode(', ', array_keys($data));
    $values = implode(', ', array_fill(0, count($data), '?'));

    $stmt = $pdo->prepare("INSERT INTO operations ($columns) VALUES ($values)");

    // Execute the prepared statement with the provided data
    try {
        $stmt->execute(array_values($data));
        echo "Data inserted successfully.";
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo "Error: Only POST requests are allowed.";
}
?>
