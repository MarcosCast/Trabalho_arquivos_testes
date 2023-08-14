//------------------------------------------------------------

function getTecla(event){
	if(navigator.appName.indexOf("Netscape")!= -1) {
		return event.which;
	}
	else {
		return event.keyCode;
	}
}

function getChar(event){
	return String.fromCharCode(getTecla(event));
}

function valida_tecla(campo, event, acceptEnter) {
	var BACKSPACE = 8;
	var TAB = 9;
	var key;
	var tecla;
	CheckTAB=true;
	tecla = getTecla(event);
	key = String.fromCharCode(tecla);
	if (tecla == 13) {
		if(acceptEnter){
			return true;
		} else {
			return false;
		}
	}
	if (tecla == BACKSPACE) {
		return true;
	}
	if(event.keyCode == TAB){
		return true;
	}
	return (isNum(key));
}

function valida_tecla_data(campo, event, pattern) {
	var BACKSPACE = 8;
	var key;
	var tecla;
	CheckTAB=true;

	tecla = getTecla(event);

	//ignorar se for TAB .. no firefox o tab é acusado 0
	if(tecla == 0){
		return true;
	}
	//ignorar se for SHIFT
	if(tecla == 16){
		return false;
	}
	
	key = String.fromCharCode(tecla);
		
	if(tecla != 8){
		var l = campo.value.length;
		
		var charBefore;
		if(l > 0){
			charBefore = pattern.charAt(l - 1);
		}
		var currChar = pattern.charAt(l);
		if(	(currChar == 'm' ||
			currChar == 's') && charBefore != currChar){ //primeira casa dos minutos ou segundos
			return isTime(key);
		}
		if( (currChar == 'h' || currChar == 'H') && charBefore != currChar){ //primeira casa da hora
			return key == '0' || key == '1' || key == '2';
		} else if( (currChar == 'h' || currChar == 'H') && charBefore == currChar){ //segunda casa da hora
			if(campo.value.charAt(l - 1) == '2'){
				return key == '0' || key == '1' || key == '2'|| key == '3';
			}
		}
		
		if( (currChar == 'M' ) && charBefore != currChar){ //primeira casa do mes
			return key == '0' || key == '1';
		} else if( (currChar == 'M' ) && charBefore == currChar){ //segunda casa do mes
			if(campo.value.charAt(l - 1) == '1'){
				return key == '0' || key == '1' || key == '2';
			} else if(key == '0'){
				return false;
			}
		}
		if( (currChar == 'd' ) && charBefore != currChar){ //primeira casa do dia
			return key == '0' || key == '1' || key == '2' || key == '3';
		} else if( (currChar == 'd' ) && charBefore == currChar){ //segunda casa do dia
			if(campo.value.charAt(l - 1) == '3'){
				return key == '0' || key == '1';			
			} else if(campo.value.charAt(l - 1) == '0' && key == '0'){
				return false;
			}
		}
	}

	if (tecla == 13) {
		return false;
	}
	if (tecla == BACKSPACE) {
		return true;
	}

	return (isNum(key));
	
}

function isTime( caractere ) { 
	var strValidos = '012345';
	if (strValidos.indexOf(caractere) == -1) {
		return false; 
	}
	return true; 
}

function isNum( caractere ) { 
	var strValidos = '0123456789'; 
	if (strValidos.indexOf(caractere) == -1) {
		return false; 
	}
	return true; 
}

//------------------------------------------------------------

function mascara_hora(el) {
	var myhour = '';
	myhour = myhour + el.value; 
	if (myhour.length == 2) {
		myhour = myhour + ':'; 
		el.value = myhour; 
	}
	/*
	if(myhour.length == 5) {
		if(!verifica_hora(myhour)) {
			el.value='';
		}
	}
	*/
}

