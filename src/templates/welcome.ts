export const welcomeTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
font-family:Arial;
background:#f5f5f5;
padding:40px;
}

.container{
max-width:600px;
margin:auto;
background:white;
padding:30px;
border-radius:10px;
}

h1{
color:#c89b3c;
}

.btn{
display:inline-block;
padding:12px 20px;
background:#c89b3c;
color:white;
text-decoration:none;
border-radius:5px;
margin-top:20px;
}
</style>
</head>

<body>

<div class="container">

<h1>Welcome to Golden Drop 🌿</h1>

<p>Hi <b>${name}</b>,</p>

<p>

Thank you for registering with Golden Drop.

Your account has been created successfully.

</p>

<p>

We hope you enjoy shopping with us.

</p>

</div>

</body>

</html>
`;