login_otp_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #4CAF50;
            color: #fff;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            background-color: #f4f4f4;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Login Verification</h1>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>Your OTP for login is:</p>
            <div class="otp">{{otp}}</div>
            <p>Please enter this OTP to complete your login. The OTP is valid for 5 minutes.</p>
            <br/>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Thank you.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Ernest Asare Co.. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

"""