function verifica_hora(hour) {
	situacao = 1;
	hora = (hour.substring(0,2)); 
	minutos = (hour.substring(3,5)); 
	ponto = (hour.substring(2,3));
	if(hora>24) {
		situacao = 0;
		if(minutos>60) {
			situacao = 0;
			if(ponto != ':') {
				situacao = 0;
				if(situacao==0) {
					alert('Hora inválida! Exemplo de hora válida: 09:30');
					hour.value='';
					return false;
				}
				return true;
			}
		}
	}
}

//------------------------------------------------------------

function mascara_data(el, event, pattern) {
	var tecla = getTecla(event);
	if(tecla != 8){
		var mydata = el.value;
		var l = mydata.length;
		
		var currChar = pattern.charAt(l);
		if( currChar != 'd' && 
			currChar != 'M' &&
			currChar != 'y' &&
			currChar != 'h' &&
			currChar != 'm' &&
			currChar != 's' &&
			currChar != 'H'){
			mydata = mydata + currChar;
			el.value = mydata;
		}
		
		var beforeChar = pattern.charAt(l - 1);
		if( beforeChar != 'd' && 
			beforeChar != 'M' &&
			beforeChar != 'y' &&
			beforeChar != 'h' &&
			beforeChar != 'm' &&
			beforeChar != 's' &&
			beforeChar != 'H' &&
			beforeChar != mydata.charAt(l - 1)){
			mydata = mydata.substring(0, l-1) + beforeChar + mydata.substring(l-1);
			el.value = mydata;
		}
	}
	/*
	if(pattern == 'null'
	 || pattern == ''){
		pattern = 'dd/MM/yyyy';
	}
	if(pattern == 'dd/MM/yyyy'){
		var mydata = el.value;
	
		if (mydata.length == 2 && getTecla(event) != 8) { //s� colocar a / se nao foi backspace
			mydata = mydata + '/';
			el.value = mydata;
		}
		if (mydata.length == 5 && getTecla(event) != 8) {
			mydata = mydata + '/';
			el.value = mydata;
		}
		
		//o usuario pode ter digitado backspace e depois inserir um número... entao temos que colocar a barra
		var iBarras = 0;
		for(var i = 0; i < mydata.length; i++){
			if(mydata.charAt(i) == '/'){
				iBarras ++;
			}
		}
		
		if(mydata.length == 3 && iBarras == 0){
			mydata = mydata.substring(0,2) + '/' + mydata.substring(2);
			el.value = mydata;
		}
		if(mydata.length == 6 && iBarras == 1){
			mydata = mydata.substring(0,5) + '/' + mydata.substring(5);
			el.value = mydata;
		}	
	
		if (mydata.length == 10) {
			if(!verifica_data(mydata)) {
				el.value='';
			}
		}
	} else if(pattern == 'dd/MM/yyyy hh:mm'){
		var mydata = el.value;
	
		if (mydata.length == 2 && getTecla(event) != 8) { //s� colocar a / se nao foi backspace
			mydata = mydata + '/';
			el.value = mydata;
		}
		if (mydata.length == 5 && getTecla(event) != 8) {
			mydata = mydata + '/';
			el.value = mydata;
		}
		if (mydata.length == 10 && getTecla(event) != 8) {
			mydata = mydata + ' ';
			el.value = mydata;
		}
		if (mydata.length == 13 && getTecla(event) != 8) {
			mydata = mydata + ':';
			el.value = mydata;
		}
		
		//o usuario pode ter digitado backspace e depois inserir um número... entao temos que colocar a barra
		var iBarras = 0;
		var iEspaco = 0;
		var iDoispontos = 0;
		for(var i = 0; i < mydata.length; i++){
			if(mydata.charAt(i) == '/'){
				iBarras ++;
			} else if(mydata.charAt(i) == ' '){
				iEspaco ++;
			} else if(mydata.charAt(i) == ':'){
				iDoispontos ++;
			}
		}
		
		if(mydata.length == 3 && iBarras == 0){
			mydata = mydata.substring(0,2) + '/' + mydata.substring(2);
			el.value = mydata;
		}
		if(mydata.length == 6 && iBarras == 1){
			mydata = mydata.substring(0,5) + '/' + mydata.substring(5);
			el.value = mydata;
		}	
		if(mydata.length == 11 && iEspaco == 0){
			mydata = mydata.substring(0,10) + ' ' + mydata.substring(10);
			el.value = mydata;
		}	
		if(mydata.length == 14 && iDoispontos == 0){
			mydata = mydata.substring(0,13) + ':' + mydata.substring(13);
			el.value = mydata;
		}			
	
	} else {
		alert('Padr�o n�o suportado '+pattern);
	}
	*/
}

