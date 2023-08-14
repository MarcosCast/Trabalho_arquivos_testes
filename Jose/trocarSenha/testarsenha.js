$('#id_read_off_pswd').append('<i class="far fa-eye olho" style="color: #8492A5; font-size: 16px;"></i>');

$(".olho").mousedown(function(){
  $("input[name='pswd']").attr("type","text");
});

$(".olho").mouseup(function(){
  $("input[name='pswd']").attr("type","password");
});

$( ".olho" ).mousemove(function( event ) {
  $("input[name='pswd']").attr("type","password");
});

$("input[name='pswd']").keyup(function(){
	
	var pwd = $("input[name='pswd']").val();
	var pontos = 0;
	var cor = '';
	var somb = 5;
	
	if((pwd.length >= 2) && (pwd.length <= 8)){
		pontos += 10;
		somb = 30;
	}else if(pwd.length > 8){
		pontos += 25;
		somb = 30;
	}
	
	if((pwd.length >= 3) && (pwd.match(/[a-z]+/))){
		pontos += 10;
		somb = 60;
	}

	if((pwd.length >= 4) && (pwd.match(/[A-Z]+/))){
		pontos += 20;
		somb = 80;
	}

	if((pwd.length >= 6) && (pwd.match(/[@#$%&;*]/))){
		pontos += 25;
		somb = 100;
	}

	if( (pwd.length >= 8)  && (pwd.match(/[@#$%&!*]/)) && (pwd.match(/[A-Z]+/))) {
		pontos += 20;
	}
	
	
	if(pontos < 35 ){
		cor = '#FF0000';
	
	}else if((pontos >= 35) && (pontos < 45)){
		cor = '#FF8C00';
		
	}else if((pontos >= 45) && (pontos < 75)){
		cor = '#FFFF00';
		
	}else if(pontos >= 75){
		cor = '#00FF00';
	
	}
	
	if(pwd.length > 0) {
		$('.notification').css('background','-webkit-linear-gradient(left, '+cor+' '+ pontos +'%, #D8D8BF '+ somb +'%)');
	}else{
		$('.notification').css('background','');
		$('.notification').html('');
	}
	
});