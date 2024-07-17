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

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Retrieve a specific record by ID
        $id = $_GET['id'];

        // Prepare SQL statement to select the record from the best_clients table
        $stmt = $pdo->prepare("SELECT * FROM best_clients WHERE id = ?");
        $stmt->execute([$id]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if the record exists
        if ($record) {
            echo json_encode($record);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(["error" => "Record not found."]);
        }
    } else {
        // Retrieve all records
        $stmt = $pdo->query("SELECT * FROM best_clients ORDER BY id DESC");
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($records);
    }
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo "Error: Only GET requests are allowed.";
}
?>
