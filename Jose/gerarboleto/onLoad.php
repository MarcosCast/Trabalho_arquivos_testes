<?php

$id = [conn_inid_precadastroempresa];


sc_btn_display("ok", "off");

if( [conn_status] == 0)
{
	$sql = "SELECT inid_precadastroempresa FROM gestorcard.ut_boletoadesao ".
			" WHERE data_cancelamento is null AND inid_precadastroempresa = ".$id; 

	sc_lookup(rsPre, $sql);
	
	if ( isset({rsPre[0][0]}) ) 
	{
		sc_alert("Já Existe Boleto para o Pré-Cadastro Informado.", []);
	}
	else
	{	
		$ret_boleto = array();
		$ret_boleto = gerarBoleto($id);

		if( isset($ret_boleto["error"]) )
		{
			{mensagem} = "Falha na Geração do Boleto!".
						 "Erro: ".$ret_boleto["message"]."<br>";
		}	
		else
		{	
			{mensagem} = "Boleto Gerado com Sucesso";

		}
	}	
}
else
{
	sc_btn_display("ok", "off");
}	

[conn_status] ++;


?>