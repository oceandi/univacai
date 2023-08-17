<!DOCTYPE html>
<html>
<head>
    <title>Form Submission Response</title>
    <link rel="icon" type="image/png" href="logo/logo.png">
    <style>
        /* Your CSS styles here */
    </style>
</head>
<body>
    <div class="container">
        <h1>Form Submission Response</h1>
        <?php
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            echo "<p><strong>First Name:</strong> " . $_POST["first_name"] . "</p>";
            echo "<p><strong>Last Name:</strong> " . $_POST["last_name"] . "</p>";
            echo "<p><strong>Email:</strong> " . $_POST["email"] . "</p>";
            echo "<p><strong>Phone Number:</strong> " . $_POST["phone"] . "</p>";
            echo "<p><strong>Twitter:</strong> " . $_POST["twitter"] . "</p>";
            echo "<p><strong>LinkedIn:</strong> " . $_POST["linkedin"] . "</p>";
            echo "<p><strong>Google Scholar:</strong> " . $_POST["google_scholar"] . "</p>";
            echo "<p><strong>Current Employer:</strong> " . $_POST["current_employer"] . "</p>";
            echo "<p><strong>Current Role:</strong> " . $_POST["current_role"] . "</p>";
            echo "<p><strong>Exceptional Work:</strong> " . $_POST["exceptional_work"] . "</p>";
            // ... Display other form fields
        } else {
            echo "<p>No form data submitted.</p>";
        }
        ?>
    </div>
</body>
</html>