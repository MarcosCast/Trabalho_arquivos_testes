<?php


function gerarBoleto($p_idPrecadastro) {

    $ret_boleto = array();

    $SQL = "SELECT binu_documento, 
                    vcnm_razaosocial, 
                    ctemp_dmvl_taxaadesao, 
                    binu_telefone1, 
                    vcem_financeiro, 
                    binu_cpf,
                    dtdt_vencimentoboletoadesao,
                    tpads_inid_tipoadesao,
                    conag_inid_contratoagentenegocio".  
            " FROM empresa.ut_precadastroempresa ".
                    " WHERE inid_precadastroempresa = ".$p_idPrecadastro;
        
    sc_lookup(rsPre, $SQL);
        
    if ( isset({rsPre[0][0]}) ) 
    {
        $nome 			= {rsPre[0][1]};
        $valorAdesao  	= {rsPre[0][2]};
        $email 		  	= trim({rsPre[0][4]});
        $cpf			= cprime_completaZerosEsquerda( 11, {rsPre[0][5]} );
        $dtVencBoleto 	= {rsPre[0][6]};
    
        
        $valorAdesao = str_replace("." , "" , $valorAdesao ); 
        $valorAdesao = str_replace("," , "" , $valorAdesao); 
    
        
        if( empty(trim($dtVencBoleto)) )
        {
            $dtVencBoleto = date('Y-m-d', strtotime("+2 days"));
        }	
        
        //Verificando tipo de adesao igual 2 = Cobrado do Representante
        if( {rsPre[0][7]} == 2 )
        {
            $SQL = "SELECT parcm_vcnm_razaosocialparceirocomercial, parcm_vcem_parceirocomercial ". 
                    " FROM distribuidor.vw_contratoagentenegocio ".
                        " WHERE conag_inid_contratoagentenegocio = ".{rsPre[0][8]};
            
            sc_lookup(rsAgn, $SQL);
            
            if ( isset({rsAgn[0][0]}) ) 
            {
                $nome 	= {rsAgn[0][0]};
                $email 	= trim({rsAgn[0][1]});
            }	
        
        }	
        
        $porta = 80;
        $url = "http://scriptcase.iceos.com.br/scriptcase9/app/moises/moises_pagarme/?".
        //$url = "http://moises.nossofiscal.com.br/moises_pagarme/?".	
                    "nmgp_outra_jan=true&nmgp_start=SC&script_case_session=dc6938ede908e4e83eb1672b40a45d36&1494";
    
        $method 		= "BOLETO_BANCARIO";
        $demo 			= "N";
        $token 			= "n05SOTEchDTWq5aEcKTpcq1Mhhr8T4So4W5VlRc7WUCPQzE63113587ec34d";
        
        $param ="&token=".$token.
                "&acao=".$method.
                "&demo=".$demo.
                "&ar=N".
                "&amount=".$valorAdesao.
                "&payment_method=boleto".
                "&async=false".
                "&customer_external_id=".$p_idPrecadastro.
                "&customer_name=".$nome.
                "&customer_type=individual".
                "&boleto_expiration_date=".$dtVencBoleto.
                "&customer_country=br".
                "&postback_url=https://sistemas.nossosolucoes.com.br/app/JOSE/blnk_postback_boletopagarme".
                "&customer_phone_numbers=%2B55".{rsPre[0][3]}.
                "&customer_email=".$email.
                "&json_customer_documents={\n \"type\": \"cpf\",\n \"number\" : \"".$cpf."\"\n}"; 
            
        
        $ws = sc_webservice("curl", 
                            $url, 
                            $porta, 
                            "POST",
                            $param,
                            array( CURLOPT_HTTPHEADER => array("Authorization: dfasdfs"))
                           );
        
        //echo($ws);
        //die;
        
        $ret_boleto = gravarRetornoWS($ws, $dtVencBoleto, {rsPre[0][2]} );
        
        return $ret_boleto; 
    
    }	
    
    
    //$dtPart = date('Ymd');
    //$hrPart = date('His');
    
    //number_format({comven_dmvl_valortransacao},2,".","");
    //sc_format_num($valorAdesao, '.', '', 2, 'S', '1', '');
    
    //Exemplo do Boleto
    
    //Todens Antigos
    //$token 			= "1YS6g9uot0pS9KLDfOJLg7QB64R4i7f614bfJcpFh6BzR3x9xMpUG4PxEoZl";
    //$token 			= "fGQtyTEchDTWq5aEcKTpcq1Mhhr8T4So4W5VlRc7WUCPQzE63113587ec34d";
    
    /*$ret_boleto = '{"object":"transaction","status":"waiting_payment","refuse_reason":null,"status_reason":"acquirer","acquirer_response_code":null,"acquirer_name":"pagarme","acquirer_id":"6048eb89864971001965e6ab","authorization_code":null,"soft_descriptor":null,"tid":461066922,"nsu":461066922,"date_created":"2021-12-10T13:20:09.096Z","date_updated":"2021-12-10T13:20:10.111Z","amount":1000,"authorized_amount":1000,"paid_amount":0,"refunded_amount":0,"installments":1,"id":461066922,"cost":0,"card_holder_name":null,"card_last_digits":null,"card_first_digits":null,"card_brand":null,"card_pin_mode":null,"card_magstripe_fallback":false,"cvm_pin":false,"postback_url":null,"payment_method":"boleto","capture_method":"ecommerce","antifraud_score":null,"boleto_url":"https://api.pagar.me/1/boletos/live_ckx0f2hgm8lx50hm5d7x4ll2a","boleto_barcode":"23791.22928 60009.516794 62000.046904 8 88330000001000","boleto_expiration_date":"2021-12-13T03:00:00.000Z","referer":"api_key","ip":"51.79.82.137","subscription_id":null,"phone":null,"address":null,"customer":{"object":"customer","id":231207262,"external_id":"1","type":"individual","country":"br","document_number":null,"document_type":"cpf","name":"Paulo Ricardo","email":"cliente@email.com","phone_numbers":["+551199934343"],"born_at":null,"birthday":null,"gender":null,"date_created":"2021-12-10T13:20:09.056Z","documents":[{"object":"document","id":"doc_ckx0f2hdh05ue0h9t664qnvhv","type":"cpf","number":"01234567890"}]},"billing":null,"shipping":null,"items":[],"card":null,"split_rules":null,"metadata":{},"antifraud_metadata":{},"reference_key":null,"device":null,"local_transaction_id":null,"local_time":null,"fraud_covered":false,"fraud_reimbursed":null,"order_id":null,"risk_level":"unknown","receipt_url":null,"payment":null,"addition":null,"discount":null,"private_label":null,"pix_qr_code":null,"pix_expiration_date":null}';
    
    //gravarRetornoWS($ret_boleto);
    
    //die;
    */
    
    //$link_temp = "";
    

}






?>