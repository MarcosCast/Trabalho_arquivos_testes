;(function($) {
var bootstrapWizardCreate = function(element, options) {
	var element = $(element);
	var obj = this;

	// selector skips any 'li' elements that do not contain a child with a tab data-toggle
	var baseItemSelector = 'li:has([data-toggle="tab"])';

	// Merge options with defaults
	var $settings = $.extend({}, $.fn.bootstrapWizard.defaults, options);
	var $activeTab = null;
	var $navigation = null;

	this.rebindClick = function(selector, fn)
	{
		selector.unbind('click', fn).bind('click', fn);
	}

	this.fixNavigationButtons = function() {
		// Get the current active tab
		if(!$activeTab.length) {
			// Select first one
			$navigation.find('a:first').tab('show');
			$activeTab = $navigation.find(baseItemSelector + ':first');
		}

		// See if we're currently in the first/last then disable the previous and last buttons
		$($settings.previousSelector, element).toggleClass('disabled', (obj.firstIndex() >= obj.currentIndex()));
		$($settings.nextSelector, element).toggleClass('disabled', (obj.currentIndex() >= obj.navigationLength()));

		// We are unbinding and rebinding to ensure single firing and no double-click errors
		obj.rebindClick($($settings.nextSelector, element), obj.next);
		obj.rebindClick($($settings.previousSelector, element), obj.previous);
		obj.rebindClick($($settings.lastSelector, element), obj.last);
		obj.rebindClick($($settings.firstSelector, element), obj.first);

		if($settings.onTabShow && typeof $settings.onTabShow === 'function' && $settings.onTabShow($activeTab, $navigation, obj.currentIndex())===false){
			return false;
		}
	};

	this.next = function(e) {

		// If we clicked the last then dont activate this
		if(element.hasClass('last')) {
			return false;
		}

		if($settings.onNext && typeof $settings.onNext === 'function' && $settings.onNext($activeTab, $navigation, obj.nextIndex())===false){
			return false;
		}
		
		if (!canNext())
			return false;

		// Did we click the last button
		$index = obj.nextIndex();
		if($index > obj.navigationLength()) {
		} else {
			$navigation.find(baseItemSelector + ':eq('+$index+') a').tab('show');
		}
		
		afterNextTab();
	};

	this.previous = function(e) {

		// If we clicked the first then dont activate this
		if(element.hasClass('first')) {
			return false;
		}

		if($settings.onPrevious && typeof $settings.onPrevious === 'function' && $settings.onPrevious($activeTab, $navigation, obj.previousIndex())===false){
			return false;
		}
		
		if (!canPrior())
			return false;

		$index = obj.previousIndex();
		if($index < 0) {
		} else {
			$navigation.find(baseItemSelector + ':eq('+$index+') a').tab('show');
		}
		
	};

	this.first = function(e) {
		if($settings.onFirst && typeof $settings.onFirst === 'function' && $settings.onFirst($activeTab, $navigation, obj.firstIndex())===false){
			return false;
		}

		// If the element is disabled then we won't do anything
		if(element.hasClass('disabled')) {
			return false;
		}
		$navigation.find(baseItemSelector + ':eq(0) a').tab('show');

	};
	this.last = function(e) {
		if($settings.onLast && typeof $settings.onLast === 'function' && $settings.onLast($activeTab, $navigation, obj.lastIndex())===false){
			return false;
		}

		// If the element is disabled then we won't do anything
		if(element.hasClass('disabled')) {
			return false;
		}
		$navigation.find(baseItemSelector + ':eq('+obj.navigationLength()+') a').tab('show');
	};
	this.currentIndex = function() {
		return $navigation.find(baseItemSelector).index($activeTab);
	};
	this.firstIndex = function() {
		return 0;
	};
	this.lastIndex = function() {
		return obj.navigationLength();
	};
	this.getIndex = function(e) {
		return $navigation.find(baseItemSelector).index(e);
	};
	this.nextIndex = function() {
		return $navigation.find(baseItemSelector).index($activeTab) + 1;
	};
	this.previousIndex = function() {
		return $navigation.find(baseItemSelector).index($activeTab) - 1;
	};
	this.navigationLength = function() {
		return $navigation.find(baseItemSelector).length - 1;
	};
	this.activeTab = function() {
		return $activeTab;
	};
	this.nextTab = function() {
		return $navigation.find(baseItemSelector + ':eq('+(obj.currentIndex()+1)+')').length ? $navigation.find(baseItemSelector + ':eq('+(obj.currentIndex()+1)+')') : null;
	};
	this.previousTab = function() {
		if(obj.currentIndex() <= 0) {
			return null;
		}
		return $navigation.find(baseItemSelector + ':eq('+parseInt(obj.currentIndex()-1)+')');
	};
	this.show = function(index) {
		if (isNaN(index)) {
			return element.find(baseItemSelector + ' a[href=#' + index + ']').tab('show');
		}
		else {
			return element.find(baseItemSelector + ':eq(' + index + ') a').tab('show');
		}
	};
	this.disable = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').addClass('disabled');
	};
	this.enable = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').removeClass('disabled');
	};
	this.hide = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').hide();
	};
	this.display = function(index) {
		$navigation.find(baseItemSelector + ':eq('+index+')').show();
	};
	this.remove = function(args) {
		var $index = args[0];
		var $removeTabPane = typeof args[1] != 'undefined' ? args[1] : false;
		var $item = $navigation.find(baseItemSelector + ':eq('+$index+')');

		// Remove the tab pane first if needed
		if($removeTabPane) {
			var $href = $item.find('a').attr('href');
			$($href).remove();
		}

		// Remove menu item
		$item.remove();
	};

	var innerTabClick = function (e) {
		// Get the index of the clicked tab
		var clickedIndex = $navigation.find(baseItemSelector).index($(e.currentTarget).parent(baseItemSelector));
		if($settings.onTabClick && typeof $settings.onTabClick === 'function' && $settings.onTabClick($activeTab, $navigation, obj.currentIndex(), clickedIndex)===false){
			return false;
		}
	};

	var innerTabShown = function (e) {  // use shown instead of show to help prevent double firing
		$element = $(e.target).parent();
		var nextTab = $navigation.find(baseItemSelector).index($element);

		// If it's disabled then do not change
		if($element.hasClass('disabled')) {
			return false;
		}

		if($settings.onTabChange && typeof $settings.onTabChange === 'function' && $settings.onTabChange($activeTab, $navigation, obj.currentIndex(), nextTab)===false){
				return false;
		}

		$activeTab = $element; // activated tab
		obj.fixNavigationButtons();
	};

	this.resetWizard = function() {

		// remove the existing handlers
		$('a[data-toggle="tab"]', $navigation).off('click', innerTabClick);
		$('a[data-toggle="tab"]', $navigation).off('shown shown.bs.tab', innerTabShown);

		// reset elements based on current state of the DOM
		$navigation = element.find('ul:first', element);
		$activeTab = $navigation.find(baseItemSelector + '.active', element);

		// re-add handlers
		$('a[data-toggle="tab"]', $navigation).on('click', innerTabClick);
		$('a[data-toggle="tab"]', $navigation).on('shown shown.bs.tab', innerTabShown);

		obj.fixNavigationButtons();
	};

	$navigation = element.find('ul:first', element);
	$activeTab = $navigation.find(baseItemSelector + '.active', element);

	if(!$navigation.hasClass($settings.tabClass)) {
		$navigation.addClass($settings.tabClass);
	}

	// Load onInit
	if($settings.onInit && typeof $settings.onInit === 'function'){
		$settings.onInit($activeTab, $navigation, 0);
	}

	// Load onShow
	if($settings.onShow && typeof $settings.onShow === 'function'){
		$settings.onShow($activeTab, $navigation, obj.nextIndex());
	}

	$('a[data-toggle="tab"]', $navigation).on('click', innerTabClick);

	// attach to both shown and shown.bs.tab to support Bootstrap versions 2.3.2 and 3.0.0
	$('a[data-toggle="tab"]', $navigation).on('shown shown.bs.tab', innerTabShown);
};
$.fn.bootstrapWizard = function(options) {
	//expose methods
	if (typeof options == 'string') {
		var args = Array.prototype.slice.call(arguments, 1)
		if(args.length === 1) {
			args.toString();
		}
		return this.data('bootstrapWizard')[options](args);
	}
	return this.each(function(index){
		var element = $(this);
		// Return early if this element already has a plugin instance
		if (element.data('bootstrapWizard')) return;
		// pass options to plugin constructor
		var wizard = new bootstrapWizardCreate(element, options);
		// Store plugin object in this element's data
		element.data('bootstrapWizard', wizard);
		// and then trigger initial change
		wizard.fixNavigationButtons();
	});
};

// expose options
$.fn.bootstrapWizard.defaults = {
	tabClass:         'nav nav-pills',
	nextSelector:     '.wizard li.next',
	previousSelector: '.wizard li.previous',
	firstSelector:    '.wizard li.first',
	lastSelector:     '.wizard li.last',
	onShow:           null,
	onInit:           null,
	onNext:           null,
	onPrevious:       null,
	onLast:           null,
	onFirst:          null,
	onTabChange:      null,
	onTabClick:       null,
	onTabShow:        null
};

})(jQuery);


