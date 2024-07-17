<?php

// Check if ID is provided in the request URL
if(isset($_GET['id'])) {
    $id = $_GET['id'];

    // Retrieve PUT request body as JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if data is not empty
    if(!empty($data)) {
        // Database connection parameters
        $servername = "127.0.0.1";
        $username = "root";
        $password = "";
        $dbname = "tabark";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Prepare and execute SQL statement to update data
        $sql = "UPDATE simcards SET ";
        $params = [];
        foreach ($data as $key => $value) {
            $sql .= "$key=?, ";
            $params[] = $value;
        }
        // Remove the last comma and space
        $sql = rtrim($sql, ', ');
        $sql .= " WHERE id=?";
        $params[] = $id;

        $stmt = $conn->prepare($sql);
        // Dynamically bind parameters based on the data received
        $types = str_repeat('s', count($data)) . 'i';
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute() === TRUE) {
            echo "Record updated successfully";
        } else {
            echo "Error updating record: " . $conn->error;
        }

        // Close connection
        $stmt->close();
        $conn->close();
    } else {
        echo "No data provided to update";
    }
} else {
    echo "ID not provided";
}
?>
