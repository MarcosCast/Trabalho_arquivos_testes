//Verificando a complexidade da senha

if (!senhaValida({pswd})) {
    sc_error_message("A nova senha não atende aos critérios. Certifique-se de que ela contenha pelo menos uma letra maiúscula, uma letra minúscula, um número, um caracter especial como: '!@#$%*-' e tenha 6 ou mais caracteres de comprimento.");
    sc_error_exit();
}