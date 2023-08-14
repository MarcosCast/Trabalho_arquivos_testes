
		/**
		 * Fun??o utilizada como callback de janelas que foram criadas com o objectivo
		 * de selecionar algum bean.
		 * Possui as informa??es necess?rias para a janela saber como deve preencher o
		 * formu?rio que a chamou
		 */
		function selecionarCallbackObject(valueInput, labelInput, valueType, button, buttonUnselect, callback){
		    this.valueInput = valueInput;
			this.labelInput = labelInput;
			this.valueType  = valueType;
			this.button = button;
			this.buttonUnselect = buttonUnselect;
			this.callback = callback;
		}
		
		function imprimirVoltar(){
			if(top.cadastrar){
				document.write("<input type='button' value='Voltar' onclick='refreshPai()'>");
			}
		}
		
		function refreshPai() {
			//top.opener.document.forms[0].ACAO.value = top.cadastrar;
			//alert(top.opener.document.forms[0].ACAO.value);
			top.opener.document.forms[0].submit();
			top.close();
		}
		
		/**
		 * Imprime o bot?o selecionar onde for necess?rio
		 * O bot?o selecionar s? ? impresso onde a classe for da hierarquia da classe que pediu para selecionar
		 */
		function imprimirSelecionar(listaClasses, valor, label){
			//alert('valor '+valor+'  label '+label+'    listaclasses '+listaClasses);
			//alert(window.top.opener.selecionarCallback);
			if(window.top.selecionarCallback){
				//document.write("dd");
				var ok = false;
				for(i in listaClasses){
					var clazz = listaClasses[i];
					if(clazz == window.top.selecionarCallback.valueType){
						ok = true;
					}
				}
				
				if(ok){
					//document.write("<a href=\"javascript:alert('Info: valor="+valor+" label="+label+"')\">info</a>&nbsp;");
					document.write("<a href=\"javascript:selecionar('"+addEscape(valor)+"','"+addEscape(label)+"')\">selecionar</a>&nbsp;");				
				}
				//DEBUG ----- c?digo abaixo ? debug descomente se nao aparecer o botao selecionar
				//else {
				//	alert('A classe \n'+listaClasses[0]+' \nn?o ? a mesma ou uma subclasse de \n'+top.selecionarCallback.valueType);
				//}
			}
		}
		
		function addEscape(value){
			var newValue = '';
			for(var i=0; i<value.length; i++){
				switch(value.charCodeAt(i)){
					case 34 :
						newValue += "&quot;";
						break;
					case 39 :
						newValue += "\\'";
						break;
					case 92 :
						newValue += "\\\\";
						break;
					default:
						newValue += value.charAt(i);
						break;
				}
			}
			return newValue;
		}
		
		/**
		 *
		 */
		function selecionar(valor, label, forcombo){
			var isNN = navigator.appName.indexOf("Netscape")!= -1;
			if(top.selecionarCallback){
				if(forcombo){
				
					var callback = top.selecionarCallback;
					var callbackcallback = callback.callback;
					var onchangeFunction = callback.valueInput.onchange;
					
					callbackcallback(label, valor);
						
					if(onchangeFunction){
						onchangeFunction();
					}

					if(isNN){
						setTimeout('top.close()', 500);
					} else {
						top.close();					
					}					
				} else {

					var callback = top.selecionarCallback;
					var callbackcallback = callback.callback;
					var onchangeFunction = callback.labelInput.onchange;
					callback.valueInput.value = valor;
					callback.labelInput.value = label;

					if(callbackcallback){
						callbackcallback(label,valor);
					}
							
					if(onchangeFunction){
						onchangeFunction();
						//alert(onchangeFunction);
					}
					callback.button.style.display = 'none';
					callback.buttonUnselect.style.display = '';
					
					if(isNN){
						setTimeout('top.close()', 500);
					} else {
						top.close();					
					}

				}
				
			}

		}
		
		function preparaHtmlArea(editorurl){
			_editor_url = editorurl;
			var win_ie_ver = parseFloat(navigator.appVersion.split("MSIE")[1]);
			if (navigator.userAgent.indexOf('Mac')        >= 0) { win_ie_ver = 0; }
			if (navigator.userAgent.indexOf('Windows CE') >= 0) { win_ie_ver = 0; }
			if (navigator.userAgent.indexOf('Opera')      >= 0) { win_ie_ver = 0; }
			if (win_ie_ver >= 5.5) {
			  document.write('<scr' + 'ipt src="' +editorurl+ 'editor.js"');
			  document.write(' language="Javascript1.2"></scr' + 'ipt>');  
			}
			else { 
				document.write('<scr'+'ipt>function editor_generate() { return false; }</scr'+'ipt>'); 
			}
			//alert(_editor_url);
		}
		
		function limparCombo(combo, includeblank, currentValue,blankLabel){
			pararEm = 0;
			var remove = 1;
			
			if(combo.type == 'select-multiple'){
				currentValue = false;
			}
	
			while(combo.options.length > pararEm + remove - 1){
				//alert((combo.options.length -1));
				if(currentValue){
					if(remove == 1 && currentValue != '<null>' && combo.options[combo.options.length - 1].value == currentValue){
						remove = 2;
					}
				}
				if((combo.options.length - remove) >= 0){
					combo.remove((combo.options.length - remove));
				}
				
			}		
			
			if(blankLabel == null) blankLabel = " ";
			
			var op = new Option();
			op.text = blankLabel;
			op.value = '<null>';
			combo.options.add(op);//for�ar o redimensionamento do form
			combo.remove(pararEm + remove - 1);
			
			
			if(includeblank){
				op = new Option();
				op.text = blankLabel;
				op.value = '<null>';
				combo.options.add(op);
			}
		}
		
		
		function enableProperties(form){
			var elements = form.elements;
			for(var i = 0; i < elements.length; i++){
				var element = elements[i];
				var disabled = element.getAttribute("originaldisabled");
				if(disabled == null){
					element.disabled = false;
				}
			}
		}
		
	function autoFieldFocus(){
		var k = 0;
		var totalForms = document.forms.length;
		var find = false;
		for(k = 0; k < totalForms; k++){
			var aForm = document.forms[k];
			if( aForm != null && aForm.elements[0]!=null) {
				var i;
				var max = aForm.length;
				for( i = 0; i < max; i++ ) {
					var focus = aForm.elements[i].getAttribute("setfocus");
					var disabled = aForm.elements[i].getAttribute("disabled");
					var id = aForm.elements[i].getAttribute("id");
					if(aForm.elements[i].type != "hidden" && aForm.elements[ i ].type != "button" &&
						!aForm.elements[i].disabled && (focus != null && focus == "true") &&
						!aForm.elements[i].readOnly) {
						//alert("encontrou "+aForm.elements[ i ].value + " document.forms["+k+"].elements["+i+"].focus() " + id);
						//setTimeout("document.forms["+k+"].elements["+i+"].focus()",10);						
						aForm.elements[ i ].focus();
						find = true;
						break;
					}
				}
				if(find) break;
			}
		}
	}
	
	function addTitle(array, uri){
		var url = '';
		if(array[2] == uri){
			return ' --> '+array[1];
		}
		for(var i=4; i < array.length; i++){
			url += addTitle(array[i],uri);
		if(url != ''){
			url = ' --> '+array[1]+url;
			break;
		}
	}
		return url;	
	}