function verifica_data(campo) {
	var data = campo.value;
	var situacao = '';
	var incomplete = '';

	if (data.length == 0) {
		return true;
	}

	if (data.length != 10) {
		incomplete = 'true';
	}
	else {
		mes = (data.substring(3,5));
	
		// verifica se o mes e valido
		if (mes < 1 || mes > 12 ) {
			situacao = 'falsa';
		}
		else {
			dia = (data.substring(0,2));

			// Verifica se o dia é válido para cada mês, exceto fevereiro.
			if (dia < 1 || dia > 31 || (dia > 30 && (mes == 4 || mes == 6 || mes == 9 || mes == 11))) {
				situacao = 'falsa';
			}
			
			ano = (data.substring(6,10));
			// Verifica se o dia é válido para o mês de fevereiro.
			if (mes == 2 && (dia < 1 || dia > 29 || (dia > 28 && (parseInt(ano/4) != ano/4)))) {
				situacao = 'falsa';
			}
		}
	}

	if(incomplete == 'true'){
		alert('Formato de data incorreto! '+ campo.value);
		setTimeout(function(){campo.focus()},0);
		campo.value = '';
		return false;
	}
	
	if (situacao == 'falsa') {
		alert('Data incorreta! '+ campo.value);
		setTimeout(function(){campo.focus()},0);
		campo.value = '';
		return false;
	}
	return true;
}

//------------------------------------------------------------

function mascara_cpf(el) {
	var mydata = '';
	mydata = mydata + el.value;
	if (mydata.length == 3) {
		mydata = mydata + '.';
		el.value = mydata;
	}
	if (mydata.length == 7) {
		mydata = mydata + '.';
		el.value = mydata;
	}
	if (mydata.length == 11) {
		mydata = mydata + '-';
		el.value = mydata;
	}
}

//------------------------------------------------------------

function mascara_cep(el) {
	var mydata = '';
	mydata = mydata + el.value;
	if (mydata.length == 5) {
		mydata = mydata + '-';
		el.value = mydata;
	}
}

//------------------------------------------------------------

function mascara_cnpj(el) {
	var mydata = '';
	mydata = mydata + el.value;
	if (mydata.length == 2) {
		mydata = mydata + '.';
		el.value = mydata;
	}
	if (mydata.length == 6) {
		mydata = mydata + '.';
		el.value = mydata;
	}
	if (mydata.length == 10) {
		mydata = mydata + '/';
		el.value = mydata;
	}
	if (mydata.length == 15) {
		mydata = mydata + '-';
		el.value = mydata;
	}
}

function formata_cnpj (numCICEl) {
	numCIC = String(ApenasNum(numCICEl.value));
	switch (numCIC.length) {
		case 15 :
			numCICEl.value = numCIC.substring(0,2) + "." + numCIC.substring(2,5) + "." + numCIC.substring(5,8) + "/" + numCIC.substring(8,12) + "-" + numCIC.substring(12,14);
			return;
		case 0:
			return;
		default : 
			alert("Tamanho incorreto do CNPJ. O CNPJ deve conter 15 d�gitos");
			numCICEl.focus();
			return;
	}
}

//------------------------------------------------------------