//  Material Design Core Functions

 !function(t){function o(t){return"undefined"==typeof t.which?!0:"number"==typeof t.which&&t.which>0?!t.ctrlKey&&!t.metaKey&&!t.altKey&&8!=t.which&&9!=t.which&&13!=t.which&&16!=t.which&&17!=t.which&&20!=t.which&&27!=t.which:!1}function i(o){var i=t(o);i.prop("disabled")||i.closest(".form-group").addClass("is-focused")}function n(o){o.closest("label").hover(function(){var o=t(this).find("input");o.prop("disabled")||i(o)},function(){e(t(this).find("input"))})}function e(o){t(o).closest(".form-group").removeClass("is-focused")}t.expr[":"].notmdproc=function(o){return t(o).data("mdproc")?!1:!0},t.material={options:{validate:!0,input:!0,ripples:!0,checkbox:!0,togglebutton:!0,radio:!0,arrive:!0,autofill:!1,withRipples:[".btn:not(.btn-link)",".card-image",".navbar a:not(.withoutripple)",".footer a:not(.withoutripple)",".dropdown-menu a",".nav-tabs a:not(.withoutripple)",".withripple",".pagination li:not(.active):not(.disabled) a:not(.withoutripple)"].join(","),inputElements:"input.form-control, textarea.form-control, select.form-control",checkboxElements:".checkbox > label > input[type=checkbox]",togglebuttonElements:".togglebutton > label > input[type=checkbox]",radioElements:".radio > label > input[type=radio]"},checkbox:function(o){var i=t(o?o:this.options.checkboxElements).filter(":notmdproc").data("mdproc",!0).after("<span class='checkbox-material'><span class='check'></span></span>");n(i)},togglebutton:function(o){var i=t(o?o:this.options.togglebuttonElements).filter(":notmdproc").data("mdproc",!0).after("<span class='toggle'></span>");n(i)},radio:function(o){var i=t(o?o:this.options.radioElements).filter(":notmdproc").data("mdproc",!0).after("<span class='circle'></span><span class='check'></span>");n(i)},input:function(o){t(o?o:this.options.inputElements).filter(":notmdproc").data("mdproc",!0).each(function(){var o=t(this),i=o.closest(".form-group");0===i.length&&(o.wrap("<div class='form-group'></div>"),i=o.closest(".form-group")),o.attr("data-hint")&&(o.after("<p class='help-block'>"+o.attr("data-hint")+"</p>"),o.removeAttr("data-hint"));var n={"input-lg":"form-group-lg","input-sm":"form-group-sm"};if(t.each(n,function(t,n){o.hasClass(t)&&(o.removeClass(t),i.addClass(n))}),o.hasClass("floating-label")){var e=o.attr("placeholder");o.attr("placeholder",null).removeClass("floating-label");var a=o.attr("id"),r="";a&&(r="for='"+a+"'"),i.addClass("label-floating"),o.after("<label "+r+"class='control-label'>"+e+"</label>")}(null===o.val()||"undefined"==o.val()||""===o.val())&&i.addClass("is-empty"),i.append("<span class='material-input'></span>"),i.find("input[type=file]").length>0&&i.addClass("is-fileinput")})},attachInputEventHandlers:function(){var n=this.options.validate;t(document).on("change",".checkbox input[type=checkbox]",function(){t(this).blur()}).on("keydown paste",".form-control",function(i){o(i)&&t(this).closest(".form-group").removeClass("is-empty")}).on("keyup change",".form-control",function(){var o=t(this),i=o.closest(".form-group"),e="undefined"==typeof o[0].checkValidity||o[0].checkValidity();""===o.val()?i.addClass("is-empty"):i.removeClass("is-empty"),n&&(e?i.removeClass("has-error"):i.addClass("has-error"))}).on("focus",".form-control, .form-group.is-fileinput",function(){i(this)}).on("blur",".form-control, .form-group.is-fileinput",function(){e(this)}).on("change",".form-group input",function(){var o=t(this);if("file"!=o.attr("type")){var i=o.closest(".form-group"),n=o.val();n?i.removeClass("is-empty"):i.addClass("is-empty")}}).on("change",".form-group.is-fileinput input[type='file']",function(){var o=t(this),i=o.closest(".form-group"),n="";t.each(this.files,function(t,o){n+=o.name+", "}),n=n.substring(0,n.length-2),n?i.removeClass("is-empty"):i.addClass("is-empty"),i.find("input.form-control[readonly]").val(n)})},ripples:function(o){t(o?o:this.options.withRipples).ripples()},autofill:function(){var o=setInterval(function(){t("input[type!=checkbox]").each(function(){var o=t(this);o.val()&&o.val()!==o.attr("value")&&o.trigger("change")})},100);setTimeout(function(){clearInterval(o)},1e4)},attachAutofillEventHandlers:function(){var o;t(document).on("focus","input",function(){var i=t(this).parents("form").find("input").not("[type=file]");o=setInterval(function(){i.each(function(){var o=t(this);o.val()!==o.attr("value")&&o.trigger("change")})},100)}).on("blur",".form-group input",function(){clearInterval(o)})},init:function(o){this.options=t.extend({},this.options,o);var i=t(document);t.fn.ripples&&this.options.ripples&&this.ripples(),this.options.input&&(this.input(),this.attachInputEventHandlers()),this.options.checkbox&&this.checkbox(),this.options.togglebutton&&this.togglebutton(),this.options.radio&&this.radio(),this.options.autofill&&(this.autofill(),this.attachAutofillEventHandlers()),document.arrive&&this.options.arrive&&(t.fn.ripples&&this.options.ripples&&i.arrive(this.options.withRipples,function(){t.material.ripples(t(this))}),this.options.input&&i.arrive(this.options.inputElements,function(){t.material.input(t(this))}),this.options.checkbox&&i.arrive(this.options.checkboxElements,function(){t.material.checkbox(t(this))}),this.options.radio&&i.arrive(this.options.radioElements,function(){t.material.radio(t(this))}),this.options.togglebutton&&i.arrive(this.options.togglebuttonElements,function(){t.material.togglebutton(t(this))}))}}}(jQuery),function(t,o,i,n){"use strict";function e(o,i){r=this,this.element=t(o),this.options=t.extend({},s,i),this._defaults=s,this._name=a,this.init()}var a="ripples",r=null,s={};e.prototype.init=function(){var i=this.element;i.on("mousedown touchstart",function(n){if(!r.isTouch()||"mousedown"!==n.type){i.find(".ripple-container").length||i.append('<div class="ripple-container"></div>');var e=i.children(".ripple-container"),a=r.getRelY(e,n),s=r.getRelX(e,n);if(a||s){var l=r.getRipplesColor(i),p=t("<div></div>");p.addClass("ripple").css({left:s,top:a,"background-color":l}),e.append(p),function(){return o.getComputedStyle(p[0]).opacity}(),r.rippleOn(i,p),setTimeout(function(){r.rippleEnd(p)},500),i.on("mouseup mouseleave touchend",function(){p.data("mousedown","off"),"off"===p.data("animating")&&r.rippleOut(p)})}}})},e.prototype.getNewSize=function(t,o){return Math.max(t.outerWidth(),t.outerHeight())/o.outerWidth()*2.5},e.prototype.getRelX=function(t,o){var i=t.offset();return r.isTouch()?(o=o.originalEvent,1===o.touches.length?o.touches[0].pageX-i.left:!1):o.pageX-i.left},e.prototype.getRelY=function(t,o){var i=t.offset();return r.isTouch()?(o=o.originalEvent,1===o.touches.length?o.touches[0].pageY-i.top:!1):o.pageY-i.top},e.prototype.getRipplesColor=function(t){var i=t.data("ripple-color")?t.data("ripple-color"):o.getComputedStyle(t[0]).color;return i},e.prototype.hasTransitionSupport=function(){var t=i.body||i.documentElement,o=t.style,e=o.transition!==n||o.WebkitTransition!==n||o.MozTransition!==n||o.MsTransition!==n||o.OTransition!==n;return e},e.prototype.isTouch=function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},e.prototype.rippleEnd=function(t){t.data("animating","off"),"off"===t.data("mousedown")&&r.rippleOut(t)},e.prototype.rippleOut=function(t){t.off(),r.hasTransitionSupport()?t.addClass("ripple-out"):t.animate({opacity:0},100,function(){t.trigger("transitionend")}),t.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){t.remove()})},e.prototype.rippleOn=function(t,o){var i=r.getNewSize(t,o);r.hasTransitionSupport()?o.css({"-ms-transform":"scale("+i+")","-moz-transform":"scale("+i+")","-webkit-transform":"scale("+i+")",transform:"scale("+i+")"}).addClass("ripple-on").data("animating","on").data("mousedown","on"):o.animate({width:2*Math.max(t.outerWidth(),t.outerHeight()),height:2*Math.max(t.outerWidth(),t.outerHeight()),"margin-left":-1*Math.max(t.outerWidth(),t.outerHeight()),"margin-top":-1*Math.max(t.outerWidth(),t.outerHeight()),opacity:.2},500,function(){o.trigger("transitionend")})},t.fn.ripples=function(o){return this.each(function(){t.data(this,"plugin_"+a)||t.data(this,"plugin_"+a,new e(this,o))})}}(jQuery,window,document);






/*! =========================================================
 *
 * Material Bootstrap Wizard - V1.0.1
 *
 * =========================================================
 *
 * MIT License - Copyright 2017 Creative Tim (http://www.creative-tim.com/product/material-bootstrap-wizard)
 *
 *
 *                       _oo0oo_
 *                      o8888888o
 *                      88" . "88
 *                      (| -_- |)
 *                      0\  =  /0
 *                    ___/`---'\___
 *                  .' \|     |// '.
 *                 / \|||  :  |||// \
 *                / _||||| -:- |||||- \
 *               |   | \\  -  /// |   |
 *               | \_|  ''\---/''  |_/ |
 *               \  .-\__  '-'  ___/-. /
 *             ___'. .'  /--.--\  `. .'___
 *          ."" '<  `.___\_<|>_/___.' >' "".
 *         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *         \  \ `_.   \_ __\ /__ _/   .-` /  /
 *     =====`-.____`.___ \_____/___.-`___.-'=====
 *                       `=---='
 *
 *     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *               Buddha Bless:  "No Bugs"
 *
 * ========================================================= */

// Material Bootstrap Wizard Functions

searchVisible = 0;
transparent = true;
var podeRealizarDelivery = false;
var integrarJuno = false;
var validacao = 'Presencial';
var valorTaxaCartaoBoleto = 0.00;
var valorTaxaAdicional = 0.00;
var percentualTaxaCartaoBoleto = 0.00;
var percentualTaxaAdicional = 0.00;
var produtoComTaxaDeliveryNoCadastro = false;

