<?php


$host = '127.0.0.1'; 
$dbname = 'tabark'; 
$username = 'root'; 
$password = ''; 


try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error: Could not connect. " . $e->getMessage());
}


if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    
    $id = $_GET['id'];

    
    $stmt = $pdo->prepare("DELETE FROM operations WHERE id = ?");

    
    try {
        $stmt->execute([$id]);
        echo "Record deleted successfully.";
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    
    http_response_code(405); 
    echo "Error: Only DELETE requests are allowed.";
}
?>