function mascara_float(campo, event) {
	var tecla = 0;
    tecla = getTecla(event);
	/*
	if(tecla == 190 || tecla == 110) {
		//alert(tecla);
		campo.value = campo.value + ',';
		return false;
	}
	*/

	// Falta o caractere ',' (virgula) do teclado numérico.
	if (  (tecla == 109 && campo.value == '') || (tecla == 189 && campo.value == '') // tecla '-' (s� � possivel se for a primeira posicao)
			|| (tecla >= 48 && tecla <= 57) || (tecla >= 96 && tecla <= 105)
	 		|| tecla == 110 || tecla == 188 || tecla == 190
	  		|| tecla == 8 || tecla == 9 || tecla == 13
	    	|| tecla == 37 || tecla == 39
	    	|| tecla == 45 || tecla == 46 || tecla == 35 || tecla == 36
		    || (tecla == 67 || tecla == 86 && event.ctrlKey)) {
		if(tecla == 188){// n�o pode inserir duas virgulas (TODO colocar a condicao da virgula do teclado numerico)
			return campo.value.indexOf(',') < 0;
		}
		return true;
	}

	return false; 
}

//------------------------------------------------------------

function mascara_inscricaoestadual(el) {
	var mydata = '';
	mydata = mydata + el.value;
	if (mydata.length == 13) {
		mydata = mydata + '-';
		el.value = mydata;
	}
}
//------------------------------------------------------------

function mascara_integer(campo, event, onlypositive) {
	var tecla = getTecla(event);

	// Falta o caractere ',' (virgula) do teclado numérico.
	if ( (tecla == 109 && campo.value == '' && !onlypositive) || (tecla == 189 && campo.value == '' && !onlypositive) // tecla '-' (s� � possivel se for a primeira posicao)
		  ||(tecla >= 48 && tecla <= 57) || (tecla >= 96 && tecla <= 105)
	      || tecla == 8 || tecla == 9 || tecla == 13
	      || tecla == 37 || tecla == 39
	      || tecla == 45 || tecla == 46 || tecla == 35 || tecla == 36
	      || ((tecla == 67 || tecla == 86) && event.ctrlKey)
		) {
		return true; 
	}

	return false; 
}
	
//------------------------------------------------------------

/**
 * Verifica se a string é um número
 */
function isNumber (numExp){
	if (numExp != ""){
		if (isNaN(numExp) || (numExp.length == 0)){
			return false;
		}  
	} 
	return true;
}


function verifica_money(campo,event){
	var tecla = getTecla(event);
	if (tecla == 0 || tecla == 8 || tecla >= 48 && tecla <= 57) { 
		return true;
	}else return false;
}