$(document).ready(function(){

    $.material.init();

    // Code for the Validator
    var $validator = $('.wizard-card form').validate({
		  rules: {
		    cpf: {
			      required: true,
			      minlength: 3
			},
		    cnpj: {
			      required: true,
			      minlength: 3
			},			
		    nome: {
		    	required: true,
		    	minlength: 3
		    },
		    email: {
		    	required: true,
		    	minlength: 3,
		    	email: true
		    },
		    celular: {
			      required: true,
			      minlength: 3
			},	
		    cep: {
			      required: true,
			      minlength: 3
			},
		    logradouro: {
			      required: true,
			      minlength: 3,
			      maxlength: 100
			},
		    numero: {
			      required: true,
			      maxlength: 5
			},	
		    complemento: {
			      required: false,
			      maxlength: 50
			},
		    bairro: {
			      required: true,
			      minlength: 3,
			      maxlength: 50
			},	
		    municipio: {
			      required: true,
			      minlength: 3
			},
		    numeroCartao: {
			      required: true,
			      minlength: 4
			},
		    titular: {
			      required: true,
			      minlength: 5,
			},	
		    expiracao: {
			      required: true,
			      minlength: 7
			},	
		    codigo: {
			      required: true,
			      minlength: 3
			},
			rg: {
				required: true,
			    minlength: 4
			},
			orgaoEmissor: {
				required: true,
			    minlength: 1
			},
			ufRg: {
				required: true
			},
			dataNascimento: {
				required: true
			},
			profissao: {
				required: true,
			    minlength: 1
			},
			nomeResponsavel: {
				required: true,
			    minlength: 3
			},
			cpfResponsavel: {
				required: true,
			    minlength: 3
			},
			cpfContato: {
				required: true,
			    minlength: 3
			}
        },

        errorPlacement: function(error, element) {
            $(element).parent('div').addClass('has-error');
         }
	});

	if(validaAo3Tech){
		 $.validator.addClassRules("codigoVoucher", { required: true, minlength: 3 });
			
		document.getElementById('div-inf-pagamento').style.display = 'none';
		document.getElementById('div-inf-voucher').style.display = 'none'; 
		document.getElementById('row-pagamento').style.display = 'none'; 
	}

    // Wizard Initialization
  	$('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function(tab, navigation, index) {
        	var $valid = $('.wizard-card form').valid();
        	if(!$valid) {
        		$validator.focusInvalid();
        		return false;
        	}
        },

        onInit : function(tab, navigation, index){

          //check number of tabs and fill the entire row
          var $total = navigation.find('li').length;
          $width = 100/$total;
          var $wizard = navigation.closest('.wizard-card');

          $display_width = $(document).width();

          if($display_width < 600 && $total > 3){
              $width = 50;
          }

           navigation.find('li').css('width',$width + '%');
           $first_li = navigation.find('li:first-child a').html();
           $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
           $('.wizard-card .wizard-navigation').append($moving_div);
           refreshAnimation($wizard, index);
           $('.moving-tab').css('transition','transform 0s');
       },

        onTabClick : function(tab, navigation, index){
            var $valid = $('.wizard-card form').valid();

            if (!canNext())
            	return false;
            
            if (!canPrior())
            	return false;
            
            if(!$valid){
                return false;
            } else{
            	return false;
            }
        },

        onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            if($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function(){
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if( !index == 0 ){
                $(checkbox).css({
                    'opacity':'0',
                    'visibility':'hidden',
                    'position':'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity':'1',
                    'visibility':'visible'
                });
            }

            refreshAnimation($wizard, index);
        }
  	});

    // Prepare the preview for profile picture
    $("#wizard-picture").change(function(){
        readURL(this);
    });

    loadRadioCheckBoxAndTooltip();
    
    $('.set-full-height').css('height', 'auto');

});

//Reload Radio
function loadRadioCheckBoxAndTooltip(){
	
    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();
	
    $('[data-toggle="wizard-radio"]').click(function(){
        wizard = $(this).closest('.wizard-card .choice').parent().parent();
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked','true');
        $(this).find('[type="radio"]').trigger("change");
    });

    $('[data-toggle="wizard-checkbox"]').click(function(){
        if( $(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked','true');
        }
    });
    
}


 //Function to show image before upload

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(window).resize(function(){
    $('.wizard-card').each(function(){
        $wizard = $(this);
        index = $wizard.bootstrapWizard('currentIndex');
        refreshAnimation($wizard, index);

        $('.moving-tab').css({
            'transition': 'transform 0s'
        });
    });
});

function refreshAnimation($wizard, index){
    total_steps = $wizard.find('.wizard-navigation li').length;
    move_distance = $wizard.width() / total_steps;
    step_width = move_distance;
    move_distance *= index;

    $current = index + 1;

    if($current == 1){
        move_distance -= 8;
    } else if($current == total_steps){
        move_distance += 8;
    }

    $wizard.find('.moving-tab').css('width', step_width);
    $('.moving-tab').css({
        'transform':'translate3d(' + move_distance + 'px, 0, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

    });
}

materialDesign = {

    checkScrollForTransparentNavbar: debounce(function() {
                if($(document).scrollTop() > 260 ) {
                    if(transparent) {
                        transparent = false;
                        $('.navbar-color-on-scroll').removeClass('navbar-transparent');
                    }
                } else {
                    if( !transparent ) {
                        transparent = true;
                        $('.navbar-color-on-scroll').addClass('navbar-transparent');
                    }
                }
        }, 17)

}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};


/*!
 * Geral
 */

function onChangeTipoPessoa(el){
	if ($(el).val() == "FISICA"){
		$('#div-cpf').show();
		$('#div-cnpj').hide();
		$('input[name=cnpj]').val("");
		$('input[name=tipoPessoa]').val("FISICA");
		$('#labelNome').html('Nome');
		$('#divNomeResponsavel').hide();
		$('#divCpfResponsavel').hide();
		$('#divDataNascimentoResponsavel').hide();
		$('#cpfContato').hide();
	} else if ($(el).val() == "JURIDICA"){
		$('#div-cpf').hide();
		$('#div-cnpj').show();
		$('input[name=cpf]').val("");
		$('input[name=tipoPessoa]').val("JURIDICA");
		$('#labelNome').html('Razão social');
		$('#divNomeResponsavel').show();
		$('#divCpfResponsavel').show();
		$('#divDataNascimentoResponsavel').show();
		$('#cpfContato').show();
	}
	ajaxBuscarTabelaProduto();
}	

function ajaxConsultaCep(el){
	var cep = $(el).val();
	if (cep != "" && cep != undefined){
		$.ajax({
			type: "POST",
			url: "/gestaofacil/publico/RealizarPedido",
			data: {'ACAO':'ajaxConsultaCep', 'cep':cep},
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function(xhr, set){$('#cep-aguarde').show();},
			success: function(data){
				json = data;
				if (json != null && json.endereco != null){
					if (json.endereco.logradouro != ''){
						$(form['logradouro']).val(json.endereco.logradouro);
						$(form['logradouro']).parent().removeClass('is-empty');
					} else {
						$(form['logradouro']).val('');
						$(form['logradouro']).parent().addClass('is-empty');
					}
					if (json.endereco.numero != ''){
						$(form['numero']).val(json.endereco.numero);
						$(form['numero']).parent().removeClass('is-empty');
					} else {
						$(form['numero']).val('');
						$(form['numero']).parent().addClass('is-empty');
					}
					if (json.endereco.bairro != ''){
						$(form['bairro']).val(json.endereco.bairro);
						$(form['bairro']).parent().removeClass('is-empty');
					} else {
						$(form['bairro']).val('');
						$(form['bairro']).parent().addClass('is-empty');
					}
					if (json.endereco.complemento != ''){
						$(form['complemento']).val(json.endereco.complemento);
						$(form['complemento']).parent().removeClass('is-empty');
					} else {
						$(form['complemento']).val('');
						$(form['complemento']).parent().addClass('is-empty');						
					}
					if (json.endereco.municipio.uf != null)
						$(form['uf']).selectOptions("br.com.gestaofacil.faturamento.beans.Uf[id=" + json.endereco.municipio.uf.id + "]", true);
					if (json.endereco.municipio != null){
						$(form['municipio']).val(json.endereco.municipio.nome);
						$(form['municipio']).parent().removeClass('is-empty');
					} else {
						$(form['municipio']).val('');
						$(form['municipio']).parent().addClass('is-empty');						
					}
				} else {
					alert('CEP inválido');
					$(form['cep']).val('');
					$(form['cep']).parent().addClass('is-empty');
				}
				$('#cep-aguarde').hide();
			}
		});		
	}
}

function ufLocalizacaoOnChange(){
	var ufSelecionada = $('#ufLocalizacao option:selected').text();
	$("#pontoAtendimentoLocalizacao option").remove();
	$('#pontoAtendimentoLocalizacao').append($('<option>', {value: '<null>', text: ''}));		
	$.each(mapaEndereco, function(i, pa) {
		if (pa.uf == ufSelecionada){
		    $('#pontoAtendimentoLocalizacao').append($('<option>', { 
		        value: 'br.com.gestaofacil.faturamento.beans.PontoAtendimento[id='+pa.id+']',
		        text : pa.endereco 
		    }));
	    }	
	});
}

function selecionaPontoAtendimento(id, endereco){
	$("#pontoAtendimentoLocalizacao option").remove();
	$('#pontoAtendimentoLocalizacao').append($('<option>', {value: '<null>', text: ''}));		
	if (id != '' && endereco != ''){
	    $('#pontoAtendimentoLocalizacao').append($('<option>', { 
	        value: 'br.com.gestaofacil.faturamento.beans.PontoAtendimento[id='+id+']',
	        text: endereco,
	        selected: 'selected'
	    }));
    }	
}

function buscaContatoPontoAtendimentoSelecionado(){
	var paSelecionado = getValueId($('#pontoAtendimentoLocalizacao').val());
	$.each(mapaEndereco, function(i, pa) {
		if (pa.id == paSelecionado){
			
			// verificando se vai direcionar para outra url
			if (pa.urlDirecionamentoSite != null && pa.urlDirecionamentoSite != ''){
				window.onbeforeunload = null;
				window.location.href = pa.urlDirecionamentoSite;
			}
			
			$('#telefoneContato').html('Em caso de dúvidas entrar em contato: <b>' + pa.contato + '</b>');
			$('#enderecoContato').html('Endereço: ' + pa.endereco);
			var videoConferencia = false;
			if ($("input[name='validacaoVideoConferenciaRadio'][checked=checked]").val() == "on")
				videoConferencia = true;
			if (pa.podeRealizarDelivery && !videoConferencia){
				$("#row-taxaDelivery").show();
				$("#row-delivery").show();
			} else {
				$("#row-taxaDelivery").hide();
				$("#row-delivery").hide();
			}
			
			$('#ac').val(pa.ac);
	    }	
	});	
}

