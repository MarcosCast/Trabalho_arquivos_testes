<?php

function gravarRetornoWS($p_wsretorno, $p_vencimento, $p_valor) {

    $jsonRetorno = $p_wsretorno;
    $arrWS = json_decode($jsonRetorno, true);
    $arr_boleto = array();
    
    //echo "<pre>P1: "; print_r( $arrWS ); echo "</pre>";
    //$arrWS2 = $arrWS['customer']['external_id'];
        //P4: {"errors":[{"parameter_name":"amount","type":"invalid_parameter","message":"valor inválido"}],"url":"/transactions","method":"post"}
    
    if (isset($arrWS)) 
    {
        if (isset($arrWS['errors'])) 
        {
            $arr_boleto["error"]   = $arrWS['errors'][0]['parameter_name'];
            $arr_boleto["message"] = $arrWS['errors'][0]['message'];
            
            return $arr_boleto;
        }	
        
        if (isset($arrWS['object'])) 
        {
            //$obj = 		$arrWS['object'];
            $status 	= $arrWS['status']; 
            $idPreCad 	= $arrWS['customer']['external_id'];
            $idBoleto 	= $arrWS['customer']['id'];
    
            $arr_boleto["vencimento"] 	= $arrWS['boleto_expiration_date']; 
            $arr_boleto["email"] 		= $arrWS['customer']['email']; 
    
            
            // Cadastra Boleto de Adesao.
            $SQL = "INSERT INTO gestorcard.ut_boletoadesao ".
                                " ( ".
                                    " inid_precadastroempresa, ".
                                    " vencimento_original, ".
                                    " valor, ".
                                    " idboleto_pagarme, link_boleto ".
                                " ) ".
                                " VALUES ".
                                " ( ".
                                    $idPreCad.", ".
                                    "'".$p_vencimento."', ".
                                    $p_valor.
                                    ",".$idBoleto.
                                    ",''".
                                ")";
    
            sc_exec_sql($SQL);
            
        }		
    }
    
    //echo "<pre>P4: "; print_r( $arr_boleto ); echo "</pre>";
    //die;
    
    return $arr_boleto;
    
        
        
        //$SQL = " Update gestorcard.ut_boletoadesao ".
        //		" Set retorno_pagarme = '".$ws."'".
            //	" Where inid_precadastroempresa = ".$p_idPrecadastro;
    
                //sc_exec_sql($SQL);

}
