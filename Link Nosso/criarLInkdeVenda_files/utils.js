
function getComboIdSelected(combo){
	var value = combo.options[combo.selectedIndex].value;
	if(value != "<null>")
		return this.getValueId(value); 
	else
		return value;
}

function getValueId(value){
	if (value != undefined)
		return value.substring(value.lastIndexOf("=")+1,value.lastIndexOf("]"));
	else
		return null;
}

function getValueIdFirst(value){
	if (value != undefined)
		return value.substring(value.indexOf("=")+1,value.lastIndexOf(","));
	else
		return null;
}

function createDataModelByList(lista,nameSelect,events){
	var text = "";
	var i;
	
	if(!lista || lista.length == 0){
		text = "Lista vazia.";
	}
	var combo = "<select name=\""+nameSelect+"\" "+events+" >";		
		combo += "<option value='<null>'>"+text+"</option>";
	if(lista){
		for(i=0;i<lista.length;i++){
			combo+="<option value='"+lista[i][0]+"' >"+lista[i][1]+"</option>";
		}
	}	
	combo += "</select>";
	return combo;
}

function getRowIndex(obj){
	var name = "";
	if(typeof obj == "string"){
		name = obj;
	}else if(typeof obj == "object"){
		if (obj.jquery == undefined)
			name = obj.name;
		else
			name = obj.attr('name');
	}

	var regex = new RegExp("\\[(\\d+)\\]");
	var index = regex.exec(name);
	
	if(index == null)
		return null;
	else 
		return parseInt(index[1]);
}

function getJSON(url,data,callback,erroCallback){
	 $.ajax({
			type: "POST",
			url: url,
			data: data,
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			success: function(data){
				//data = JSON.parse(data);
				callback(data);
			},
			error: erroCallback
			//beforeSend: $Neo.ajax.beforeSend,
			//complete: $Neo.ajax.complete
		});
}

function getJSONSync(url,data,callback){
	 $.ajax({
			type: "POST",
			url: url,
			data: data,
			async: false,
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			success: function(data){
				data = eval("(" +data + ")");
				callback(data);
			}
			//beforeSend: $Neo.ajax.beforeSend,
			//complete: $Neo.ajax.complete
		});
}

function sortTable(el, ignoreLastTr) {
	waitingDialog.show("Ordenando...");
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	n = $(el).parent().index();
	table = $(el).closest('table')[0];
	switching = true;
	dir = "asc";
	rowsSubtract = ignoreLastTr ? 2 : 1;
	while (switching) {
		switching = false;
	 	rows = table.getElementsByTagName("TR");
		for (i = 1; i < (rows.length - rowsSubtract); i++) {
 			shouldSwitch = false;
 			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			numberPattern = /\d+/g;
			xVal = Number.parseFloat(x.innerHTML.match(numberPattern));
			yVal = Number.parseFloat(y.innerHTML.match(numberPattern));
			if (dir == "asc") {
				if (!Number.isNaN(xVal) && !Number.isNaN(yVal)){
					if (xVal > yVal){
						shouldSwitch= true;
						break;
					}
				} else {
        			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          				shouldSwitch= true;
          				break;
        			}
				}
  			} else if (dir == "desc") {
  				if (!Number.isNaN(xVal) && !Number.isNaN(yVal)){
					if (xVal < yVal){
						shouldSwitch= true;
						break;
					}
				} else {    	  
        			if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          				shouldSwitch= true;
          				break;
        			}
				}
  			}
		}
		if (shouldSwitch) {
  			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
  			switching = true;
  			switchcount ++;
		} else {
  			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
        		switching = true;
      		}
   		}
  	}
	waitingDialog.hide();
}

function loginKeyPress(e) {	
	var chr = String.fromCharCode(e.which);
    if ("1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM._-".indexOf(chr) < 0)
      return false;	  
}

function onChangeBoxTipoUnidade(){
	var tipoUnidade = [];
	$('input[name="tipoUnidade[]"]:checked').each(function(){
		tipoUnidade.push($(this).val());
	});
	$('#idsTipoPontoAtendimento').val(tipoUnidade.toString());
}

function onChangeBoxTipoAcerto(){
	var tipoAcerto = [];
	$('input[name="tipoAcerto[]"]:checked').each(function(){
		tipoAcerto.push($(this).val());
	});
	$('#idsTipoAcerto').val(tipoAcerto.toString());
}