/*
 * Valida se � uma data v�lida
 */
NeoUtil.prototype.validaData = function (campo){
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

			// Verifica se o dia � v�lido para cada m�s, exceto fevereiro.
			if (dia < 1 || dia > 31 || (dia > 30 && (mes == 4 || mes == 6 || mes == 9 || mes == 11))) {
				situacao = 'falsa';
			}
			
			ano = (data.substring(6,10));
			// Verifica se o dia � v�lido para o m�s de fevereiro.
			if (mes == 2 && (dia < 1 || dia > 29 || (dia > 28 && (ano%4 != 0)))) {
				situacao = 'falsa';
			}
		}
	}

	if(incomplete == 'true' || situacao == 'falsa'){
		alert("Data inv�lida.")
		setTimeout(function(){campo.focus()},50);
		campo.value = '';
		return false;
	}
	return true;
}


/**
 * Formata CPF
 */
NeoUtil.prototype.formataCpf = function(cpf){
	return cpf.substring(0,3) + "." + cpf.substring(3,6) + "." + cpf.substring(6,9) + "-" + cpf.substring(9,11);
}

/**
 * Fun��o respons�vel por verificar os e-mails
 */
NeoUtil.prototype.checkMail = function (mail){	
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if(typeof(mail) == "string"){
    	if(mail=="") return true;
        if(er.test(mail)){ return true; }
    } else if(typeof(mail) == "object"){
    	if(mail.value=="") return true;
        if(er.test(mail.value)){ return true; }
	}	    
	return false;
}

