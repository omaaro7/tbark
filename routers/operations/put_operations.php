<?php

// Database connection settings
$dsn = 'mysql:host=127.0.0.1;dbname=tabark';
$username = 'root';
$password = '';

// Establish a database connection
try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Check if data is sent via PUT request
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Parse JSON input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    // Get ID from URL
    $url_components = parse_url($_SERVER['REQUEST_URI']);
    parse_str($url_components['query'], $params);
    $id = $params['id'];

    if (!empty($id)) {
        $updateValues = [];

        // Build update query dynamically
        foreach ($input as $column => $value) {
            if ($column !== 'id') {
                $updateValues[] = "$column = :$column";
            }
        }

        if (!empty($updateValues)) {
            $updateQuery = "UPDATE operations SET " . implode(', ', $updateValues) . " WHERE id = :id";

            // Prepare and execute the update query
            $stmt = $pdo->prepare($updateQuery);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);

            foreach ($input as $column => $value) {
                if ($column !== 'id') {
                    $stmt->bindValue(":$column", $value);
                }
            }

            $stmt->execute();

            // Check if any rows were affected
            $rowCount = $stmt->rowCount();
            if ($rowCount > 0) {
                echo json_encode(array("message" => "Update successful"));
            } else {
                echo json_encode(array("message" => "No rows updated"));
            }
        } else {
            echo json_encode(array("message" => "No update values provided"));
        }
    } else {
        echo json_encode(array("message" => "Missing 'id' parameter in URL"));
    }
} else {
    echo json_encode(array("message" => "Invalid request method"));
}
?>
