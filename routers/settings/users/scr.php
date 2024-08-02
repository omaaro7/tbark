<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POST Request Example</title>
</head>
<body>
    <form id="userForm">
        <label for="user_name">User Name:</label>
        <input type="text" id="user_name" name="user_name" required><br>

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br>

        <label for="phone_number">Phone Number:</label>
        <input type="tel" id="phone_number" name="phone_number" required><br>

        <label for="type">Type:</label>
        <input type="text" id="type" name="type" required><br>

        <label for="stat">Status:</label>
        <input type="text" id="stat" name="stat" required><br>

        <button type="submit">Submit</button>
    </form>

    <div id="response"></div>

    <script>
        document.getElementById('userForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(this);

            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            fetch('post_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                const responseDiv = document.getElementById('response');
                if (data.error) {
                    responseDiv.innerText = `Error: ${data.error}`;
                } else {
                    responseDiv.innerText = `Success: ${data.message}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
