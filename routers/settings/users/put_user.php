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

// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Check if the user ID is provided as a query parameter
    if (!isset($_GET['id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "User ID is required as a query parameter."]);
        exit;
    }

    $userId = $_GET['id'];

    // Retrieve JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid JSON input."]);
        exit;
    }

    // Fields to update
    $updatableFields = ['user_name', 'password', 'phone_number', 'type', 'stat'];
    $data = [];

    foreach ($updatableFields as $field) {
        if (isset($input[$field])) {
            $data[$field] = $input[$field];
        }
    }

    if (empty($data)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "At least one field must be provided for update."]);
        exit;
    }

    // Check if the user exists
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $userExists = $stmt->fetchColumn();

        if (!$userExists) {
            http_response_code(404); // Not Found
            echo json_encode(["error" => "User not found."]);
            exit;
        }

        // Check if user name or phone number already exists for another user
        if (isset($data['user_name'])) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_name = ? AND id != ?");
            $stmt->execute([$data['user_name'], $userId]);
            $userNameExists = $stmt->fetchColumn();

            if ($userNameExists) {
                http_response_code(400); // Bad Request
                echo json_encode(["error" => "User name already exists."]);
                exit;
            }
        }

        if (isset($data['phone_number'])) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE phone_number = ? AND id != ?");
            $stmt->execute([$data['phone_number'], $userId]);
            $phoneExists = $stmt->fetchColumn();

            if ($phoneExists) {
                http_response_code(400); // Bad Request
                echo json_encode(["error" => "Phone number already exists."]);
                exit;
            }
        }

        // Prepare SQL statement to update the user data
        $updateFields = [];
        foreach ($data as $key => $value) {
            $updateFields[] = "$key = ?";
        }
        $updateFieldsString = implode(', ', $updateFields);
        $stmt = $pdo->prepare("UPDATE users SET $updateFieldsString WHERE id = ?");

        // Execute the prepared statement with the provided data
        $stmt->execute(array_merge(array_values($data), [$userId]));
        echo json_encode(["message" => "User updated successfully."]);

    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Error: " . $e->getMessage()]);
    }
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Only PUT requests are allowed."]);
}
?>
