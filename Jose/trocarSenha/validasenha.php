<?php

function senhaValida($p_senha) {

return preg_match('/[a-z]/', $p_senha) && preg_match('/[A-Z]/', $p_senha) && preg_match('/[0-9]/', $p_senha) && preg_match('/[\W]/', $p_senha) && strlen($p_senha) >= 6;

}

?>