function ajaxBuscarTabelaProduto(){
	var id = getValueId($('#pontoAtendimentoLocalizacao').val());
	var indicacao = $('#indicacao').val();
		
	// se foi feita a escolha do certificado 
	if ($("input[name='produto']").val() != null){
		// armazena o certificado escolhido
		$("#tipoCertificado").val($('input[name=tipoCertificado][checked=checked]').val());
		$("#tipoMidia").val($('input[name=tipoMidia][checked=checked]').val());
		$("#validade").val($('input[name=validade][checked=checked]').val());
		$("#idProduto").val($("input[name='produto'][checked=checked]").val());		
		
		//quando é integração com Yapay tem que informar o cpf do responsavel somente para e-cnpj
		if($("#tipoCertificado").val() == 'e-CPF')
			$('#cpfContato').hide();
		else
			$('#cpfContato').show();
	}
	
	if (id != null){
		
		permiteRenovacaoOnline = false;
		if ($('input[name=validacaoRenovacaoOnlineRadio][checked=checked]').val() == "on"){ 
			permiteRenovacaoOnline = true;	 
		}
		$.ajax({
			type: "POST",
			url: "/gestaofacil/publico/RealizarPedido",
			data: {'ACAO':'ajaxBuscarTabelaProduto', 'pontoAtendimento_id':id, 'indicacao':indicacao, 'permiteRenovacaoOnline': permiteRenovacaoOnline, 'contabilidade_id': contabilidadeId},
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			success: function(json){
				tabelaProduto = json.tabelaProduto;
				var tipoPessoa = $('input[name=tipoPessoaRadio][checked]').val();
				if (tabelaProduto.length == 0){
					$('#row-tipocertificado').hide();
					$('#row-tipomidia').hide();
					$('#row-validade').hide();
					$('#row-nenhumcertificado').html('<div class="col-sm-12"><h4>Nenhum certificado encontrado.</h4></div>')
					$('#row-nenhumcertificado').show();
				} else {
					$('#row-tipocertificado').show();
					$('#row-tipomidia').show();
					$('#row-validade').show();
					$('#row-nenhumcertificado').hide();
					
					$('#div-tipocertificado').empty();
					$.each(json.listaTipoCertificado, function(i, tipo) {
						// verificando se a primeira etapa e a escolha do certificado
						if ($('#ordemEtapa').val() == 1 && validaAo3Tech == false){
							$('#div-tipocertificado').append('<div class="col-sm-1" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="carregaProduto()" name="tipoCertificado" value="'+tipo.descricao+'"><div class="icon"><i class="'+tipo.icone+'"></i></div><h6>'+tipo.descricao+'</h6></div></div>');
						} else if (tipoPessoa == 'FISICA' && (tipo.id == 0 || tipo.id == 4 || tipo.id == 8 || tipo.id == 9))
							$('#div-tipocertificado').append('<div class="col-sm-1" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="carregaProduto()" name="tipoCertificado" value="'+tipo.descricao+'"><div class="icon"><i class="'+tipo.icone+'"></i></div><h6>'+tipo.descricao+'</h6></div></div>');
						else if (tipoPessoa == 'JURIDICA' && (tipo.id == 1 || tipo.id == 2 || tipo.id == 3 || tipo.id == 5 || tipo.id == 6 || tipo.id == 8 || tipo.id == 9))
							$('#div-tipocertificado').append('<div class="col-sm-1" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="carregaProduto()" name="tipoCertificado" value="'+tipo.descricao+'"><div class="icon"><i class="'+tipo.icone+'"></i></div><h6>'+tipo.descricao+'</h6></div></div>');
					});
					
					$('#div-tipomidia').empty();
					$.each(json.listaTipoMidia, function(i, tipo) {
						$('#div-tipomidia').append('<div class="col-sm-1" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title="'+tipo.texto+'"><input type="radio" onchange="carregaProduto()" name="tipoMidia" value="'+tipo.descricao+'"><div class="icon"><i class="'+tipo.icone+'"></i></div><h6>'+tipo.descricao+'</h6></div></div>');
					});
					
					$('#div-validade').empty();
					$.each(json.listaValidade, function(i, tipo) {
						// alteração para exibiação dos certificados de acordo com a opçõa de validação de videoconferencia						
//						if ($("input[name='validacaoVideoConferenciaRadio'][checked=checked]").val() == "on"){
//							if (tipo.id == 0)
//								$('#div-validade').append('<div class="col-sm-1" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="carregaProduto()" name="validade" value="'+tipo.descricao+'"><div class="icon"><i class="'+tipo.icone+'"></i></div><h6>'+tipo.descricao+'</h6></div></div>');
//						} else {
							$('#div-validade').append('<div class="col-sm-1" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="carregaProduto()" name="validade" value="'+tipo.descricao+'"><div class="icon"><i class="'+tipo.icone+'"></i></div><h6>'+tipo.descricao+'</h6></div></div>');
//						}
					}); 
					
					$('#div-pagamento').empty();
					$.each(json.listaFormaPagamentoSite, function(i, pag) {
						$('#div-pagamento').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="onChangePagamento('+pag.tipo+', this, '+pag.integrarJuno+',' + "'" + pag.tokenPublicoJuno + "'" +')" name="formaPagamento" value="'+pag.id+'"><div class="icon"><i class="'+pag.icone+'"></i></div><h6>'+pag.nome+'</h6></div></div>');
					});
					
					if ($("#idProduto").val() != ''){
						$.each(tabelaProduto, function(i, produto) {
							if (produto.id == $("#idProduto").val()){
								if(produto.valorPromocao != ''){
                         			$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'" checked="checked"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><s><span>R$ '+produto.valor+'</span></s><h5>R$ '+produto.valorPromocao+'</h5></div></div>');
								} else{
									$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'" checked="checked"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><h5>R$ '+produto.valor+'</h5></div></div>');
								}
								if (produto.naoPermiteDescontoVoucherComisao == true){
									$('#row-voucher').hide();
								}
							}
						});	
					}
					
				}
				
				loadRadioCheckBoxAndTooltip();
				carregaProduto();
				verificaProdutoEnviado();
				//if (ocultarProdutoMidiaVideoConferencia)
					//carregaProduto();
			}
		});
	}
}

function verificaProdutoEnviado(){
	
	// verificando se informou o produto e seleciona o tipo do mesmo
	if ($("#tipoCertificado").val() != null && $("#tipoCertificado").val() != ""){
		$("input[name='tipoCertificado'][value='"+$("#tipoCertificado").val()+"']").attr("checked", "checked");
		$("input[name='tipoCertificado'][value='"+$("#tipoCertificado").val()+"']").parent().addClass("active produtoEnabled");
		//$("input[name='tipoCertificado'][value='"+$("#tipoCertificado").val()+"']").parent().click();
	}
	
	// verificando se informou o produto e seleciona o tipo da midia
	if ($("#tipoMidia").val() != null && $("#tipoMidia").val() != ""){
		$("input[name='tipoMidia'][value='"+$("#tipoMidia").val()+"']").attr("checked", "checked");
		$("input[name='tipoMidia'][value='"+$("#tipoMidia").val()+"']").parent().addClass("active produtoEnabled");
		//$("input[name='tipoMidia'][value='"+$("#tipoMidia").val()+"']").parent().click();
	}
	
	// verificando se informou o produto e seleciona a validade
	if ($("#validade").val() != null && $("#validade").val() != ""){
		$("input[name='validade'][value='"+$("#validade").val()+"']").attr("checked", "checked");
		$("input[name='validade'][value='"+$("#validade").val()+"']").parent().addClass("active produtoEnabled");
		//$("input[name='validade'][value='"+$("#validade").val()+"']").parent().click();
		$("input[name='validade'][value='"+$("#validade").val()+"']").trigger("change");
	}
	
	// verificando o produto
	if ($("#idProduto").val() != null && $("#idProduto").val() != ""){
		$("input[name='produto'][value='"+$("#idProduto").val()+"']").attr("checked", "checked");
		$("input[name='produto'][value='"+$("#idProduto").val()+"']").parent().addClass("active produtoEnabled");
		$("input[name='produto'][value='"+$("#idProduto").val()+"']").parent().click();
		var p = new Object();
		p.value = $("input[name='produto'][value='"+$("#idProduto").val()+"']").val();
		selectProduto(p);
		
		// verifica se enviou o produto ou a seleção do produto ocorreu primeiro
		if ($('#informouProdutoUrl').val() == "true" || $('#informouProdutoUrl').val() == true){
			// colocando a aba de seleção do certificado desabilitada
			$('#certificado').addClass("produtoDisabled");
			// o campo delivery deve ficar ativo
			$("#row-delivery").addClass("deliveryEnabled");
			$("#row-taxaDelivery").addClass("deliveryEnabled");
		}
	} else {
		$('#certificado').removeClass("produtoDisabled");
	}
}

function exibeTermoVideoConferencia(){
	var tipocertificado = $('input[name=tipoCertificado][checked=checked]').val();
	var tipoPessoa = $('input[name=tipoPessoaRadio][checked]').val();
	//Exibindo poup up de termo de uso video conferencia
	if ($('.wizard-navigation ul').find('li.active a').html() == "Certificado"){
		if ($("input[name='validacaoVideoConferenciaRadio'][checked=checked]").val() == "on"){
			document.getElementById("modalTextoTermosVideoConferenciaPF").style.display = 'none';
			document.getElementById("modalTextoTermosVideoConferenciaPJ").style.display = 'none';
			if(tipocertificado == "e-CPF" || tipoPessoa == "FISICA"){
				if (document.getElementById("modalTextoTermosVideoConferenciaPF").innerHTML.trim() != ""){
					document.getElementById("modalTextoTermosVideoConferenciaPF").style.display = '';	
					document.getElementsByName('next')[0].disabled = true;		
					$('#modalLabelTermosVideoConferencia').modal('show');				
				}	
			}else if(tipocertificado == "e-CNPJ" || tipoPessoa == "JURIDICA"){
				if (document.getElementById("modalTextoTermosVideoConferenciaPJ").innerHTML.trim() != ""){
					document.getElementById("modalTextoTermosVideoConferenciaPJ").style.display = '';	
					document.getElementsByName('next')[0].disabled = true;		
					$('#modalLabelTermosVideoConferencia').modal('show');				
				}	
			}
		}
	}
}

