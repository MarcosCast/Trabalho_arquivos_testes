
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

//Tipo 1

if (preg_match('/[\W]/', $variavel)) {

    $string = $variavel;

    $comAcentos = array('à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ü', 'ú', 'ÿ', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'O', 'Ù', 'Ü', 'Ú');
    $semAcentos = array('a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'y', 'A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U');
    
    $string_limpa = str_replace($comAcentos, $semAcentos, $string);

    echo ($string_limpa);
    die ();

}

//Tipo 2

if (preg_match('/[\W]/', $variavel)) {

    $string = preg_replace('/[^a-zA-Z0-9\s]/', '', $variavel);

    echo ($string);
    die ();

}


?>

