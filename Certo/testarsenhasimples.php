<?php
function senValida($senha)
{
    return preg_match('/[a-z]/', $senha) && preg_match('/[A-Z]/', $senha) && preg_match('/[0-9]/', $senha) && preg_match('/[\W]/', $senha) && strlen($senha) >= 6;

}
$senha = 'aB1@xy$z';

if (senValida($senha)) {
    echo "Senha válida!";
} else {
    echo "Senha inválida!";
}

?>