function carregaProduto(){
	var tipocertificado = $('input[name=tipoCertificado][checked=checked]').val();
	var tipomidia = $('input[name=tipoMidia][checked=checked]').val();
	var validade = $('input[name=validade][checked=checked]').val();	
	var tipoPessoa = $('input[name=tipoPessoaRadio][checked]').val();
	
	$('#div-certificado').empty();
	if (tipocertificado != undefined && tipomidia != undefined && validade != undefined){
		var encontrou = false;
		
		if($('#ordemEtapa').val() == 1 && validaAo3Tech == false){
			$.each(tabelaProduto, function(i, produto) {
				if (produto.tipoCertificado == tipocertificado && produto.tipoMidia == tipomidia && produto.validade == validade){
					if(produto.valorPromocao != ''){
						$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><s><span>R$ '+produto.valor+'</span></s><h5>R$ '+produto.valorPromocao+'</h5></div></div>');
					} else {
						$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><h5>R$ '+produto.valor+'</h5></div></div>');
					}
					encontrou = true;	
				}
			});
		}else{
			$.each(tabelaProduto, function(i, produto) {
				//Se o produto for um Bird ID, então cada certificado deverá ser mostrado de acordo com o tipo de pessoa.
				if (produto.tipoCertificado == tipocertificado && tipocertificado == 'Bird ID (Nuvem)'){
					if(produto.tipoMidia == tipomidia && tipoPessoa == 'FISICA' && produto.nome.toString().includes('PF') && produto.validade == validade){
						if(produto.valorPromocao != ''){
                         	$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><s><span>R$ '+produto.valor+'</span></s><h5>R$ '+produto.valorPromocao+'</h5></div></div>');
						} else{
							$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><h5>R$ '+produto.valor+'</h5></div></div>');
						}
						encontrou = true;
					}else if (produto.tipoMidia == tipomidia && tipoPessoa == 'JURIDICA' && produto.nome.toString().includes('PJ') && produto.validade == validade){
						if(produto.valorPromocao != ''){
							$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><s><span>R$ '+produto.valor+'</span></s><h5>R$ '+produto.valorPromocao+'</h5></div></div>');
						} else {
							$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><h5>R$ '+produto.valor+'</h5></div></div>');
						}
						encontrou = true;
					}
				//Caso seja qualquer outro produto, então o sistema segue o fluxo para os outros produtos.
				}else{
					if (produto.tipoCertificado == tipocertificado && produto.tipoMidia == tipomidia && produto.validade == validade){
						if(produto.valorPromocao != ''){
                         	$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'" checked="checked"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><s><span>R$ '+produto.valor+'</span></s><h5>R$ '+produto.valorPromocao+'</h5></div></div>');
						} else {
							$('#div-certificado').append('<div class="col-sm-2" style="display: inline-table;"><div class="choice" data-toggle="wizard-radio" rel="tooltip" title=""><input type="radio" onchange="selectProduto(this)" name="produto" value="'+produto.id+'" checked="checked"><input type="hidden" class="valorSemDesconto" value="'+produto.valorSemDesconto+'"><div class="icon"><i class="fa fa-shopping-cart"></i></div><h6>'+produto.nome+'</h6><h5>R$ '+produto.valor+'</h5></div></div>');
						}
						encontrou = true;	
					}
				}
				
			});	
		}
		
		if (!encontrou)
			$('#div-certificado').append('<h4>Nenhum certificado encontrado.</h4>');
		$('#row-certificado').show();
		loadRadioCheckBoxAndTooltip();
	}
	
	// se o tipo do certificado é bird id em nuvem, desabilita aos demais tipos de midia que não são arquivos
	if (tipocertificado == 'Bird ID (Nuvem)'){
		$('input[name=tipoMidia][value="Token"]').parent().parent().hide();
		$('input[name=tipoMidia][value="Cartão sem leitora"]').parent().parent().hide();
		$('input[name=tipoMidia][value="Cartão + leitora"]').parent().parent().hide();
	} else {
		$('input[name=tipoMidia][value="Token"]').parent().parent().show();
		$('input[name=tipoMidia][value="Cartão sem leitora"]').parent().parent().show();	
		$('input[name=tipoMidia][value="Cartão + leitora"]').parent().parent().show();
	}
	
	var videoConferencia = false;
	if ($("input[name='validacaoVideoConferenciaRadio'][checked=checked]").val() == "on")
		videoConferencia = true;			
	
	if (ocultarProdutoMidiaVideoConferencia && videoConferencia){
		$('input[name=tipoMidia][value="Token"]').parent().parent().hide();
		$('input[name=tipoMidia][value="Cartão sem leitora"]').parent().parent().hide();
		$('input[name=tipoMidia][value="Cartão + leitora"]').parent().parent().hide();
	} else if (tipocertificado != 'Bird ID (Nuvem)'){
		$('input[name=tipoMidia][value="Token"]').parent().parent().show();
		$('input[name=tipoMidia][value="Cartão sem leitora"]').parent().parent().show();	
		$('input[name=tipoMidia][value="Cartão + leitora"]').parent().parent().show();
	}
	
//	// se selecionou renovação online vai exibir apenas as opções de renovação online
//	if ($('input[name=validacaoRenovacaoOnlineRadio][checked=checked]').val() == "on"){
//		$('input[name=tipoMidia][value="Token"]').parent().parent().hide();
//		$('input[name=tipoMidia][value="Cartão sem leitora"]').parent().parent().hide();
//		$('input[name=tipoMidia][value="Cartão + leitora"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="Bird ID (Nuvem)"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="e-CPF"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="e-CNPJ"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="NF-e"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="CT-e"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="Certillion ID PF"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="Certillion ID PJ"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="ME / EPP / MEI"]').parent().parent().hide();
//		$('input[name=tipoCertificado][value="SSL"]').parent().parent().hide();
//	} else {
//		$('input[name=tipoCertificado][value="Renovação online"]').parent().parent().hide();
//	}
		
}

function selectProduto(p){
	if (p.value == undefined)
		return;

	$('#certificado-input').val(p.value);
	
	$.each(tabelaProduto, function(i, produto) {
		if (produto.id == p.value && produto.naoPermiteDescontoVoucherComisao == true){
			$('#row-voucher').hide();
		}
	});	
	
	ajaxBuscaTaxaDeliveryCadastrada(p);
}

function ajaxBuscaTaxaDeliveryCadastrada(produto) {	
	if($("#row-delivery").length == 0 || $("#row-delivery").is(":hidden"))
		return;	
	
	if ($(produto).val() != null && $(produto).val() != '<null>') {				
		var produto_id = $(produto).val();
		getJSON("/gestaofacil/publico/RealizarPedido",
				{'ACAO':'ajaxBuscaTaxaDeliveryCadastrada',
				'produto_id':produto_id
				}, 
			function(json) {
				if(json != null && json.taxaDelivery != null && json.taxaDelivery.disponibilizarSite != null && json.taxaDelivery.disponibilizarSite){					
					produtoComTaxaDeliveryNoCadastro = false;
					
					$('input[name=realizarDelivery][value="sim"]').prop('checked', true);
					onchangeRealizarDelivery();
					
					$("#taxaDelivery").val('br.com.gestaofacil.faturamento.beans.TaxaDelivery[id='+json.taxaDelivery.id+']');
					onchangeTaxaDelivery();					
					$('#taxaDelivery option:not(:selected)').prop('disabled', true);					
					
					produtoComTaxaDeliveryNoCadastro = true;
					
					if (produtoComTaxaDeliveryNoCadastro) {
						$("#row-taxaDelivery").hide();
						$('#taxaDelivery').val('<null>');
					}
				}else{
					limpaTaxaDelivery();
				}
			});	
  	}else{
  		limpaTaxaDelivery();
  	}
}

function limpaTaxaDelivery(){
	produtoComTaxaDeliveryNoCadastro = false;
	
	$('input[name=realizarDelivery][value="nao"]').prop('checked', true);
	onchangeRealizarDelivery();
	
	onchangeTaxaDelivery();	
	$('#taxaDelivery option').prop('disabled', false);
}

function validaDadosCartao() {
    var owner = $('#owner');
    var cardNumber = $('#cardNumber');
    var cardNumberField = $('#card-number-field');
    var CVV = $("#cvv");
    var confirmButton = $('#confirm-purchase');

    cardNumber.payform('formatCardNumber');
    CVV.payform('formatCardCVC');

   	var isCardValid = $.payform.validateCardNumber(cardNumber.val());
   	var isCvvValid = $.payform.validateCardCVC(CVV.val());

    if(owner.val().length < 5){
        alert("Nome do titular inválido");
        return false;
    } else if (!isCardValid) {
        alert("Número do cartão inválido ou cartão de crédito não aceito");
        return false;
    } else if (!isCvvValid) {
        alert("Código de verificação inválido");
        return false;
    } else {
        return true;
    }
}

function validaVoucher() {
	var pontoAtendimento_id = getValueId(form['pontoAtendimento'].value);
	var indicacao = $('#indicacao').val();	
	var produto_id = $('input[name=produto][checked]').val();
	var codigo = form['codigoVoucher'].value;
	var span = $(form['codigoVoucher']).next();
	
	if (codigo.length < 3){
		span.html('<i class="glyphicon glyphicon-3x glyphicon-remove-circle text-danger" aria-hidden="true" style="top: 6px;"></i>');
		$('#voucherValor').val("");
		$('#voucherPercentual').val("");
		loadDadosInfoPagamento();
		return;
	}
	
	span.html('<i class="glyphicon glyphicon-2x glyphicon-refresh glyphicon-spin text-info" aria-hidden="true" style="top: 6px;"></i>');
		getJSON("/gestaofacil/publico/RealizarPedido",
		{'ACAO':'ajaxValidaVoucher', 
		 'codigo': codigo,
		 'pontoAtendimento_id': pontoAtendimento_id,
		 'indicacao': indicacao,
		 'produto_id': produto_id
		}, function(json) {
			if (json.valido){
				span.html('<i class="glyphicon glyphicon-3x glyphicon-ok-circle text-success" aria-hidden="true" style="top: 6px;"></i>');
				$('#voucherValor').val(json.valor);
				$('#voucherPercentual').val(json.percentual);
				if(validaAo3Tech){
					if (json.tipoPessoaRadio == 'F'){
						escondeCamposPJ();
						
						$('input[name=cpf]').val(json.cnpjCpf);
						$('input[name=cpf]').parent().removeClass('is-empty');
						$('input[name=nome]').val(json.nomeCliente);
						$('input[name=nome]').parent().removeClass('is-empty');
						$('input[name=email]').val(json.email);
						$('input[name=email]').parent().removeClass('is-empty');
						$('input[name=municipio]').val(json.municipio);
						$('input[name=municipio]').parent().removeClass('is-empty');
						$('input[name=cpfContato]').val(json.cnpjCpf);
						$('input[name=cpfContato]').parent().removeClass('is-empty');

						ajaxBuscarTabelaProduto();

					} else if (json.tipoPessoaRadio == 'J'){
						escondeCamposPF();
						
						$('input[name=cnpj]').val(json.cnpjCpf);
						$('input[name=cnpj]').parent().removeClass('is-empty');
						$('input[name=nome]').val(json.nomeCliente);
						$('input[name=nome]').parent().removeClass('is-empty');
						$('input[name=email]').val(json.email);
						$('input[name=email]').parent().removeClass('is-empty');
						$('input[name=municipio]').val(json.municipio);
						$('input[name=municipio]').parent().removeClass('is-empty');
						
						ajaxBuscarTabelaProduto();

					}
				}
			} else {
				span.html('<i class="glyphicon glyphicon-3x glyphicon-remove-circle text-danger" aria-hidden="true" style="top: 6px;"></i>'+
						  '<br><font color="red">'+json.mensagem+'</font>');			
				$('#voucherValor').val("");
				$('#voucherPercentual').val("");
			}
			loadDadosInfoPagamento();
	 	}
	);
}

function selecionaBandeira(){
	var cardNumber = $('#cardNumber').val();
	if (cardNumber != ''){
		var tipo = $.payform.parseCardType(cardNumber);
		if (tipo != null && tipo != '')
			$('#credit_cards').val(tipo.toUpperCase());
	}
}

function onChangePagamento(tipo, p, integrarCartaoJuno, tokenPublicoJuno){
	if (tipo == 1)
		$('#row-cartao').show();
	else
		$('#row-cartao').hide();
	$('#pagamento-input').val(p.value);
	if (tokenPublicoJuno != undefined && tokenPublicoJuno != "")
		$('#tokenPublicoJuno').val(tokenPublicoJuno);
	integrarJuno = integrarCartaoJuno;
	
	ajaxBuscaValorTaxa();
}

