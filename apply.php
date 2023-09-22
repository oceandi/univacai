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
    
    // Perform data validation
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Email is valid, continue processing
        // Add additional data validation as needed
        
        // Example: Send the data via email
        $to = "korkmaz.x7@gmail.com"; // Replace with your email address
        $subject = "Form Submission";
        $message = "First Name: $first_name\n";
        $message .= "Last Name: $last_name\n";
        $message .= "Email: $email\n";
        $message .= "Phone: $phone\n";
        $message .= "Twitter: $twitter\n";
        $message .= "LinkedIn: $linkedin\n";
        $message .= "Google Scholar: $google_scholar\n";
        $message .= "Current Employer: $current_employer\n";
        $message .= "Current Role: $current_role\n";
        $message .= "Exceptional Work:\n$exceptional_work\n";
        
        // Send email
        if (mail($to, $subject, $message)) {
            // Email sent successfully
            // You can customize further actions or responses here
            header("Location: thank-you.html");
            exit;
        } else {
            // Email sending failed
            // Handle errors or provide user feedback
            echo "Email sending failed. Please try again later.";
        }
    } else {
        // Email is not valid
        // Handle invalid data or provide user feedback
        echo "Invalid email address. Please check your email and try again.";
    }
}
?>