/**
 * Retira a sele��o de um componete select ao pressionar a tecla DELETE.
 */
NeoUtil.prototype.limpaCombo = function (evento,select){
    tecla = evento.keyCode;
    if(tecla == 0) tecla = evento.charCode;	    
    if (tecla == 46) {
    	select.selectedIndex = null;
    	select.onchange();
    }
}

/**
 * Verifica se a string � um n�mero
 */
NeoUtil.prototype.isNumber = function (numExp){
	if (numExp != ""){
		if (isNaN(numExp) || (numExp.length == 0)){
			return false;
		}  
	} 
	return true;
}

var ca

/**
 * Verifica se a string � composta apenas de letras
 */
NeoUtil.prototype.isString = function (stringExp){
	var re = new RegExp;
	re = /^(([a-zA-Z�-� -])+)$/;
	if (stringExp != ""){
	  var arr = re.exec(stringExp);
	  if (arr == null){
	  	return false; 
	  }
	}
	return true;
}

/**
 * Verifica se a string � composta por n�meros, espa�o e h�fen
 */
NeoUtil.prototype.isStringNumber = function (stringExp){
	var er = new RegExp(/([^0-9\- ]+)/);
	if (stringExp != ""){
	  if(er.test(stringExp)){ return false; }
	}return true;
}

/**
 * Mostra a mensagem de carregando
 */
NeoUtil.prototype.clearForm = function(name){
	$("form[name="+name+"] input").each(function(){
		var el = $(this);
		var type = el.attr("type");
		if(type == "text"){
			el.val("");
		}
		else if (type == "date"){
			el.val("");
		} else if (type == "radio") {
			el.val('<null>');
		}
	})		
	$("form[name="+name+"] select").each(function(){
		var el = $(this);
		el.selectOptions('<null>');		
	});
	
	$("form[name="+name+"] input:hidden[beanName]").each(function(){
		$(this).attr("valueLabel", "");
		$(this).select2("val", "<null>");
	});
	$(".combobox-container input[type=hidden]").each(function(){
		$(this).val("<null>");
	});
}

NeoUtil.prototype.validationCPF = function(cpf){
if (cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333' || cpf == '44444444444' || cpf == '55555555555' ||
		cpf == '66666666666' || cpf == '77777777777' ||cpf == '88888888888' || cpf == '99999999999')
	return false;
var i;
s = cpf;
s = s.replace(/\D/g,"");
var c = s.substr(0,9);
var dv = s.substr(9,2);
var d1 = 0; 
for (i = 0; i < 9; i++){
	d1 += c.charAt(i)*(10-i);
}
if (d1 == 0){
 	return false;
}
d1 = 11 - (d1 % 11);
if (d1 > 9) d1 = 0;
if (dv.charAt(0) != d1){
	return false;
}
d1 *= 2;
for (i = 0; i < 9; i++){
	d1 += c.charAt(i)*(11-i);
}
d1 = 11 - (d1 % 11);
if (d1 > 9) d1 = 0;
if (dv.charAt(1) != d1){
	return false;
}
return true;
}

/**
*	Verifica se um CNPJ � v�lido.
*/
NeoUtil.prototype.validationCNPJ = function(cnpj){
if (cnpj == '11111111111111' || cnpj == '22222222222222' || cnpj == '33333333333333' || cnpj == '44444444444444' || cnpj == '55555555555555' ||
		cnpj == '66666666666666' || cnpj == '77777777777777' || cnpj == '88888888888888' || cnpj == '99999999999999')
	return false;
var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
digitos_iguais = 1;
if (cnpj.length < 14 && cnpj.length < 15)
      return false;
for (i = 0; i < cnpj.length - 1; i++)
      if (cnpj.charAt(i) != cnpj.charAt(i + 1))
            {
            digitos_iguais = 0;
            break;
            }
if (!digitos_iguais)
      {
      tamanho = cnpj.length - 2
      numeros = cnpj.substring(0,tamanho);
      digitos = cnpj.substring(tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (i = tamanho; i >= 1; i--)
            {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                  pos = 9;
            }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(0))
            return false;
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0,tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (i = tamanho; i >= 1; i--)
            {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                  pos = 9;
            }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(1))
            return false;
      return true;
      }
else
      return false;
} 


var ftap="3298765432";
var total=0;
var i;
var resto=0;
var numPIS=0;
var strResto="";