function ajaxBuscaValorTaxa(){
	try {
	   formaPagamento = $('input[name=formaPagamento][checked=checked]');
	   if(formaPagamento != null){
		getJSON("/gestaofacil/publico/RealizarPedido?ACAO=ajaxBuscaValorTaxa", {"id": formaPagamento.val()}, 
			function(json) {
				if(json != null){
					valorTaxaCartaoBoleto = 0.00;
					valorTaxaAdicional = 0.00;
					percentualTaxaCartaoBoleto = 0.00;
					percentualTaxaAdicional = 0.00;					
					
					if(json.percentualCartaoBoleto > 0)
						percentualTaxaCartaoBoleto = (json.percentualCartaoBoleto / 100);
					else if(json.valorCartaoBoleto > 0)
						valorTaxaCartaoBoleto = json.valorCartaoBoleto;	
				
					if(json.percentualAdicional > 0)
						percentualTaxaAdicional = (json.percentualAdicional / 100);
					else if(json.valorCartaoBoleto > 0)
						valorTaxaAdicional = json.valorAdicional;		
						
					loadDadosInfoPagamento();
				}
			}
		);
		}
	}
	catch (e) {	 
	   console.log(e); 
	}
}

function canNext(){
	var tab = $('.wizard-navigation ul').find('li.active a').html();
	if (tab == "Cadastro"){
		var tipoPessoa = $('input[name=tipoPessoaRadio][checked=checked]').val();
		var cnpj = $('input[name=cnpj]').val();
		if (tipoPessoa == 'JURIDICA' && cnpj != ''){
			if (!$n.validationCNPJ(cnpj.match(/\d+/g).join(""))){
				alert('O CNPJ informado não é válido.');
				return false;
			}
		}
		var cpf = $('input[name=cpf]').val();
		if (tipoPessoa == 'FISICA' && cpf != ''){
			if (!$n.validationCPF(cpf.match(/\d+/g).join(""))){
				alert('O CPF informado não é válido.');
				return false;
			}
		}
		var ufRg = $('select[name=ufRg]').val();
		if (ufRg != undefined){
			if (ufRg == '<null>'){
				alert('A UF do RG é obrigatória.');
				return false;
			}
		}
	}
	if (tab == "Certificado"){
		if ($('input[name=produto][checked=checked]').val() == undefined){
			alert('Por favor escolha o certificado para proseguir com o pagamento.');
			return false;
		} else {
			ajaxBuscarTabelaProduto();
		}
	}
	if (tab == "Pagamento"){
		if ($('#row-cartao').css('display') != 'none')
			return validaDadosCartao();
		else if ($('input[name=formaPagamento][checked=checked]').parent().find('h6').text() == ""
			 			&& form['codigoVoucher'].value == ''){ 
			
				alert('É obrigatório informar uma forma de pagamento.');
				return false;
		} else
			return true;
	}
	if(tab == "Voucher"){
		if (validaAo3Tech){
			if (document.getElementsByName('formaPagamento')[0].checked == false){
				document.getElementsByName('formaPagamento')[0].click();
			}
			if($('#voucherPercentual').val() == ''){
				alert('Voucher informado não é valido');
				return false;
			}
			return true;
		}
	}
	return true;
}

function canPrior(){
	return true;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function afterNextTab(){
	verificaTipoCertificado();
	loadDadosInfoPagamento();
	loadDadosConfirmacao();
}

function verificaTipoCertificado(){
	// se a primeira etapa é a escolha do certificado
	if ($('#ordemEtapa').val() == 1){
		$("input[name='tipoPessoaRadio'][value='JURIDICA']").parent().show();
		$("input[name='tipoPessoaRadio'][value='FISICA']").parent().show();
		
		// verificando o tipo de certificado escolhido para exibição apenas do tipo de pessoa do certificado
		if ($('input[name=tipoCertificado][checked]').val() == 'e-CPF' || $('input[name=tipoCertificado][checked]').val() == 'Certillion ID PF' ||
				$('input[name=tipoCertificado][checked]').val() == 'Bird ID (Nuvem)' && $('input[name=produto][checked=checked]').parent().find('h6').text().includes('PF')){
			// escondendo a opção pj
			escondeCamposPJ();
		} else if ($('input[name=tipoCertificado][checked]').val() == 'e-CNPJ' ||$('input[name=tipoCertificado][checked]').val() == 'NF-e' || 
				$('input[name=tipoCertificado][checked]').val() == 'CT-e' || $('input[name=tipoCertificado][checked]').val() == 'Certillion ID PJ' ||
				$('input[name=tipoCertificado][checked]').val()== 'ME / EPP / MEI' || 
				$('input[name=tipoCertificado][checked]').val() == 'Bird ID (Nuvem)' && $('input[name=produto][checked=checked]').parent().find('h6').text().includes('PJ')){
			// escondendo a opção pf se foi um produto para pj
			escondeCamposPF();
		}		
	}	
}

function escondeCamposPJ(){
	$("input[name='tipoPessoaRadio'][value='JURIDICA']").parent().hide();
	$("input[name='tipoPessoaRadio'][value='JURIDICA']").removeAttr('checked');
	$("input[name='tipoPessoaRadio'][value='JURIDICA']").parent().removeClass('active');
	$("input[name='tipoPessoaRadio'][value='FISICA']").attr('checked', 'checked');
	$("input[name='tipoPessoaRadio'][value='FISICA']").parent().addClass('active');
	$("input[name='tipoPessoaRadio'][value='FISICA']").parent().addClass("centerTipoPF");
	$('#div-cpf').show();
	$('#div-cnpj').hide();
	$('input[name=cnpj]').val("");
	$('input[name=tipoPessoa]').val("FISICA");
	$('#labelNome').html('Nome');
	$('#divNomeResponsavel').hide();
	$('#divCpfResponsavel').hide();
	$('#cpfContato').hide();
}

function escondeCamposPF(){
	$("input[name='tipoPessoaRadio'][value='FISICA']").parent().hide();
	$("input[name='tipoPessoaRadio'][value='FISICA']").removeAttr('checked');
	$("input[name='tipoPessoaRadio'][value='FISICA']").parent().removeClass('active');
	$("input[name='tipoPessoaRadio'][value='JURIDICA']").attr('checked', 'checked');
	$("input[name='tipoPessoaRadio'][value='JURIDICA']").parent().addClass('active');
	$("input[name='tipoPessoaRadio'][value='JURIDICA']").parent().addClass("centerTipoPJ");
	$('#div-cpf').hide();
	$('#div-cnpj').show();
	$('input[name=cpf]').val("");
	$('input[name=tipoPessoa]').val("JURIDICA");
	$('#labelNome').html('Razão social');
	$('#divNomeResponsavel').show();
	$('#divCpfResponsavel').show();
	$('#cpfContato').show();

}

function loadDadosConfirmacao(){
	var label, conteudo;
	$('#div-confirmacao').empty();
	
	if ($("#divVerificaVideoConferencia").val() != undefined){
		label = 'Validação: '; conteudo = validacao; addDadosConfirmacao(label, conteudo);
	}
	
	label = 'Nome: '; conteudo = form['nome'].value; addDadosConfirmacao(label, conteudo);
	label = 'CPF/CNPJ: '; conteudo = form['cpf'].value + form['cnpj'].value; addDadosConfirmacao(label, conteudo);
	label = 'E-mail: '; conteudo = form['email'].value; addDadosConfirmacao(label, conteudo);
	label = 'Telefone: '; conteudo = form['telefone'].value; addDadosConfirmacao(label, conteudo);
	label = 'Celular: '; conteudo = form['celular'].value; addDadosConfirmacao(label, conteudo);
	label = 'Endereço: '; conteudo = form['logradouro'].value + ', ' + form['numero'].value + ' ' + form['complemento'].value + ' - ' + form['bairro'].value + ' - ' + form['cep'].value + ' - ' + form['municipio'].value + '/' + $('select[name=uf] option:selected').text(); addDadosConfirmacao(label, conteudo);
	
	if ($('#div-indicacao').css('display') != 'none'){
		label = 'Indicação: '; conteudo = form['indicacao'].value != '' ? form['indicacao'].value : 'Sem indicação'; addDadosConfirmacao(label, conteudo);
	}
	
	if (form['cpfResponsavel'] != undefined){
		if (form['cpfResponsavel'].value != ""){
			label = 'CPF do responsável: '; conteudo = form['cpfResponsavel'].value; addDadosConfirmacao(label, conteudo);
		}
	}
	if (form['nomeResponsavel'] != undefined){
		if (form['nomeResponsavel'].value != ""){
			label = 'Nome do responsável: '; conteudo = form['nomeResponsavel'].value; addDadosConfirmacao(label, conteudo);
		}
	}	
	if (form['rg'] != undefined && form['orgaoEmissor'] != undefined && form['ufRg'] != undefined){
		label = 'RG: '; conteudo = form['rg'].value + ' / ' + form['orgaoEmissor'].value + ' / ' + $('select[name=ufRg] option:selected').text(); addDadosConfirmacao(label, conteudo);
	}
	if (form['dataNascimento'] != undefined){
		label = 'Data de nascimento: '; conteudo = form['dataNascimento'].value; addDadosConfirmacao(label, conteudo);
	}
	if (form['profissao'] != undefined){
		label = 'Profissão: '; conteudo = form['profissao'].value; addDadosConfirmacao(label, conteudo);
	}
	
	if ($('input[name=tipoCertificado][checked=checked]').val() != undefined){
		label = 'Tipo de certificado: '; conteudo = $('input[name=tipoCertificado][checked=checked]').val(); addDadosConfirmacao(label, conteudo);
	}
	if ($('input[name=tipoMidia][checked=checked]').val() != undefined){
		label = 'Tipo de mídia: '; conteudo = $('input[name=tipoMidia][checked=checked]').val(); addDadosConfirmacao(label, conteudo);
	}
	if ($('input[name=validade][checked=checked]').val() != undefined){
		label = 'Validade: '; conteudo = $('input[name=validade][checked=checked]').val(); addDadosConfirmacao(label, conteudo);
	}
	label = 'Certificado: '; conteudo = $('input[name=produto][checked=checked]').parent().find('h6').text(); addDadosConfirmacao(label, conteudo);
	
	var voucherValor = $('#voucherValor').val() != '' && $('#voucherValor').val() != 'null' ? $('#voucherValor').val() : null;
	var voucherPercentual = $('#voucherPercentual').val() != '' && $('#voucherPercentual').val() != 'null' ? $('#voucherPercentual').val() : null;
	var valorTotal = $n.toFloat($('input[name=produto][checked=checked]').parent().find('h5').text().replace('R$ ', ''));
	
	if (voucherValor != null && valorTotal != undefined){
		valorTotal = valorTotal - $n.toFloat(voucherValor);
		label = 'Desconto do voucher: '; conteudo = voucherValor.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);
	} else if (voucherPercentual != null && valorTotal != undefined){
		var valorPercentual = valorTotal * ($n.toFloat(voucherPercentual)/100);
		valorTotal = valorTotal - valorPercentual;
		label = 'Desconto do voucher: '; conteudo = valorPercentual.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);
	}	
		
	if (validaAo3Tech){
		label = 'Valor: '; conteudo = 'Voucher'; addDadosConfirmacao(label, conteudo);	
	}else{
		// verificando se selecionou alguma taxa de delivery
		var valorTaxaDelivery = $("#taxaDelivery option:selected").text();
		if (valorTaxaDelivery != '' && valorTotal != undefined){
			valorTaxaDelivery = $("#taxaDelivery option:selected").text().split(" - ")[1].replace("R$ ","");
			valorTotal = valorTotal + $n.toFloat(valorTaxaDelivery); 
		}		
		
		//verifica taxa de cartão/boleto
		if(valorTaxaCartaoBoleto > 0){				
			valorTotal = valorTotal + valorTaxaCartaoBoleto; 			
		}else if(percentualTaxaCartaoBoleto > 0){	
			valorTotal = valorTotal + $n.toFloat((totalAntesTaxas * percentualTaxaCartaoBoleto).toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}).replace('R$','').trim()); 
		}
	
		//verifica taxa adicional
		if(valorTaxaAdicional > 0){	
			valorTotal = valorTotal + valorTaxaAdicional; 			
		}else if(percentualTaxaAdicional > 0){							
			valorTotal = valorTotal + $n.toFloat((totalAntesTaxas * percentualTaxaAdicional).toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}).replace('R$','').trim()); 
		}
			
		if(valorTotal > 0){
			label = 'Valor: '; 
			conteudo = valorTotal.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); 
			addDadosConfirmacao(label, conteudo);	
		}
	}
	
	label = 'Forma de pagamento: '; conteudo = $('input[name=formaPagamento][checked=checked]').parent().find('h6').text(); 
	if (voucherValor != null || voucherPercentual != null)
		conteudo += (conteudo.length > 0 ? ', Voucher' : 'Voucher');
	addDadosConfirmacao(label, conteudo);
}

