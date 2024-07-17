<?php
header('Content-Type: application/json');

// Database credentials
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "tabark";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the start date and end date from the URL
if (!isset($_GET['startDate']) || !isset($_GET['endDate'])) {
    echo json_encode(["error" => "startDate and endDate parameters are required"]);
    exit();
}

$startDate = $_GET['startDate'];
$endDate = $_GET['endDate'];

// Validate the date formats (d/m/Y with single or double digits for day and month)
if (!preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $startDate, $startMatches) ||
    !preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $endDate, $endMatches)) {
    echo json_encode(["error" => "Invalid date format. Use d/m/Y."]);
    exit();
}

// Ensure the dates are valid
list(, $startDay, $startMonth, $startYear) = $startMatches;
list(, $endDay, $endMonth, $endYear) = $endMatches;

if (!checkdate($startMonth, $startDay, $startYear) || !checkdate($endMonth, $endDay, $endYear)) {
    echo json_encode(["error" => "Invalid date."]);
    exit();
}

// Convert startDate and endDate to Y-m-d format for MySQL comparison
$startDateFormatted = DateTime::createFromFormat('d/m/Y', sprintf('%02d/%02d/%d', $startDay, $startMonth, $startYear))->format('Y-m-d');
$endDateFormatted = DateTime::createFromFormat('d/m/Y', sprintf('%02d/%02d/%d', $endDay, $endMonth, $endYear))->format('Y-m-d');

// Prepare SQL query
$sql = "SELECT * FROM operations WHERE STR_TO_DATE(dateDay, '%d/%m/%Y') >= ? AND STR_TO_DATE(dateDay, '%d/%m/%Y') < ? ORDER BY id DESC";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("ss", $startDateFormatted, $endDateFormatted);

$stmt->execute();
$result = $stmt->get_result();

$operations = [];

while ($row = $result->fetch_assoc()) {
    $operations[] = $row;
}

// Close the connection
$stmt->close();
$conn->close();

// Output the results in JSON format
echo json_encode($operations);
?>