NeoUtil.prototype.validationPIS=function(pis){

total=0;
resto=0;
numPIS=0;
strResto="";

	numPIS=pis;
			
	if (numPIS=="" || numPIS==null)
	{
		return false;
	}
	
	for(i=0;i<=9;i++)
	{
		resultado = (numPIS.slice(i,i+1))*(ftap.slice(i,i+1));
		total=total+resultado;
	}
	
	resto = (total % 11)
	
	if (resto != 0)
	{
		resto=11-resto;
	}
	
	if (resto==10 || resto==11)
	{
		strResto=resto+"";
		resto = strResto.slice(1,2);
	}
	
	if (resto!=(numPIS.slice(10,11)))
	{
		return false;
	}
	
	return true;
}

NeoUtil.prototype.validaTimestamp = function (valor){
	
	var data = valor.substring(0,10);
	var espaco = valor.substring(10,11);
	var hora = valor.substring(11,16);
	
	var erro = false;
	
	if (valor!=""){
	    erro=0;
	    hoje = new Date();
	    anoAtual = hoje.getFullYear();
	    barras = valor.split("/");
	    if (barras.length == 3) {
			dia = barras[0];
			mes = barras[1];
			ano = barras[2];
			resultado = (!isNaN(dia) && (dia > 0) && (dia < 32)) && (!isNaN(mes) && (mes > 0) && (mes < 13)) && (!isNaN(ano) && (ano.length == 4) /*&& (ano <= (anoAtual+200) && ano >= 1900)*/ );
	        if (!resultado)	{
	            erro = false;
	        }
	        // Verifica se o dia � v�lido para o m�s de fevereiro.
			if (mes == 2 && (dia < 1 || dia > 29 || (dia > 28 && (parseInt(ano/4) != ano/4)))) {
				erro = false;
			}
	     } else{
	         erro = false;
	     }
		erro = true;
	}
	
	
	
	
	if(erro && verifica_hora(hora) && espaco == " "){
		return true;
	} else {
		alert("Data e hora inv�lidas.")
		return false;
	}
}

/*
 * Valida se � uma data v�lida
 */
NeoUtil.prototype.validaData = function (valor){
	if (valor!=""){
	    erro=0;
	    hoje = new Date();
	    anoAtual = hoje.getFullYear();
	    barras = valor.split("/");
	    if (barras.length == 3) {
			dia = barras[0];
			mes = barras[1];
			ano = barras[2];
			resultado = (!isNaN(dia) && (dia > 0) && (dia < 32)) && (!isNaN(mes) && (mes > 0) && (mes < 13)) && (!isNaN(ano) && (ano.length == 4) /*&& (ano <= (anoAtual+200) && ano >= 1900)*/ );
	        if (!resultado)	{
	            alert("Data inv�lida.");
	            return false;
	        }
	        // Verifica se o dia � v�lido para o m�s de fevereiro.
			if (mes == 2 && (dia < 1 || dia > 29 || (dia > 28 && (parseInt(ano/4) != ano/4)))) {
				alert("Data inv�lida.");
				return false;
			}
	     } else{
	         alert("Data inv�lida.");
	         return false;
	     }
		return true;
	}
	
	return false;
}

function NeoUtil(){}

/*
 * Valida se � uma data (m�s/Ano)
 */
NeoUtil.prototype.validaDataMesAno = function (valor){
	if (valor!=""){
	    erro=0;
	    hoje = new Date();
	    anoAtual = hoje.getFullYear();
	    barras = valor.split("/");
	    if (barras.length == 2) {
			mes = barras[0];
			ano = barras[1];
			resultado = (!isNaN(mes) && (mes > 0) && (mes < 13)) && (!isNaN(ano) && (ano.length == 4) /*&& (ano <= (anoAtual+200) && ano >= 1900)*/ );
	        if (!resultado)	{
	            alert("Data inv�lida.");
	            return false;
	        }
	        /* Verifica se o dia � v�lido para o m�s de fevereiro.
			if (mes == 2 && (dia < 1 || dia > 29 || (dia > 28 && (parseInt(ano/4) != ano/4)))) {
				alert("Data inv�lida.");
				return false;
			}*/
	     } else{
	         alert("Data inv�lida.");
	         return false;
	     }
		return true;
	}
	
	return false;
}


