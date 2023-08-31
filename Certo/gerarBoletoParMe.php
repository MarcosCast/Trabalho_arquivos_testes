onAplicationInit:
<?php
[conn_status] = 0;
sc_btn_display('boleto_pedido', 'off');
?>

onScriptIntit:
<?php
[conn_id_pedido];
?>

onLoad:
<?php
$idPedido = [conn_id_pedido];

sc_btn_display("ok", "off");

if( [conn_status] == 0 )
{
	if( empty($idPedido) )
	{
		{mensagem} = 'Número do pedido não informado.';
	}
	else
	{
		$sSQL = " select peven_inid_pedidovenda from venda.ut_pedidovenda where peven_inid_pedidovenda = " . $idPedido;
		
		sc_lookup(rsPev, $sSQL);
	
		if ( !isset({rsPev[0][0]}) )
		{
			{mensagem} = " O Pedido de Venda não foi localizado.";
		}
		else
		{
			$sSQL = "select bolet_inid_boleto, bolet_chds_statuspagarme from venda.ut_boleto
							where bolet_tsdt_cancelamento is null and bolet_chds_statuspagarme is not null and peven_inid_pedidovenda = " .$idPedido;
	
			sc_lookup(rsBol, $sSQL);
			
			if ( !isset({rsBol[0][0]}) ) 
			{
				{mensagem} = " Já existe boleto para o Pedido de Venda informado.";
				sc_btn_display('boleto_pedido', 'on'); //Caio testes
				[conn_linkboleto] = 'https://api.pagar.me/1/boletos/live_clka18118m2c401m58hhyytm2';//Caio testes
				
			}
			else
			{
				{mensagem} = gerarBoleto($p_idPedido);	
			}	
		
		}	
		
	}

}	
	
[conn_status] ++;
?>