function formata_money(campo, event, onlypositive) {
	var tecla = getTecla(event);
	tammax = 12;
	vr = campo.value;
	vr = vr.replace( "/", "" );
	vr = vr.replace( "/", "" );
	vr = vr.replace( ",", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	tam = vr.length;
	 
	if (tecla == 188 || tecla == 190 || tecla == 110 || tecla == 108) {
		return false;
	}

	if (tam < tammax && tecla != 8) {
		tam = vr.length + 1 ;
	}
	
	if(tam == tammax && tecla != 9){
		return false;
	}

	if (tecla == 8 ) {
		tam = tam - 1 ;
	}

	if (tecla == 8 || tecla >= 48 && tecla <= 57 || tecla >= 96 && tecla <= 105) {
		if (tam <= 2) { 
			campo.value = vr ;
		}
		if  (tam > 2) {
			campo.value = vr.substr(0, tam - 2) + ',' + vr.substr(tam - 2, tam) ;
		}
	//	if ( tam >= 6 && tam <= 8) {
	//		campo.value = vr.substr(0, tam - 5) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam) ;
	//	}
	//	if ( tam >= 9 && tam <= 11) {
	//		campo.value = vr.substr(0, tam - 8) + '.' + vr.substr(tam - 8, 3) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam) ;
	//	}
	//	if ( tam >= 12 && tam <= 14) {
	//		campo.value = vr.substr(0, tam - 11) + '.' + vr.substr(tam - 11, 3) + '.' + vr.substr(tam - 8, 3) + '.' + vr.substr(tam - 5, 3) + ',' + vr.substr(tam - 2, tam);
	//	}
	//	if ( (tam >= 15) && (tam <= 17) ) {
	//		campo.value = vr.substr(0, tam - 14) + '.' + vr.substr(tam - 14, 3) + '.' + vr.substr(tam - 11, 3) + '.' + vr.substr(tam - 8, 3 + '.' + vr.substr( tam - 5, 3) + ',' + vr.substr(tam - 2, tam) ;}
	//	}
	}
	
	
	//verifica a tecla
	if ( (tecla == 109 && campo.value == '' && !onlypositive) || (tecla == 189 && campo.value == '' && !onlypositive) // tecla '-' (s� � possivel se for a primeira posicao)
		  ||(tecla >= 48 && tecla <= 57) || (tecla >= 96 && tecla <= 105)
	      || tecla == 8 || tecla == 9 || tecla == 13
	      || tecla == 37 || tecla == 39
	      || tecla == 45 || tecla == 46 || tecla == 35 || tecla == 36
	      || ((tecla == 67 || tecla == 86) && event.ctrlKey)) {
		return true; 
	}

	return false; 
}

//------------------------------------------------------------

function mascara_telefone(el) {
	var mydata = '';
	mydata = mydata + el.value;
	if (mydata.length == 1) {
		mydata = '(' + mydata;
		el.value = mydata;
	}
	if (mydata.length == 3) {
		mydata = mydata+') ';
		el.value = mydata;
	}
	if (mydata.length == 9) {
		mydata =  mydata + '-';
		el.value = mydata;
	}
}

//------------------------------------------------------------

//MASCARA DO MONEY

documentall = document.all;

function formatamoney(c) {
	var t = this; if(c == undefined) c = 2;
	var p, d = (t=t.split("."))[1].substr(0, c);
	for(p = (t=t[0]).length; (p-=3) >= 1;) {
		t = t.substr(0,p) + "." + t.substr(p);
	}
	return t+","+d+Array(c+1-d.length).join(0);
}

String.prototype.formatCurrency=formatamoney

function demaskvalue(valor, currency, allowNegative){

	// Se currency é false, retorna o valor sem apenas com os números. Se é true, os dois últimos caracteres são considerados as
	// casas decimais
	var val2 = '';
	var strCheck = '0123456789';
	if (allowNegative) {
		strCheck = '-0123456789';
	}
	
	var len = valor.length;
	if (len== 0){
		return 0.00;
	}

	if (currency ==true){
	// Elimina os zeros à esquerda
	// a variável <i> passa a ser a localização do primeiro caractere após os zeros e
	// val2 contém os caracteres (descontando os zeros à esquerda)
		for(var i = 0; i < len; i++)
			if ((valor.charAt(i) != '0') && (valor.charAt(i) != ',')) break;

		for(; i < len; i++){
			if (strCheck.indexOf(valor.charAt(i))!=-1) val2+= valor.charAt(i);
		}

		if(val2.length==0) return "0.00";
		if (val2.length==1)return "0.0" + val2;
		if (val2.length==2)return "0." + val2;

		var parte1 = val2.substring(0,val2.length-2);
		var parte2 = val2.substring(val2.length-2);
		var returnvalue = parte1 + "." + parte2;
		return returnvalue;

	} else{
		// currency é false: retornamos os valores COM os zeros à esquerda,
		// sem considerar os últimos 2 algarismos como casas decimais
		val3 ="";
		for(var k=0; k < len; k++){
			if (strCheck.indexOf(valor.charAt(k))!=-1) val3+= valor.charAt(k);
		}
		return val3;
	}
}

function reais(obj,event,allowNegative){
	var whichCode = (event.which) ? event.which : event.keyCode;
	
	//Executa a formatação após o backspace nos navegadores !document.all
	if (whichCode == 8 && !documentall && obj.value != "") {

		//Previne a ação padrão nos navegadores
	
		if (event.preventDefault){ //standart browsers
			event.preventDefault();
		}else{ // internet explorer
			event.returnValue = false;
		}
		var valor = obj.value;
		var x = valor.substring(0,valor.length-1);
		obj.value= demaskvalue(x,true,allowNegative).formatCurrency();
		
		if(obj.value == "0,00") obj.value = "";
		
		return false;
	}

	//Executa o Formata Reais e faz o format currency novamente após o backspace
	FormataReais(obj,'.',',',event, allowNegative);

} // end reais


function backspace(obj,event){

	//Essa função basicamente altera o backspace nos input com máscara reais para os navegadores IE e opera.
	//O IE não detecta o keycode 8 no evento keypress, por isso, tratamos no keydown.
	//Como o opera suporta o infame document.all, tratamos dele na mesma parte do código.
	
	var whichCode = (event.which) ? event.which : event.keyCode;
	if (whichCode == 8 && documentall && obj.value != "") {
		var valor = obj.value;
		var x = valor.substring(0,valor.length-1);
		var y = demaskvalue(x,true,false).formatCurrency();
		
		obj.value =""; //necessário para o opera
		obj.value += y;
	
		if(obj.value == "0,00") obj.value = "";
	
		if (event.preventDefault){ //standart browsers
			event.preventDefault();
		}else{ // internet explorer
			event.returnValue = false;
		}
		return false;

	}// end if
}// end backspace

function FormataReais(fld, milSep, decSep, e, allowNegative) {
	var sep = 0;
	var key = '';
	var i = j = 0;
	var len = len2 = 0;
	var strCheck = '0123456789';
	if (allowNegative) {
		strCheck = '-0123456789';
	}
	var aux = aux2 = '';
	var whichCode = (e.which) ? e.which : e.keyCode;
	
	//if (whichCode == 8 ) return true;
	//backspace - estamos tratando disso em outra função no keydown
	if (whichCode == 0 ) return true;
	if (whichCode == 9 ) return true; //tecla tab
	if (whichCode == 13) return true; //tecla enter
	if (whichCode == 16) return true; //shift internet explorer
	if (whichCode == 17) return true; //control no internet explorer
	if (whichCode == 27 ) return true; //tecla esc


	//O trecho abaixo previne a ação padrão nos navegadores. Não estamos inserindo o caractere normalmente, mas via script
	

	if (e.preventDefault){ //standart browsers
		e.preventDefault()
	}else{ // internet explorer
		e.returnValue = false
	}

	var key = String.fromCharCode(whichCode); // Valor para o código da Chave
	if (strCheck.indexOf(key) == -1) return false; // Chave inválida


	//Concatenamos ao value o keycode de key, se esse for um número
	var tammax;
	if($(fld).attr("maxlengthmoney") != null){
		tammax = $(fld).attr("maxlengthmoney");
	} else {
		tammax = 21;
	}
	
	if(fld.value.length < tammax){
		fld.value += key;
		var len = fld.value.length;
		var bodeaux = demaskvalue(fld.value,true, allowNegative).formatCurrency();
		fld.value=bodeaux;
	}

	//Essa parte da função tão somente move o cursor para o final no opera. Atualmente não existe como movê-lo no konqueror.
	
	if (fld.createTextRange) {
		var range = fld.createTextRange();
		range.collapse(false);
		range.select();
	}
	else if (fld.setSelectionRange) {
		fld.focus();
		var length = fld.value.length;
		fld.setSelectionRange(length, length);
	}
	
	return false;

}

function valida_tecla_integer(campo, event, acceptEnter) {
	var BACKSPACE = 8;
	var TAB = 9;
	var DELETE = 46;
	var LEFTARROW = 37;
	var RIGTHARROW = 39;
	var HOME = 36;
	var END = 35;
	var key;
	var tecla;
	CheckTAB=true;
	tecla = getTecla(event);
	key = String.fromCharCode(tecla);
	
	if (tecla == 13) {
		if(acceptEnter){
			return true;
		} else {
			return false;
		}
	}
	
	if (event.keyCode == BACKSPACE || event.keyCode == TAB || event.keyCode == DELETE || event.keyCode == LEFTARROW || event.keyCode == RIGTHARROW || event.keyCode == HOME || event.keyCode == END) {
		return true;
	}
	
	return (isNum(key));
}
//===================================================================================




function get_pasted_text(e) {
	var pastedText = undefined;
	if (window.clipboardData && window.clipboardData.getData) { // IE
		pastedText = window.clipboardData.getData('Text');
	} else if (e.clipboardData && e.clipboardData.getData) {
		pastedText = e.clipboardData.getData('text/plain');
	}
	return pastedText;
} 

function valida_paste_integer(e) {
  var pastedNumber = get_pasted_text(e);
  if(isNaN(pastedNumber) || parseFloat(pastedNumber)%2==0){
      e.preventDefault();
      return false;
   }
}

function valida_paste_float(e) {
 	var pastedNumber = get_pasted_text(e).replace(',', '.');
	if(isNaN(pastedNumber)){
 		e.preventDefault();
		return false;
	}
}

function valida_paste_money(e) {
  var pastedNumber = get_pasted_text(e).replace(',', '.');
  if(isNaN(pastedNumber) || pastedNumber.substring(pastedNumber.indexOf(".")+1).length>2){
      return false;
   }
}

function excluirAutocomplete(idInput){

	$('#' + idInput).val("<null>").trigger("change");
}

function applyAutocomplete(){
	$("[rel=select2]").each(function(){
		doAutocomplete(this);
	});
}

function applyAutocompleteDetalhe(id_detalhe){
	$("#"+id_detalhe+" [rel=select2]").last().each(function(){
		doAutocomplete(this);
	});
}

function doAutocomplete(self){
	$(self).select2({
        minimumInputLength: $(self).attr("startAutocomplete") || 1,
		placeholder: ' ',
        allowClear: true,
        containerCss: { 'margin-left': '0', 'padding' : '0', 'margin-right' : '0', 'border': 'none' },
        ajax: {
            url: contextoAutoComplete + "/ajax/autocomplete",
            dataType: 'json',
            data: function (term, page) {
	        	var autocompleteParametersFunction = $(self).attr('autocompleteParametersFunction');
				var inputName = $(self).attr("name");
				var parametros = autocompleteParametersFunction == "" || autocompleteParametersFunction == null ? {} : eval(autocompleteParametersFunction+"('"+inputName+"')");
		
                return $.extend({
                    q: term,
                    page_limit: 300,
                    beanName: $(self).attr("beanName"),
                    functionLoad: $(self).attr("loadFunctionAutocomplete") || '',
                    propertyLabel: $(self).attr("propertyLabel") || '',
                    propertyMatch: $(self).attr("propertyMatch") || '',
                    getterLabel: $(self).attr("getterLabel") || '',
                    matchOption: $(self).attr("matchAutocomplete") || false,
                    
                }, parametros);
            },
            results: function (data, page) {
                return {results: data.data};
            }
        },
        initSelection: function(element, callback) {
        	var valueLabel = $(element).attr('valueLabel');
        	if(valueLabel == null || valueLabel == ""){
        		return;
        	}
        	
            var id = { value: $(element).attr('valueLabel') };
            callback(id);
        },
        formatResult: function(data){
        	return data.value;	
       	},
        formatSelection: function(data){
       		$(self).attr("valueLabel", data.value);
       		return data.value;
        },  
        escapeMarkup: function (m) { return m; },
        containerCssClass: ''
    }).on('select2-removed', function(val, object){
    	$(this).val('<null>');
    });
}