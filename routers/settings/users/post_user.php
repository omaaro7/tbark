<?php

// Database connection parameters
$host = '127.0.0.1'; // Change this to your database host
$dbname = 'tabark'; // Change this to your database name
$dbUsername = 'root'; // Change this to your database username
$dbPassword = ''; // Change this to your database password

// Establish database connection using PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbUsername, $dbPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error: Could not connect. " . $e->getMessage());
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid JSON input."]);
        exit;
    }

    // Required fields
    $requiredFields = ['user_name', 'password', 'phone_number', 'type', 'stat'];
    $data = [];

    foreach ($requiredFields as $field) {
        if (isset($input[$field])) {
            $data[$field] = $input[$field];
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "$field is required."]);
            exit;
        }
    }

    // Check if phone number or user name already exists
    try {
        // Check phone number
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE phone_number = ?");
        $stmt->execute([$data['phone_number']]);
        $phoneExists = $stmt->fetchColumn();

        if ($phoneExists) {
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "Phone number already exists."]);
            exit;
        }

        // Check user name
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_name = ?");
        $stmt->execute([$data['user_name']]);
        $userExists = $stmt->fetchColumn();

        if ($userExists) {
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "User name already exists."]);
            exit;
        }

        // Prepare SQL statement to insert data into the users table
        $columns = implode(', ', array_keys($data));
        $values = implode(', ', array_fill(0, count($data), '?'));
        $stmt = $pdo->prepare("INSERT INTO users ($columns) VALUES ($values)");

        // Execute the prepared statement with the provided data
        $stmt->execute(array_values($data));
        echo json_encode(["message" => "Data inserted successfully."]);

    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Error: " . $e->getMessage()]);
    }
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Only POST requests are allowed."]);
}
?>