onValidadeSucess:
<?php
/*NAO VAI UTILIZAR, BACKUP
sc_include_library( 'prj', 'certo_pagarme', 'php/class_pagarme.php', true, true );


$acao  		= "BOLETO_BANCARIO";
$postBack 	= getUrlPagina().'/postback_boletopagarme';


$SQL_pedido = "select peven_dmvl_vendapedido, ut_cliente.clien_inid_cliente, clien_chtp_tipodocumento, 
					clien_binu_documento, clien_vcnm_nome, clien_vcnu_telefone, clien_vcds_email, 
					peven_inid_pedidovenda, uniem_vcnu_chavepagarme, vencimento_boleto
					from venda.ut_pedidovenda
			INNER JOIN venda.ut_cliente
				ON ut_cliente.clien_inid_cliente = ut_pedidovenda.clien_inid_cliente
			JOIN unidadeemissora.ut_configuracaounidadeemissora 
				ON ut_configuracaounidadeemissora.cnfue_inid_persona = ut_pedidovenda.cnfue_inid_persona
			JOIN (select uniem_inid_unidadeemissora, uniem_vcnu_chavepagarme, (SELECT unidadeemissora.fn_datavencimentoboleto(uniem_siqt_diasvencimentoboleto) vencimento_boleto ) 
				from unidadeemissora.ut_unidadeemissora) unidade
				ON unidade.uniem_inid_unidadeemissora = ut_configuracaounidadeemissora.uniem_inid_unidadeemissora
			where peven_inid_pedidovenda = " . $idPedido;

sc_select(rpedido, $SQL_pedido);

if( {rpedido}->EOF )
{
	$resposta = 'Pedido '. $idPedido .' não encontrado.';
    sc_error_message($resposta);
}

$SQL_pedido = "select peven_dmvl_vendapedido, ut_cliente.clien_inid_cliente, clien_chtp_tipodocumento, 
			clien_binu_documento, clien_vcnm_nome, clien_vcnu_telefone, clien_vcds_email, 
			peven_inid_pedidovenda, uniem_vcnu_chavepagarme, vencimento_boleto
			from venda.ut_pedidovenda
			INNER JOIN venda.ut_cliente
				ON ut_cliente.clien_inid_cliente = ut_pedidovenda.clien_inid_cliente
			JOIN unidadeemissora.ut_configuracaounidadeemissora 
				ON ut_configuracaounidadeemissora.cnfue_inid_persona = ut_pedidovenda.cnfue_inid_persona
			JOIN (select uniem_inid_unidadeemissora, uniem_vcnu_chavepagarme, (SELECT unidadeemissora.fn_datavencimentoboleto(uniem_siqt_diasvencimentoboleto) vencimento_boleto ) 
				from unidadeemissora.ut_unidadeemissora) unidade
				ON unidade.uniem_inid_unidadeemissora = ut_configuracaounidadeemissora.uniem_inid_unidadeemissora
			where peven_inid_pedidovenda = " . $idPedido;

sc_select(rpedido, $SQL_pedido);

if({rpedido}->EOF){
	$resposta = 'Pedido '. $idPedido .' não encontrado.';
	sc_error_message($resposta);
}

$idPedido = {rpedido}->fields['peven_inid_pedidovenda'];

$SQL_boleto = "select bolet_inid_boleto, bolet_chds_statuspagarme
				from venda.ut_boleto
				where bolet_tsdt_cancelamento is null
				and peven_inid_pedidovenda = " . $idPedido;

sc_select(rboleto, $SQL_boleto);

if(!{rboleto}->EOF){
    $boletoStatus = {rboleto}->fields['bolet_chds_statuspagarme'];
    
    if(!is_null($boletoStatus) && !empty($boletoStatus) ){
		switch ($boletoStatus) {
			case 'processing':
				$status = 'processando.';
				break;
			case 'authorized':
				$status = 'autorizado.';
				break;
			case 'paid':
				$status = 'pago.';
				break;
			case 'waiting_payment':
				$status = 'esperando pagamento.';
				break;
			case 'pending_refund':
				$status = 'reembolso pendente.';
				break;
			case 'pending_refund':
				$status = 'reembolso pendente.';
				break;
			case 'refunded':
				$status = 'recusado.';
				break;
			case 'refunded':
				$status = 'estorno.';
				break;
			default:
				$status = '-';
				break;
		}		
		
		$resposta = 'Pedido '. $idPedido .' possui boleto com status: ' . $status;
		sc_error_message($resposta);
	}else{
		//se tiver criado o boleto e occoreu algum erro no envio dos dados do pagarme
		$idBoleto = {rboleto}->fields['bolet_inid_boleto'];
	}
}else{
    //cria um boleto
    $sSQL =  "INSERT INTO venda.ut_boleto (peven_inid_pedidovenda) ".
                    " VALUES (".$idPedido.") RETURNING bolet_inid_boleto";				
    sc_select(idBoleto, $sSQL);
    $idBoleto = {idBoleto}->fields['bolet_inid_boleto'];
}

$pedido = (object) [
    'amount' => {rpedido}->fields['peven_dmvl_vendapedido'],
    'customer_external_id' => $idBoleto, //id do boleto
    'customer_document_type' => {rpedido}->fields['clien_chtp_tipodocumento'],
    'customer_document_number' => {rpedido}->fields['clien_binu_documento'],
    'customer_name' => {rpedido}->fields['clien_vcnm_nome'],
	'customer_phone_number' => {rpedido}->fields['clien_vcnu_telefone'],
	'customer_email' => {rpedido}->fields['clien_vcds_email'],
	'chave_pagarme' => {rpedido}->fields['uniem_vcnu_chavepagarme'],
	'boleto_expiration_date' => {rpedido}->fields['vencimento_boleto']
];

//payment_method
//new na classe
$cs = new Pagarme();

//valida se os parametros para este servico existem na requisicao
$ret = $cs->validaParametros($pedido, $acao);

$status = $ret['status'];

if ($status['codigo'] < 0) {
	sc_error_message($status['mensagem']);
}

$parametrosBoleto = $ret['parametrosBoleto'];

$debug = true;
if ($status['codigo'] == 0) {
    switch($acao)
	{
        case  "BOLETO_BANCARIO":
			$token = $pedido->chave_pagarme;
			$token = 'ak_test_6180LbvC3vx44FMZXT2Y81zDeebwuz';//chave de teste
			//$token = 'ak_live_K3TwclB0AC6r4TAQkPEDxve4k7oEmy';//chave de producao
			
			$ret = $cs->boletoBancario($token, $postBack, $parametrosBoleto, $debug);

			//salva log
			$sSQL = "INSERT INTO venda.ut_postbackpagarme (postb_vctx_postbackpagarme) ".
					" VALUES ('".$ret."')";
			sc_exec_sql($sSQL);

			$ret = json_decode($ret);

			if(isset($ret->errors)){
				$resposta = $ret->errors[0]->message ?? '-';
				sc_error_message($resposta);
			}else{
				//atualiza boleto
				$this->atualizaBoleto($ret, $idBoleto);// FAZER IF PARA VERIFICAR EXISTENCIA DO LINK 
			}

			$resposta = 'Boleto criado com sucesso.';
			break;
        default:
			$resposta = "codigo acao invalido";
			sc_error_message($resposta);
			break;
    }
}
*/
?>

