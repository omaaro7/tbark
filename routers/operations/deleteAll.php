<?php

// Database connection settings
$host = '127.0.0.1';
$dbname = 'tabark';
$username = 'root';
$password = '';

try {
    // Connect to the database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Delete all records from the 'operations' table
    $sql = "DELETE FROM operations";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Send a success response
    echo "All records from the 'operations' table have been deleted.";
} catch (PDOException $e) {
    // Database connection or query error
    echo "Error: " . $e->getMessage();
}
?>