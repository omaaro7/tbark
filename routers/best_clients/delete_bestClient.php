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

// Check if the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Retrieve the record ID from the URL parameter
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // Prepare SQL statement to delete the record from the best_clients table
        $stmt = $pdo->prepare("DELETE FROM best_clients WHERE id = ?");

        // Execute the prepared statement with the provided ID
        try {
            $stmt->execute([$id]);
            echo "Record deleted successfully.";
        } catch (PDOException $e) {
            die("Error: " . $e->getMessage());
        }
    } else {
        echo "Error: ID parameter missing.";
    }
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo "Error: Only DELETE requests are allowed.";
}
?>
