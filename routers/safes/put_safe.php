<?php

$dsn = 'mysql:host=127.0.0.1;dbname=tabark';
$username = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: ". $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    if (is_array($input)) {
        $url_components = parse_url($_SERVER['REQUEST_URI']);
        parse_str($url_components['query'], $params);
        $id = $params['id']?? null;

        if (isset($id) && is_numeric($id)) {
            $updateValues = [];
            $bindValues = array(':id' => $id);

            if (isset($input['startDate'])) {
                $updateValues[] = "startDate = :startDate";
                $bindValues[':startDate'] = $input['startDate'];
            }
            if (isset($input['endDate'])) {
                $updateValues[] = "endDate = :endDate";
                $bindValues[':endDate'] = $input['endDate'];
            }
            if (isset($input['total'])) {
                $updateValues[] = "total = :total";
                $bindValues[':total'] = $input['total'];
            }
            if (!empty($updateValues)) {
                $updateQuery = "UPDATE safes SET ". implode(', ', $updateValues). " WHERE id = :id";

                $stmt = $pdo->prepare($updateQuery);
                $stmt->execute($bindValues);

                $rowCount = $stmt->rowCount();
                if ($rowCount > 0) {
                    echo json_encode(array("message" => "Update successful"));
                } else {
                    echo json_encode(array("message" => "No rows updated"));
                }
            } else {
                echo json_encode(array("message" => "No fields to update"));
            }
        } else {
            echo json_encode(array("message" => "Missing or invalid 'id' parameter in URL"));
        }
    } else {
        echo json_encode(array("message" => "Missing input data"));
    }
} else {
    echo json_encode(array("message" => "Invalid request method"));
}
?>
