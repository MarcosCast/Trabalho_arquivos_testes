<?php
session_start();

//Simulação de base de dados
if (!isset($_SESSION["usuarios"])) {
    $_SESSION["usuarios"] = [];
}

function autenticar()
{
    return isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] === true;
}

function registrarUsuario($usuario, $senha)
{
    //Simulação
    $user = [
        "usuario" => $usuario,
        "senha" => $senha,
    ];

    //Armazenado em sessão 
    $_SESSION["usuarios"][] = $user;

    echo "Usuário registrado com sucesso!";
}

function autenticarUsuario($usuario, $senha)
{
    //Simular Autenticação
    foreach ($_SESSION["usuarios"] as $user) {
        if ($user["usuario"] === $usuario && $user["senha"] === $senha) {
            $_SESSION["authenticated"] = true;
            $_SESSION["authenticated_usuario"] = $usuario;
            return true;
        }
    }

    return false;
}


function cSenha($newPassword)
{
    
    $username = $_SESSION["authenticated_username"];

    // Simular BD
    foreach ($_SESSION["usuarios"] as &$user) {
        if ($user["usuario"] === $username) {
            $user["senha"] = $newPassword;
            break;
        }
    }

    echo "Senha alterada com sucesso!";
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["register"])) {
        $usuario = $_POST["usuario"];
        $password = $_POST["password"];
        registrarUsuario($usuario, $password);
    } elseif (isset($_POST["login"])) {
        $usuario = $_POST["usuario"];
        $password = $_POST["password"];
        if (autenticarUsuario($usuario, $password)) {
            header("Location: index.php");
            exit;
        } else {
            echo "Credenciais inválidas. Tente novamente.";
        }
    } elseif (isset($_POST["change_password"])) {
        if (autenticar()) {
            $newPassword = $_POST["new_password"];
            cSenha($newPassword);
        } else {
            echo "Você precisa estar autenticado para alterar a senha.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Registro, Login e Alteração de Senha</title>
</head>
<body>
    <?php if (!autenticar()) : ?>
        <h2>Registro</h2>
        <form action="index.php" method="post">
            <input type="hidden" name="register" value="1">
            <label>Nome de Usuário:</label>
            <input type="text" name="username" required>
            <br>
            <label>Senha:</label>
            <input type="password" name="password" required>
            <br>
            <input type="submit" value="Registrar">
        </form>

        <h2>Login</h2>
        <form action="index.php" method="post">
            <input type="hidden" name="login" value="1">
            <label>Nome de Usuário:</label>
            <input type="text" name="username" required>
            <br>
            <label>Senha:</label>
            <input type="password" name="password" required>
            <br>
            <input type="submit" value="Login">
        </form>
    <?php else : ?>
        <h2>Alteração de Senha</h2>
        <form action="index.php" method="post">
            <input type="hidden" name="change_password" value="1">
            <label>Nova Senha:</label>
            <input type="password" name="new_password" required>
            <br>
            <input type="submit" value="Alterar Senha">
        </form>
        <br>
        <form action="index.php" method="post">
            <input type="submit" name="logout" value="Sair">
        </form>
    <?php endif; ?>
</body>
</html>