/**
*	M�todo para verificar se uma data � v�lida.
*	
*	@return true - se a data for v�lida.
*			false - se for inv�lida. 
*/
NeoUtil.prototype.verificaData = function (campo){
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

			// Verifica se o dia � v�lido para cada m�s, exceto fevereiro.
			if (dia < 1 || dia > 31 || (dia > 30 && (mes == 4 || mes == 6 || mes == 9 || mes == 11))) {
				situacao = 'falsa';
			}
			
			ano = (data.substring(6,10));
			// Verifica se o dia � v�lido para o m�s de fevereiro.
			if (mes == 2 && (dia < 1 || dia > 29 || (dia > 28 && (parseInt(ano/4) != ano/4)))) {
				situacao = 'falsa';
			}
		}
	}

	if(incomplete == 'true' || situacao == 'falsa'){
		setTimeout(function(){campo.focus()},0);
		campo.value = '';
		return false;
	}
	return true;
}

/**
*	Valida periodo de datas.
*	Verifica se a data inicial � menor que a data final.
*/
NeoUtil.prototype.periodoValido = function(datainicio,datafim){
	if( datainicio != "" && datafim != ""){
		if(parseInt( datainicio.split( "/" )[2].toString() + datainicio.split( "/" )[1].toString() + datainicio.split( "/" )[0].toString() ) 
		> parseInt( datafim.split( "/" )[2].toString() + datafim.split( "/" )[1].toString() + datafim.split( "/" )[0].toString() ))
		{
			return false;
		}
	}
	return true;
}

NeoUtil.prototype.periodoValidoOuIgual = function(datainicio,datafim){
	if( datainicio != "" && datafim != ""){
		if(parseInt( datainicio.split( "/" )[2].toString() + datainicio.split( "/" )[1].toString() + datainicio.split( "/" )[0].toString() ) 
		<= parseInt( datafim.split( "/" )[2].toString() + datafim.split( "/" )[1].toString() + datafim.split( "/" )[0].toString() ))
		{
			return true;
		}
	}
	return false;
}

/**
*	M�todo para obter a tecla pressionada.
*/
NeoUtil.prototype.getTecla = function(event){
	if(navigator.appName.indexOf("Netscape")!= -1) {
		return event.which;
	}
	else {
		return event.keyCode;
	}
}

/**
 * Cria uma requisi��o ajax retornando json
 */
NeoUtil.prototype.getJSON = function(url,data,callback){
	 $.ajax({
			type: "POST",
			url: url,
			data: data,
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			success: function(data){
					data = eval("(" +data + ")");
					callback(data);
				}
		});
}


NeoUtil.prototype.toFloat = function (valor) {
	if(typeof valor == "string"){
		valor = valor.replaceAll(".","","g");
		valor = valor.replace(",",".","g");
		var floatNum = eval(valor);
		return floatNum;
	}
	if(typeof valor == "object"){
		var floatNum = valor.value;
		var floatNum = parseFloat(value);
		return floatNum;
	}
	return parseFloat(valor);
}

NeoUtil.prototype.toMoney = function (valor) {
	valor = valor.toFixed(2);
	valor = new String(valor);
	valor = valor.replace(".", ",");
	return demaskvalue(valor,true).formatCurrency();
}

NeoUtil.prototype.toDecimal = function (valor) {
	valor = new String(valor);
	valor = valor.replace(".", ",");
	return valor;
}

/*
*	Limpa o valor de um elemento html.
*/
NeoUtil.prototype.clearObject = function (object){
	var type = object.type;
	// Combo
	if(type == "select-one"){
		object.selectedIndex = null;
    	object.onchange();
	}
	// Texto
	if(type == "text"){
		object.value = "";
	}
}

/*
 * Caso a data 2 seja maior que a data 1, retorna 1;
 * Caso a data 2 seja menor que a data 1, retorna -1;
 * Caso sejam iguais, retorna 0;
 * Caso ou a data 1 ou a data 2 seja vazia, retorna 2;
 */
NeoUtil.prototype.comparaData = function (data1,data2) {	
	if(data1 == "" || data2 == ""){
		return 2;
	}
	
	if(data1 == data2){
		return 0;
	}
	var splitDt2 = data2.split( "/" );
	var splitDt1 = data1.split( "/" );
	if ( parseInt(splitDt2[2].toString() + splitDt2[1].toString() + splitDt2[0].toString() ) 
			> parseInt( splitDt1[2].toString() + splitDt1[1].toString() + splitDt1[0].toString() ) ){
		//maior	
		return 1;
	} else {
		//menor
		return -1;
	}
}

NeoUtil.prototype.roundNumber = function (num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

NeoUtil.prototype.janelasSelectOnePath = {};

//declara a biblioteca
var $n = new NeoUtil();
