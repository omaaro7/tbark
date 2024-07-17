<?php
// Include mpdf library
require_once '../../vendor/autoload.php'; // Adjust the path based on your installation method
use Mpdf\Mpdf;

// Create an instance of mpdf
$mpdf = new Mpdf();

// Database configuration
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

// Query to fetch data
$sql = "SELECT * FROM simcards ORDER BY ID DESC";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    // Fetch data and store it in an array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo "No results found";
}

// Close the database connection
$conn->close();

// Start buffering the output
ob_start();

// HTML content for PDF
$html = '<html dir="rtl">';
$html .= '<head>';
$html .= '<style>';
$html .= 'body { font-family: my, sans-serif; }'; // Default font style
$html .= '.header { text-align: center; margin-bottom: 10px; }';
$html .= '.title { font-size: 18px; font-weight: bold; width:100%; text-align:center; }';
$html .= '.table { width: 100%; border-collapse: collapse;color:white; }';
$html .= '.footer { width: 100%; border-collapse: collapse; }';
$html .= '.table th, .table td { border: 1px solid #ffffff; padding: 15px 8px; }';
$html .= '.table th { background-color: #ff2949; }';
$html .= '.table tbody tr td { background-color: #1e76c4; }';
$html .= '.table tbody tr:nth-child(even) td { background-color: #ba9544; }';
$html .= '</style>';
$html .= '</head>';
$html .= '<body>';

// Header section
$html .= '<div class="header">';
$html .= '<img src="../../assets/imgs/profile.jpg" alt="Profile Image" style="width:100px;height:100px;">';
$html .= '<h1 class="title">خطوط المحل</h1>';
$html .= '</div>';

// Table section
$html .= '<table class="table">';
$html .= '<thead>';
$html .= '<tr>';
$html .= '<th>اسم الخط</th>';
$html .= '<th>رقم الخط</th>';
$html .= '</tr>';
$html .= '</thead>';
$html .= '<tbody>';

// Populate table with data
foreach ($data as $row) {
    $html .= '<tr>';
    $html .= '<td>' . htmlspecialchars($row['name']) . '</td>';
    $html .= '<td>' . htmlspecialchars($row['number']) . '</td>';
    // Add more columns as needed
    $html .= '</tr>';
}

$html .= '</tbody>';
$html .= '</table>';

$html .= '</body>';
$html .= '</html>';

// Write HTML content to mpdf
$mpdf->SetHTMLFooter('
    <table width="100%">
    <tr>
        <td width="33%">{DATE j-m-Y}</td>
        <td width="33%" align="center">{PAGENO}/{nbpg}</td>
        <td width="33%" style="text-align:left;">تبارك تكنو شوب</td>
    </tr>
</table>');


$mpdf->WriteHTML($html);

// Output the PDF as a download named report.pdf
$mpdf->Output('report.pdf', 'I');
?>