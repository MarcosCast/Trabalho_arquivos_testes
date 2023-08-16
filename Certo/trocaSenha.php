<?php
session_start();

function senhaValida($password)
{
    return preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/', $password);
    // eturn preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\w$@]{6,}$/', $senha);
}

function trocarSenha($oldPassword, $newPassword)
{
    // Simula a troca de senha no BD
    if ($oldPassword === 'senha_antiga') {
        if (senhaValida($newPassword)) {
            // Simular uma atualização no BD
            $_SESSION['senha'] = $newPassword;
            return true;
        } else {
            return 'A nova senha não atende aos critérios de complexidade.';
        }
    } else {
        return 'A senha antiga fornecida está incorreta.';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['old_pswd']) && isset($_POST['pswd'])) {
    $oldPassword = $_POST['old_pswd'];
    $newPassword = $_POST['pswd'];

    $result = trocarSenha($oldPassword, $newPassword);

    if ($result === true) {
        echo 'Senha alterada com sucesso!';
    } else {
        echo 'Erro ao trocar a senha: ' . $result;
    }
}
?>


<form action="trocar_senha.php" method="post">
    <label for="old_pswd">Senha Antiga:</label>
    <input type="password" name="old_pswd" required><br>

    <label for="pswd">Nova Senha:</label>
    <input type="password" name="pswd" required><br>

    <input type="submit" value="Trocar Senha">
</form>