function addDadosConfirmacao(label, conteudo){
	$('#div-confirmacao').append('<div class="input-group" style="text-align: center; width: 100%;"><label class="control-label">'+label+'</label>&nbsp;<span>'+conteudo+'</span></div>');
}


function loadDadosInfoPagamento(){
	// verificando se vai exibir as informações de delivery
	//onchangeRealizarDelivery();
	//console.log('loadDadosInfoPagamento');

	var label, conteudo;
	$('#div-inf-pagamento').empty();
	$('#div-inf-pagamento').append('<h4 class="info-text">Informações do pagamento:</h4>');
	$('#div-inf-voucher').empty();
	
	// verificando se selecionou alguma taxa de delivery
	var valorTaxaDelivery = $("#taxaDelivery option:selected").text();
	if (valorTaxaDelivery != ''){
		valorTaxaDelivery = $("#taxaDelivery option:selected").text().split(" - ")[1].replace("R$ ","");
	}
		
	var voucherValor = $('#voucherValor').val() != '' && $('#voucherValor').val() != 'null' ? $('#voucherValor').val() : null;
	var voucherPercentual = $('#voucherPercentual').val() != '' && $('#voucherPercentual').val() != 'null' ? $('#voucherPercentual').val() : null;
	
	// verificando se houve desconto
	if ($('input[name=produto][checked=checked]').parent().find(".valorSemDesconto").val() != null && 
		$('input[name=produto][checked=checked]').parent().find(".valorSemDesconto").val() != '' && 
		$('input[name=produto][checked=checked]').parent().find(".valorSemDesconto").val() != $('input[name=produto][checked=checked]').parent().find('h5').text()){
		
		var valorSemDesconto = $('input[name=produto][checked=checked]').parent().find(".valorSemDesconto").val();
		var valorTotal = $n.toFloat($('input[name=produto][checked=checked]').parent().find('h5').text().replace('R$ ', ''));
		var valorDesconto = $n.toFloat(valorSemDesconto.replace('R$ ', '')) - valorTotal;
		
		label = 'Valor do certificado: '; conteudo = valorSemDesconto; addDadosInfoPagamento(label, conteudo);
		label = 'Desconto pela indicação: '; conteudo = '-' + valorDesconto.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);
		
		if (voucherValor != null){
			valorTotal = valorTotal - $n.toFloat(voucherValor);
			label = 'Desconto do voucher: '; conteudo = voucherValor.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);
		} else if (voucherPercentual != null){
			var valorPercentual = (valorTotal * $n.toFloat(voucherPercentual)/100);
			valorTotal = valorTotal - valorPercentual;
			label = 'Desconto do voucher: '; conteudo = valorPercentual.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);
		}
		
		// verifica se possui taxa de delivery
		if (valorTaxaDelivery != ''){
			label = 'Taxa de delivery: '; conteudo = '+R$ ' + valorTaxaDelivery; addDadosInfoPagamento(label, conteudo);
			valorTotal = valorTotal + $n.toFloat(valorTaxaDelivery); 
			label = 'Valor total: '; conteudo = valorTotal.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);
		}
		
		if (valorTotal == 0){
			$('#row-pagamento').hide();
			$('#row-cartao').hide();
			$('#pagamento-input').val('');
		} else{			
			$('#row-pagamento').show();
		}
		
	} else {
		
		var valorTotal = $n.toFloat($('input[name=produto][checked=checked]').parent().find('h5').text().replace('R$ ', ''));
		
		if (voucherValor != null){
			valorTotal = valorTotal - $n.toFloat(voucherValor);
			label = 'Desconto do voucher: '; conteudo = voucherValor.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoVoucher(label, conteudo);
		} else if (voucherPercentual != null){
			var valorPercentual = (valorTotal * $n.toFloat(voucherPercentual)/100);
			valorTotal = valorTotal - valorPercentual;
			label = 'Desconto do voucher: '; conteudo = valorPercentual.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoVoucher(label, conteudo);
		}
		
		// verifica se possui taxa de delivery
		if (valorTaxaDelivery != ''){
			label = 'Valor taxa de delivery: '; conteudo = 'R$ ' + valorTaxaDelivery; addDadosInfoPagamento(label, conteudo);
			valorTotal = valorTotal + $n.toFloat(valorTaxaDelivery); 
		} 
		
		if (valorTotal == 0){
			$('#row-pagamento').hide();
			$('#row-cartao').hide();
			$('#pagamento-input').val('');
		} else{			
			$('#row-pagamento').show();
		}
	}
	
	totalTaxas = 0.00;
	totalAntesTaxas = valorTotal;
	//verifica taxa de cartão/boleto
	if(valorTaxaCartaoBoleto > 0){
		label = 'Taxa de cartão/boleto: '; conteudo = '+R$ ' + valorTaxaCartaoBoleto.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);	
		valorTotal = valorTotal + valorTaxaCartaoBoleto; 
		totalTaxas += valorTaxaCartaoBoleto; 
	}else if(percentualTaxaCartaoBoleto > 0){			
		label = 'Taxa de cartão/boleto: '; conteudo = '+R$ ' + (totalAntesTaxas * percentualTaxaCartaoBoleto).toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);	
		valorTotal = valorTotal + $n.toFloat((totalAntesTaxas * percentualTaxaCartaoBoleto).toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}).replace('R$','').trim()); 
		totalTaxas += totalAntesTaxas * percentualTaxaCartaoBoleto;
	}
	
	//verifica taxa adicional
	if(valorTaxaAdicional > 0){
		label = 'Taxa adicional: '; conteudo = '+R$ ' + valorTaxaAdicional.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);	
		valorTotal = valorTotal + valorTaxaAdicional; 
		totalTaxas += valorTaxaAdicional;
	}else if(percentualTaxaAdicional > 0){			
		label = 'Taxa adicional: '; conteudo = '+R$ ' + (totalAntesTaxas * percentualTaxaAdicional).toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); addDadosInfoPagamento(label, conteudo);	
		valorTotal = valorTotal + $n.toFloat((totalAntesTaxas * percentualTaxaAdicional).toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}).replace('R$','').trim()); 
		totalTaxas +=  totalAntesTaxas * percentualTaxaAdicional;
	}
	
	if(totalTaxas > 0){
		totalTaxas = totalTaxas.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"});
		totalTaxas = totalTaxas.replace('R$','').trim();
		$('#taxasFormaPagamento').val(totalTaxas);
	}
	
	if(valorTotal > 0){
		label = 'Valor total: '; 
		conteudo = valorTotal.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}); 
		addDadosInfoPagamento(label, conteudo);
	}
	
	if (validaAo3Tech){
		document.getElementById('div-inf-pagamento').style.display = 'none';
		document.getElementById('div-inf-voucher').style.display = 'none'; 
		document.getElementById('row-pagamento').style.display = 'none'; 
	}
	
}

function addDadosInfoPagamento(label, conteudo){
	$('#div-inf-pagamento').append('<div class="input-group" style="text-align: center; width: 100%;"><label class="control-label">'+label+'</label>&nbsp;<span>'+conteudo+'</span></div>');
}

function addDadosInfoVoucher(label, conteudo){
	$('#div-inf-voucher').append('<div class="input-group" style="text-align: center; width: 100%;"><label class="control-label">'+label+'</label>&nbsp;<span>'+conteudo+'</span></div>');
}