Métodos PHP:
atualizaBoleto --
<?php
 function atualizaBoleto($resposta, $idBoleto) {
    $vlPago = trim($resposta->paid_amount);
$vlPago = empty($vlPago) && $vlPago != "0" ? 'null' : number_format((($vlPago)/100), 2, '.', ' ');
$vlBoleto = trim($resposta->amount);
$vlBoleto = empty($vlBoleto) && $vlBoleto != "0" ? 'null' : number_format((($vlBoleto)/100), 2, '.', ' ');
$status = trim($resposta->status);
$urlBoleto = trim($resposta->boleto_url); 
$barcode = trim($resposta->boleto_barcode);
$dtPago	= substr(trim($resposta->date_updated), 0, -14);
$dtVencimento = $resposta->boleto_expiration_date != "" ? "'".substr(trim($resposta->boleto_expiration_date), 0, -14)."'" : 'null';

$sSQL = "UPDATE venda.ut_boleto" .
			" SET bolet_chds_statuspagarme = '".$status."', bolet_tsdt_vencimento = ".$dtVencimento. 
			", bolet_vcds_linkboleto = '".$urlBoleto."', bolet_dmvl_pagamento = ".$vlPago.
			", bolet_vccd_linhadigitavel = '".$barcode."', bolet_dmvl_boleto = ".$vlBoleto;
	

if($status == 'paid')
{
	$sSQL .= ", bolet_tsdt_pagamento = '".$dtPago."'";
}

$sSQL .= " where bolet_inid_boleto = ".$idBoleto;
sc_exec_sql($sSQL);

return array(
	'status' => $status,
	'urlBoleto' => $urlBoleto
);
 }
?>
	
gerarBoleto--

<?php
function gerarBoleto($p_idPedido) {
    sc_include_library( 'prj', 'certo_pagarme', 'php/class_pagarme.php', true, true );

    $sRet = "";
    $acao  		= "BOLETO_BANCARIO";
    $postBack 	= getUrlPagina().'/postback_boletopagarme';
    
    
    $sSQL = "SELECT peven_dmvl_vendapedido, ut_cliente.clien_inid_cliente, 
                          clien_chtp_tipodocumento, clien_binu_documento, clien_vcnm_nome, 
                          clien_vcnu_telefone, clien_vcds_email, peven_inid_pedidovenda, 
                          uniem_vcnu_chavepagarme, vencimento_boleto
                    FROM 
                        venda.ut_pedidovenda INNER JOIN venda.ut_cliente 
                                            ON ut_cliente.clien_inid_cliente = ut_pedidovenda.clien_inid_cliente
                        JOIN unidadeemissora.ut_configuracaounidadeemissora 
                                            ON ut_configuracaounidadeemissora.cnfue_inid_persona = ut_pedidovenda.cnfue_inid_persona
                        JOIN (
                                SELECT uniem_inid_unidadeemissora, uniem_vcnu_chavepagarme, 
                                (
                                    SELECT unidadeemissora.fn_datavencimentoboleto(uniem_siqt_diasvencimentoboleto) vencimento_boleto 
                                ) 
                                FROM unidadeemissora.ut_unidadeemissora) unidade
                                    ON unidade.uniem_inid_unidadeemissora = ut_configuracaounidadeemissora.uniem_inid_unidadeemissora
                    WHERE
                        peven_inid_pedidovenda = ".$p_idPedido;
    
    sc_select(rpedido, $sSQL);
    
    if({rpedido}->EOF)
    {
        $sRet = 'Pedido '. $idPedido .' não encontrado.';
    }
    else
    {	
        $idPedido = {rpedido}->fields['peven_inid_pedidovenda'];
    
        $sSQL = " select bolet_inid_boleto, bolet_chds_statuspagarme from venda.ut_boleto
                         where bolet_tsdt_cancelamento is null and peven_inid_pedidovenda = " . $p_idPedido;
        
        sc_lookup(rsBoleto, $sSQL);
        
        if ( isset({rsboleto[0][0]}) ) 
        {
            $idBoleto = {rsboleto}->fields['bolet_inid_boleto'];
        }
        else
        {
            //cria um boleto
            $sSQL =  "INSERT INTO venda.ut_boleto (peven_inid_pedidovenda) VALUES (".$p_idPedido.") RETURNING bolet_inid_boleto";				
            sc_select(insBoleto, $sSQL);
            $idBoleto = {insBoleto}->fields['bolet_inid_boleto'];
        }	
        
        $pedido = (object) [
            'amount' => {rpedido}->fields['peven_dmvl_vendapedido'],
            'customer_external_id' => $idBoleto, //id do boleto
            'customer_document_type' => {rpedido}->fields['clien_chtp_tipodocumento'],
            'customer_document_number' => {rpedido}->fields['clien_binu_documento'],
            'customer_name' => {rpedido}->fields['clien_vcnm_nome'],
            'customer_phone_number' => {rpedido}->fields['clien_vcnu_telefone'],
            'customer_email' => {rpedido}->fields['clien_vcds_email'],
            'chave_pagarme' => {rpedido}->fields['uniem_vcnu_chavepagarme'],
            'boleto_expiration_date' => {rpedido}->fields['vencimento_boleto']
        ];
    
        //payment_method
        //new na classe
        $cs = new Pagarme();
    
        //valida se os parametros para este servico existem na requisicao
        $ret = $cs->validaParametros($pedido, $acao);
    
        $status = $ret['status'];
    
        if( $status['codigo'] == 0 ) 
        {
            $parametrosBoleto = $ret['parametrosBoleto'];
            $debug = true;
    
            $token = $pedido->chave_pagarme;
            $token = 'ak_test_6180LbvC3vx44FMZXT2Y81zDeebwuz';//chave de teste
            //$token = 'ak_live_K3TwclB0AC6r4TAQkPEDxve4k7oEmy';//chave de producao
    
            $ret = $cs->boletoBancario($token, $postBack, $parametrosBoleto, $debug);
    
            $sSQL = "INSERT INTO venda.ut_postbackpagarme (postb_vctx_postbackpagarme) VALUES ('".$ret."')";
            sc_exec_sql($sSQL);
    
            $ret = json_decode($ret);
    
            if(isset($ret->errors))
            {
                $resposta = $ret->errors[0]->message ?? '-';
                $sRet = $resposta;
            }
            else
            {
                $retAtualiza = $this->atualizaBoleto($ret, $idBoleto);
                if(strlen($retAtualiza['urlBoleto'] != "") > 10){ //se vier a url do boleto
                    //sc_btn_display('boleto_pedido', 'on'); Caio testes
                    $sRet = 'Boleto criado com sucesso.';
                    //[conn_linkboleto] = $retAtualiza['urlBoleto']; Caio testes
                }
                else{
                    if($retAtualiza['status'] == 'processing'){
                        $sRet = 'Boleto está sendo processado.';
                    }
                    else{
                        $sRet = 'Boleto: ' . $retAtualiza['status'];
                    }
                }
            }
        }
        else
        {
            $sRet = $status['mensagem'];	
        }	
    }
    
    return $sRet;

}
?>

