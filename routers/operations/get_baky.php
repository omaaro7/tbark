<?php
// Database connection parameters
$host = '127.0.0.1';
$dbname = 'tabark';
$username = 'root';
$password = '';

try {
    // Connect to the database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Set PDO to throw exceptions on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get the value of 'baky' and 'operationType' from the URL parameters
    $bakyValue = isset($_GET['baky']) ? $_GET['baky'] : '';
    $operationTypeValue = isset($_GET['operationType']) ? $_GET['operationType'] : '';
    
    // Prepare SQL query
    $sql = "SELECT * FROM operations WHERE CAST(baky AS UNSIGNED) > :baky AND operationType = :operationType";
    
    // Prepare the statement
    $stmt = $pdo->prepare($sql);
    
    // Bind parameter values
    $stmt->bindParam(':baky', $bakyValue, PDO::PARAM_INT);
    $stmt->bindParam(':operationType', $operationTypeValue, PDO::PARAM_STR);
    
    // Execute the statement
    $stmt->execute();
    
    // Fetch results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Output results as JSON
    header('Content-Type: application/json');
    echo json_encode($results);
    
} catch (PDOException $e) {
    // Handle database connection errors
    echo "Error: " . $e->getMessage();
}
?>