function solicitar(novamente){
	// parametro que indica se é renovaçãoOnline ou não
	renovacaoEmissaoOnline = false;
	if ($('input[name=validacaoRenovacaoOnlineRadio][checked=checked]').val() == "on"){ 
		renovacaoEmissaoOnline = true;
	}
	$("#renovacaoEmissaoOnline").val(renovacaoEmissaoOnline);
	if (integrarJuno){
		var checkout;
		if ($('#ambienteJunoProducao').val() == true || $('#ambienteJunoProducao').val() == 'true') {
			checkout = new DirectCheckout($('#tokenPublicoJuno').val());
		} else {  
			checkout = new DirectCheckout($('#tokenPublicoJuno').val(), false);
		}
		
		var cardData = {
		    cardNumber: $('#cardNumber').val().replace(/ /g, ''),
		    holderName: $('#owner').val(),
		    securityCode: $('#cvv').val(),
		    expirationMonth: $('#expiration-date').val().substring(0,2),
		    expirationYear: $('#expiration-date').val().substring(3,7)
		};	
		checkout.getCardHash(cardData, 
			function processaPagamento(cardHash){
				$('#creditCardHash').val(cardHash);
				$.ajax({
					type: "POST",
					url: "/gestaofacil/publico/RealizarPedido?ACAO=realizarPedido",
					data: $("#formRealizarPedido").serialize(),
					contentType:"application/x-www-form-urlencoded; charset=UTF-8",
					beforeSend: function(xhr, set){
						$.blockUI({ message: '' });
						if (novamente){
							$('#solicitar').attr('disabled','disabled'); 
							$('#solicitar').html('<i class="fa fa-spinner fa-spin"></i> Aguarde');
						} else {
							$('button[name=finish]').attr('disabled','disabled'); 
							$('button[name=finish]').html('<i class="fa fa-spinner fa-spin"></i> Aguarde');
						}
					},
					success: function(data){	
						if (data.retorno.erro){
							$('button[name=finish]').removeAttr('disabled'); 
							$('button[name=finish]').html('<i class="fa fa-check"></i> Tentar novamente');
						} else {
							$('button[name=finish]').hide();
							$('input[name=previous]').hide();
							$('.wizard-navigation').hide();
							$('#titulo').remove();
							$('.wizard-header').removeAttr("style");
							$('.wizard-footer .pull-right').empty();
							$('.wizard-footer .pull-right').append('<input type=\'button\' class=\'btn btn-next btn-fill btn-color btn-wd\' name=\'print\' value=\'Imprimir\' onclick=\'window.print();\'/>');
						}
						$('#identificador').val(data.retorno.identificador);
						$('#confirmacao').empty();
						$('#confirmacao').append(data.retorno.mensagem);
						$.unblockUI();
					}
				});
			}, 
			function exibeErro(error){
				var parser = new DOMParser;
				var dom = parser.parseFromString(
				    '<!doctype html><body>' + error,
				    'text/html');
				var decodedString = dom.body.textContent;
				alert(decodedString);
			}
		);		
		
	} else {
		$.ajax({
			type: "POST",
			url: "/gestaofacil/publico/RealizarPedido?ACAO=realizarPedido",
			data: $("#formRealizarPedido").serialize(),
			contentType:"application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function(xhr, set){
				$.blockUI({ message: '' });
				if (novamente){
					$('#solicitar').attr('disabled','disabled'); 
					$('#solicitar').html('<i class="fa fa-spinner fa-spin"></i> Aguarde');
				} else {
					$('button[name=finish]').attr('disabled','disabled'); 
					$('button[name=finish]').html('<i class="fa fa-spinner fa-spin"></i> Aguarde');
				}
			},
			success: function(data){	
				if (data.retorno.erro){
					$('button[name=finish]').removeAttr('disabled'); 
					$('button[name=finish]').html('<i class="fa fa-check"></i> Tentar novamente');
				} else {
					$('button[name=finish]').hide();
					$('input[name=previous]').hide();
					$('.wizard-navigation').hide();
					$('#titulo').remove();
					$('.wizard-header').removeAttr("style");
					$('.wizard-footer .pull-right').empty();
					$('.wizard-footer .pull-right').append('<input type=\'button\' class=\'btn btn-next btn-fill btn-color btn-wd\' name=\'print\' value=\'Imprimir\' onclick=\'window.print();\'/>');
				}
				$('#identificador').val(data.retorno.identificador);
				$('#confirmacao').empty();
				$('#confirmacao').append(data.retorno.mensagem);
				$.unblockUI();
			}
		});
	}
}

function onchangeTaxaDelivery(){
	loadDadosInfoPagamento();
}

function verificarPsBio(){
	var cpf = $('#cpfVideoConferencia').val();
	var cnpj = $('#cnpjVideoConferencia').val();
	
	if (integrarValid){
		window.open('https://validacao-interna.validcertificadora.com.br/');
		return;
		
		if (cpf == null || cpf == ''){
			alert('O número do CPF deve ser informado.');
			return;			
		}
	} else if (integrarSafeweb){
		if (cpf == null || cpf == ''){
			alert('O número do CPF deve ser informado.');
			return;			
		}
	} else {	
		// validando o tipo de pessoa com o campo informado
		if ($('#pessoaFisicaVideo').prop("checked") == true && (cpf == null || cpf == '')){
			alert('O número do CPF deve ser informado.');
			return;
		}
												
		if ($('#pessoaJuridicaVideo').prop("checked") == true && ((cpf == null || cpf == '') || (cnpj == null || cnpj == ''))) {
			alert('O número do CPF e do CNPJ deve ser informado.');
			return;
		}
	}
		
	waitingDialog.show("Verificando...");
	getJSON("/gestaofacil/publico/RealizarPedido?ACAO=ajaxConsultaPsBio", {"cpf": cpf, "cnpj": cnpj}, 
		function(json) {
			if (json.idnValid){
				$("#podeSerAtendidoVideoConferencia").show();
				$("#naoPodeSerAtendidoVideoConferencia").hide();
				$(".btn-next").removeAttr("disabled");
			} else {
				$("#podeSerAtendidoVideoConferencia").hide();
				$("#naoPodeSerAtendidoVideoConferencia").show();
//				$(".btn-next").attr("disabled", "disabled");
			}
			waitingDialog.hide();
		}
	);		
}

/*! jQuery Validation Plugin - v1.14.0 - 6/30/2015
 * https://jqueryvalidation.org/
 * Copyright (c) 2015 JÃ¶rn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.settings.submitHandler&&(c.submitButton=b.target),a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return c.settings.submitHandler?(c.submitButton&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),e=c.settings.submitHandler.call(c,c.currentForm,b),c.submitButton&&d.remove(),void 0!==e?e:!1):!0}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,d=d.concat(c.errorList)}),c.errorList=d),b},rules:function(b,c){var d,e,f,g,h,i,j=this[0];if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(b,c){i[c]=f[c],delete f[c],"required"===c&&a(j).removeAttr("aria-required")}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g),a(j).attr("aria-required","true")),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}),a.extend(a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){return!!a.trim(""+a(b).val())},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||-1!==a.inArray(c.keyCode,d)||(b.name in this.submitted||b===this.lastElement)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date ( ISO ).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c=a.data(this.form,"validator"),d="on"+b.type.replace(/^validate/,""),e=c.settings;e[d]&&!a(this).is(e.ignore)&&e[d].call(c,this,b)}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){d[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler),a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c=this.clean(b),d=this.validationTargetFor(c),e=!0;return this.lastElement=d,void 0===d?delete this.invalid[c.name]:(this.prepareElement(d),this.currentElements=a(d),e=this.check(d)!==!1,e?delete this.invalid[d.name]:this.invalid[d.name]=!0),a(b).attr("aria-invalid",!e),this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),e},showErrors:function(b){if(b){a.extend(this.errorMap,b),this.errorList=[];for(var c in b)this.errorList.push({message:b[c],element:this.findByName(c)[0]});this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors();var b,c=this.elements().removeData("previousValue").removeAttr("aria-invalid");if(this.settings.unhighlight)for(b=0;c[b];b++)this.settings.unhighlight.call(this,c[b],this.settings.errorClass,"");else c.removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){return!this.name&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.name in c||!b.objectLength(a(this).rules())?!1:(c[this.name]=!0,!0)})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([]),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d=a(b),e=b.type;return"radio"===e||"checkbox"===e?this.findByName(b.name).filter(":checked").val():"number"===e&&"undefined"!=typeof b.validity?b.validity.badInput?!1:d.val():(c=d.val(),"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f=a(b).rules(),g=a.map(f,function(a,b){return b}).length,h=!1,i=this.elementValue(b);for(d in f){e={method:d,parameters:f[d]};try{if(c=a.validator.methods[d].call(this,i,b,e.parameters),"dependency-mismatch"===c&&1===g){h=!0;continue}if(h=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(j){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",j),j instanceof TypeError&&(j.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),j}}if(!h)return this.objectLength(f)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a];return void 0},defaultMessage:function(b,c){return this.findDefined(this.customMessage(b.name,c),this.customDataMessage(b,c),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c],"<strong>Warning: No message defined for "+b.name+"</strong>")},formatAndAdd:function(b,c){var d=this.defaultMessage(b,c.method),e=/\$?\{(\d+)\}/g;"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),this.errorList.push({message:d,element:b,method:c.method}),this.errorMap[b.name]=d,this.submitted[b.name]=d},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g=this.errorsFor(b),h=this.idOrName(b),i=a(b).attr("aria-describedby");g.length?(g.removeClass(this.settings.validClass).addClass(this.settings.errorClass),g.html(c)):(g=a("<"+this.settings.errorElement+">").attr("id",h+"-error").addClass(this.settings.errorClass).html(c||""),d=g,this.settings.wrapper&&(d=g.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement(d,a(b)):d.insertAfter(b),g.is("label")?g.attr("for",h):0===g.parents("label[for='"+h+"']").length&&(f=g.attr("id").replace(/(:|\.|\[|\]|\$)/g,"\\$1"),i?i.match(new RegExp("\\b"+f+"\\b"))||(i+=" "+f):i=f,a(b).attr("aria-describedby",i),e=this.groups[b.name],e&&a.each(this.groups,function(b,c){c===e&&a("[name='"+b+"']",this.currentForm).attr("aria-describedby",g.attr("id"))}))),!c&&this.settings.success&&(g.text(""),"string"==typeof this.settings.success?g.addClass(this.settings.success):this.settings.success(g,b)),this.toShow=this.toShow.add(g)},errorsFor:function(b){var c=this.idOrName(b),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+d.replace(/\s+/g,", #")),this.errors().filter(e)},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+b+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):!0},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(a){this.pending[a.name]||(this.pendingRequest++,this.pending[a.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,"remote")})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0!==e.param?e.param:!0:delete b[d]}}),a.each(b,function(d,e){b[d]=a.isFunction(e)?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)},date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a).toString())},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9 \-]+/.test(a))return!1;var c,d,e=0,f=0,g=!1;if(a=a.replace(/\D/g,""),a.length<13||a.length>19)return!1;for(c=a.length-1;c>=0;c--)d=a.charAt(c),f=parseInt(d,10),g&&(f*=2)>9&&(f-=9),e+=f,g=!g;return e%10===0},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||d>=e},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||c>=a},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.off(".validate-equalTo").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d){if(this.optional(c))return"dependency-mismatch";var e,f,g=this.previousValue(c);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),g.originalMessage=this.settings.messages[c.name].remote,this.settings.messages[c.name].remote=g.message,d="string"==typeof d&&{url:d}||d,g.old===b?g.valid:(g.old=b,e=this,this.startRequest(c),f={},f[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:f,context:e.currentForm,success:function(d){var f,h,i,j=d===!0||"true"===d;e.settings.messages[c.name].remote=g.originalMessage,j?(i=e.formSubmitted,e.prepareElement(c),e.formSubmitted=i,e.successList.push(c),delete e.invalid[c.name],e.showErrors()):(f={},h=d||e.defaultMessage(c,"remote"),f[c.name]=g.message=a.isFunction(h)?h(b):h,e.invalid[c.name]=!0,e.showErrors(f)),g.valid=j,e.stopRequest(c,j)}},d)),"pending")}}});var b,c={};a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)})});
