
<?php  
function verificarSenha($senha) {
    $pontuacao = 0;

    if (preg_match('/[a-z]/', $senha)) $pontuacao += 2;
    if (preg_match('/[A-Z]/', $senha)) $pontuacao += 2;
    if (preg_match('/[0-9]/', $senha)) $pontuacao += 2;
    if (preg_match('/[\W]/', $senha)) $pontuacao += 3;

    $tamanho = strlen($senha);
    if ($tamanho >= 12) {
        $pontuacao += 3;
    } elseif ($tamanho >= 8) {
        $pontuacao += 2;
    } elseif ($tamanho >= 6) {
        $pontuacao += 1;
    }

    if ($pontuacao >= 12) {
        return 'Muito forte';
    } elseif ($pontuacao >= 8) {
        return 'Forte';
    } elseif ($pontuacao >= 7) {
        return 'Média';
    } elseif ($pontuacao >= 6) {
        return 'Fraca';
    } else {
        return 'Senha Inválida';
    }
       
}

//Test Ex
$senha = 'aB1@xy$z';
$nivelForca = verificarSenha($senha);
echo "Nível de força da senha: " . $nivelForca;

?>

