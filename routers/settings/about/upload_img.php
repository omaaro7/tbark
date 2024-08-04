<?php
$targetDir = "../../../uploads/"; 

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

function removeAllFiles($dir) {
    $files = glob($dir . '*'); 
    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file); 
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    
    removeAllFiles($targetDir);

    $targetFile = $targetDir . basename($_FILES["image"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        $uploadOk = 0;
        echo json_encode(['status' => 'error', 'message' => 'File is not an image.']);
        exit;
    }

    
    if ($_FILES["image"]["size"] > 100000000000000000) {
        $uploadOk = 0;
        echo json_encode(['status' => 'error', 'message' => 'Sorry, your file is too large.']);
        exit;
    }

    
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        $uploadOk = 0;
        echo json_encode(['status' => 'error', 'message' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.']);
        exit;
    }

    
    if ($uploadOk == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Sorry, your file was not uploaded.']);
    
    } else {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            updateImageNameInDatabase(basename($_FILES["image"]["name"]));
            echo json_encode(['status' => 'success', 'message' => 'The file has been uploaded.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Sorry, there was an error uploading your file.']);
        }
    }
}

function updateImageNameInDatabase($imageName) {
    
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "tabark";

    
    $conn = new mysqli($servername, $username, $password, $dbname);

    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    
    $sql = "UPDATE shopinfo SET shop_img='$imageName' WHERE id=1"; 
    $Sql = "UPDATE siteinfo SET shop_img='$imageName' WHERE id=1"; 
    
    if ($conn->query($Sql) === TRUE) {
        echo json_encode(['status' => 'success', 'message' => 'Record updated successfully']);
    }
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['status' => 'success', 'message' => 'Record updated successfully']);
    } 
     else {
        echo json_encode(['status' => 'error', 'message' => 'Error updating record: ' . $conn->error]);
    }

    $conn->close();
}
?>
