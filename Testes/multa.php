<?php

//Método PHP
function atualizaValores() {

    {valor_total} = {valor_base} - {desconto};
  //  {valor_custo_produto} = {quantidade} * {valor_custo_produto};
}

//Evento AJAX
if ({ctemp_dnvl_consuminimo} > 0) {
   
    if ( {desconto_multa} > {ctemp_dnvl_consuminimo} ) 
    {
        sc_error_message("O valor do desconto não pode ser maior que o valor do produto");

    } else
    {
        //mAtualizaValores();
        {total_multa} = {ctemp_dnvl_consuminimo} - {desconto_multa};
    }
} else 
{
    //Desabilitar o botão de desconto
}

if ({fidelidade} < 365) {
    
    {dia_multa} = 365 - {fidelidade};


    {taxa_multa} = {valor_base} * {mes_multa};
    {multa} = {valor_base} + {taxa_multa};

}

$taca_multa = 12 - $periodo[1]

//---------------------------------------------------------------------------

$desconsiderar_operacao = (isset($_POST['isentar_multa']) && $_POST['isentar_multa'] == 'on');

if (!$desconsiderar_operacao) {
    $periodo = sc_date_dif_2({ctemp_tsdt_cadastramento}, "aaaa-mm-dd", $data_atual, "aaaa-mm-dd", 1);

    if( $periodo[2] >= 1){
        sc_alert("Fim de Fidelidade!");
    } else {
        $mes_multa = 12 - $periodo[1];
        $multa_t =  {ctemp_dmvl_consumominimo} * $mes_multa;
        {total_multa} = $multa_t;
        {total_boleto} = $multa_t;
        //sc_alert("Multa de: R$ " .$multa_t);
    }
}


//----------------------------------------------------------------------------


$total_dias = sc_date_dif($data_atual, "aaaa-mm-dd", {data_vencimento}, "dd/mm/aaaa");
    
























?>