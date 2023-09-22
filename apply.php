<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $twitter = $_POST['twitter'];
    $linkedin = $_POST['linkedin'];
    $google_scholar = $_POST['google_scholar'];
    $current_employer = $_POST['current_employer'];
    $current_role = $_POST['current_role'];
    $exceptional_work = $_POST['exceptional_work'];
    
    // Handle uploaded CV file
    $cv_file = $_FILES['cv'];
    
    // Process other uploaded files if needed
    $attachment1 = $_FILES['attachment1'];
    $attachment2 = $_FILES['attachment2'];
    $attachment3 = $_FILES['attachment3'];
    $attachment4 = $_FILES['attachment4'];
    
    // Perform data validation and storage
    // You can save the data to a database or send it via email
    
    // Example: Store the data in a text file
    $data = "First Name: $first_name\n";
    $data .= "Last Name: $last_name\n";
    $data .= "Email: $email\n";
    $data .= "Phone: $phone\n";
    $data .= "Twitter: $twitter\n";
    $data .= "LinkedIn: $linkedin\n";
    $data .= "Google Scholar: $google_scholar\n";
    $data .= "Current Employer: $current_employer\n";
    $data .= "Current Role: $current_role\n";
    $data .= "Exceptional Work:\n$exceptional_work\n";
    
    // Save the data to a text file
    $file_path = "form_data_" . date("Y-m-d_H-i-s") . ".txt";
    file_put_contents($file_path, $data);
    
    // Redirect to a thank-you page
    header("Location: thank-you.html");
    exit;
}
?>