getUrlPagina:
<?php
 function getUrlPagina {
    $url = "http://scriptcase.iceos.com.br/scriptcase9/app/CERTO";

if( !empty( $_SERVER['HTTP_X_FORWARDED_SERVER'] ) )
{
	$sHost = $_SERVER['HTTP_X_FORWARDED_SERVER'];
} 
else 
{
	$sHost = $_SERVER['HTTP_HOST'];
}

if( strpos( $sHost, "scriptcase." ) !== FALSE )
{
	$protocolo = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS']=="on") ? "https" : "http");
	$url = $protocolo.'://'.$_SERVER['HTTP_HOST'];
}	

return $url; 
 }
?>

<?php
if ([conn_fidelidade] == 'S') {
 
    if ({isenta_multa} == 'N') {
        $teste = "MULTA ISENTA";
    } else {
        $teste = "CRIEI BOLETO";
    }
    die("FIM DO FLUXO " . $teste);
} else {
 
    die("[conn_fidelidade] não é 'S'");
}
//-------------------------
if ({checkbox} == 0){

    marcada

}else{

    nao marcada

}


if ({isentar_multa}) {
    echo "funciona"; 
} else {
    echo "Não funciona"; 
}


if ({isentar_multa} == "1") {
    echo "Funfa";
} else {
    echo "Não funfa";
}

die ("fim!");




if ({flag_status} == 'S') {
    if ({ctemp_tsdt_pedidocancelamento} < date('Y-m-d')) {
        sc_error_message({lang_err_dtpedidocancelinv});
    }
}

if ({conn_fidelidade} == 'S') {
    if ({conn_isentamulta} == 'N') {        
        $teste = "CRIEI BOLETO";
        // Substitua 'NOME_DO_CONTROLE' pelo nome do controle que você deseja chamar
        sc_redir('NOME_DO_CONTROLE', '', '_blank');
    }
    
    $teste = "MULTA ISENTA";
    die("FIM DO FLUXO " . $teste);
}

die({conn_fidelidade});
