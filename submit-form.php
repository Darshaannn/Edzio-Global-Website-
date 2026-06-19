<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        // Fallback for standard form data
        $data = $_POST;
    }

    $full_name   = strip_tags($data['full_name']);
    $email       = strip_tags($data['email']);
    $mobile      = strip_tags($data['mobile']);
    $city        = strip_tags($data['city']);
    $destination = strip_tags($data['destination']);

    $to = "xpandventures2024@gmail.com, darshangadhave10@gmail.com";
    $subject = "New Lead: Edzio Study Abroad Inquiry";

    $message = "You have received a new lead from Edzio Website:\n\n";
    $message .= "Full Name: " . $full_name . "\n";
    $message .= "Email: " . $email . "\n";
    $message .= "Mobile: +91 " . $mobile . "\n";
    $message .= "City: " . $city . "\n";
    $message .= "Preferred Destination: " . $destination . "\n";

    $headers = "From: Edzio Website <xpandventures2024@gmail.com>\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["success" => true, "message" => "Form submitted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Mail server error. Please try again later."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
