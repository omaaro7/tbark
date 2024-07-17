<?php
require '../../vendor/autoload.php'; // Load Composer dependencies

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

// Database connection
$host = '127.0.0.1';
$db   = 'tabark';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
$extention = $_GET["extention"];
// Fetch data from database
$stmt = $pdo->query('SELECT * FROM simcards');
$data = $stmt->fetchAll();

// Remove the id column from the data
$data = array_map(function($row) {
    unset($row['id']);
    return $row;
}, $data);

// Replace type values with corresponding text
$data = array_map(function($row) {
    switch ($row['type']) {
        case 0:
            $row['type'] = 'Vodafone';
            break;
        case 1:
            $row['type'] = 'Orange';
            break;
        case 2:
            $row['type'] = 'Etisalat';
            break;
        case 3:
            $row['type'] = 'We';
            break;
    }
    return $row;
}, $data);

// Create a new Spreadsheet object
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Set sheet properties
$spreadsheet->getProperties()
    ->setCreator("Your Name")
    ->setTitle("SQL Export");

// Set row heights for header
$sheet->getRowDimension(1)->setRowHeight(60);
$sheet->getRowDimension(2)->setRowHeight(20);


// Merge cells for the text header
$sheet->mergeCells('A1:C1');
$sheet->setCellValue('A1', 'تبارك تكنو شوب : خطوط المحل');

// Style the text header
$headerTextStyle = [
    'font' => ['bold' => true, 'size' => 16, 'color' => ['argb' => Color::COLOR_WHITE]],
    'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_CENTER,
        'vertical' => Alignment::VERTICAL_CENTER
    ],
    'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['argb' => 'FF6abff7']
    ]
];
$sheet->getStyle('A1:C1')->applyFromArray($headerTextStyle);

// Add date to the header
$sheet->mergeCells('A2:C2');
$sheet->setCellValue('A2', date('Y-m-d'));

// Style the date header
$dateTextStyle = [
    'font' => ['italic' => true, 'size' => 12, 'color' => ['argb' => Color::COLOR_WHITE]],
    'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_CENTER,
        'vertical' => Alignment::VERTICAL_CENTER
    ],
    'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['argb' => 'FF6abff7']
    ]
];
$sheet->getStyle('A2:C2')->applyFromArray($dateTextStyle);

// Add header row
$header = ["رقم الخط", "اسم الخط", "نوع الخط"];
$sheet->fromArray($header, NULL, 'A3');

// Style header
$headerStyle = [
    'font' => ['bold' => true, 'color' => ['argb' => Color::COLOR_WHITE]],
    'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_CENTER,
        'vertical' => Alignment::VERTICAL_CENTER
    ],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
    'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['argb' => 'FF1e76c4']
    ],
];
$sheet->getStyle('A3:C3')->applyFromArray($headerStyle);

// Set header row height for padding effect
$sheet->getRowDimension(3)->setRowHeight(20);

// Add data rows and apply styles
$row = 4;
foreach ($data as $record) {
    $sheet->fromArray(array_values($record), NULL, 'A' . $row);

    // Determine row background color based on type
    $rowBackgroundColor = '';
    switch ($record['type']) {
        case 'Vodafone':
            $rowBackgroundColor = 'FFFF2949'; // Red
            break;
        case 'Orange':
            $rowBackgroundColor = 'FFFFA42D'; // Orange
            break;
        case 'Etisalat':
            $rowBackgroundColor = 'FF598F52'; // Green
            break;
        case 'We':
            $rowBackgroundColor = 'FF6D33FF'; // Purple
            break;
    }

    // Apply styles to the row
    $cellRange = 'A' . $row . ':C' . $row;
    $sheet->getStyle($cellRange)->applyFromArray([
        'font' => ['color' => ['argb' => Color::COLOR_WHITE]],
        'alignment' => [
            'horizontal' => Alignment::HORIZONTAL_CENTER,
            'vertical' => Alignment::VERTICAL_CENTER
        ],
        'fill' => [
            'fillType' => Fill::FILL_SOLID,
            'startColor' => ['argb' => $rowBackgroundColor]
        ],
    ]);

    // Set row height for padding effect
    $sheet->getRowDimension($row)->setRowHeight(25);

    $row++;
}

// Adjust column width
foreach (range('A', 'C') as $col) {
    $sheet->getColumnDimension($col)->setAutoSize(true);
}

// Add filter to "نوع الخط" column
$sheet->setAutoFilter('A3:C3');

// Write the file
$writer = new Xls($spreadsheet);
$filename = 'export.';
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="' . $filename . $extention);
header('Cache-Control: max-age=0');
$writer->save('php://output');
exit;
