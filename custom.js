document.write('<script type="text/javascript" src="http://ftpcontent.worldnow.com/wncustom/js/jquery.dotdotdot-1.5.1.js"></script>');
/* Version 20130816 - hlai */

//PLATFORM.EventMan.registerToEvent(function(){
//  CSbrandingPromo();
//}

function googleTranslateElementInit() {
		new google.translate.TranslateElement({
			pageLanguage : 'en',
			layout : google.translate.TranslateElement.InlineLayout.SIMPLE,
			autoDisplay : false
		}, 'google_translate_element');
}
function setupGoogleTranslate(){
	$wn('#WNSearchBox-headertop').append("<div id='google_translate_element'></div>");
	$wn('#google_translate_element').show();
}
document.write('<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>');
$wn(document).ready(function () {
	
	//load the google translate
	setupGoogleTranslate();
	
	
    //NOTE: External CSS Stylesheets should be added to the <HEAD> 
    $wn("<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' rel='stylesheet' type='text/css'>").appendTo("body");
    $wn(" <link href='http://fonts.googleapis.com/css?family=Gentium+Basic:700' rel='stylesheet' type='text/css'>").appendTo("body");



    //NOTE: CSS update should be made in CSS Stylesheet
    var worldlogo = $wn('.wnFooter').clone();
    $wn('.wnFooter').remove();
    $wn(worldlogo).insertBefore("#csFooterBottomText");
    $wn(".wnFooter").wrap('<a href="http://www.worldnow.com" target="_blank" />');
    $wn(".wnFooter").css("padding-left", "190px");
    $wn(".wnFooter").attr("src", "http://ftpcontent.worldnow.com/wncustom/custom/rfdtv/2013/worldnow_blue.png");
    $wn('#csFooterBottomText>a').css("color", "brown");
    $wn('#csFooterBottomText>a').css("font-weight", "bold");
    $wn('#csFooterBottomText').css("padding-bottom", "100px"); //pulls whitespace into the bottom of the footer

    //adds social network bar and links to  the page
    var WNButtonTop1 = " <a id='wnFB' href='https://www.facebook.com/OfficialRFDTV' target='_blank'></a>",
      WNButtonTop2 = "<a id='wnTwit' href='https://twitter.com/officialrfdtv' target='_blank'></a>",
      WNButtonTop3 = "<a id='wnYoutube' href='http://www.youtube.com/user/RFDTVnetwork' target='_blank'></a>",
      WNButtonTop4 = "<a id='insta' href='https://www.instagram.com/rfdtv/' target='_blank'></a>";

    $wn("<div id='wnSociBa'>" + WNButtonTop1 + WNButtonTop2 + WNButtonTop3 + WNButtonTop4 + "</div>").insertAfter(".wnSubmit:first");

    //remove top google search bar radio buttons
    $wn("#WNSearchBox-headertop").find("label").empty();
    $wn("#WNSearchBox-headertop-google_cs").remove();
    $wn("#WNSearchBox-headertop-ez").remove();

    //swaps 300x250B ad unit moved above the Feature Col4C position
    if ($("#WNDS66").length > 0) {
        $wn("#WNAd52").insertBefore("#WNDS66");
    } else {
        $wn('#WNAd52').appendTo($wn('#WNCol4'));
    }

    //custom static banner

    $wn("body").append("<div id='WNstaticbanner'><img usemap='#FindYou' src='http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/StaticFind.png' ><map name='FindYou'><area shape='rect' coords='650,20,925,50' href='http://www.rfdtv.com/link/649370/find-us-in-your-area'><area shape='rect' coords='960,10,1050,35' href='http://www.rfdtv.com/category/267729/advertisers'><area shape='rect' coords='960,35,1050,60' href='http://www.rfdtv.com/category/267692/press'><area shape='rect' coords='960,65,1050,80' href='http://www.rfdtv.com/category/268237/careers'></map></div>");


    var sbLeftPos = ($(window).width() - $wn('#WNstaticbanner').width()) / 2;
    $wn('#WNstaticbanner').css("left", sbLeftPos + "px");

    //alter the font size of the title 
    $wn('.iceHeadline.iceFeatureID-22939162.iceFeatureType-S').css("font-size", "15px");
    $wn(".wnContent.headline").css("font-size", "1.3em");
    // $wn("body").find('h4> .wnContent.headline')

    $wn('p').css("font-family", " Arial, 'Helvetica Neue',Helvetica,sans-serif");

    $wn('wnRole-STORY').css("font-family", "'Source Sans Pro', sans-serif");
    $wn('wnRole-STORY').css("font-size", "14px");

    // for IE11 Edge
    var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./); 
    if (isIE11) {
        $('#WNDS70').addClass('forIE11');
    }   
});

$(document).ready(function () {
        $wn('#WNAffRFDTV').css('background', '');
        header();
        headlineBoxes();
        //  for ie
        if( ( navigator.userAgent.indexOf('Safari') == -1 ) && ( navigator.userAgent.indexOf('Firefox') == -1 ) && ( navigator.userAgent.indexOf('Chrome') == -1 ) ){
            $('#WNAffRFDTV #WNHeader').css('margin-bottom','-10px');
        }
    
});

// NOTE: Simplify the user interaction command

$wn(window).scroll(function () {
    if ($wn(window).scrollTop() > 0) {
        $wn('#WNstaticbanner').show();
    } else {
        $wn('#WNstaticbanner').hide();
    }
});

/* Redesign */
function header(){
	$wn('#WNBranding img#WNBrandingImage').attr('src', 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/banner.png');
	//Top Left Links
    $wn("<div id='wnLinkDiv'><a class='wntopHeaderLeftLinks' href='http://www.rfdtv.com/category/268541/newsletter-sign-up-page'>Newsletter Signup</a><a class='wntopHeaderLeftLinks' href='http://www.rfdtvthemagazine.com/'>RFD-TV The Magazine</a><a class='wntopHeaderLeftLinks' href='http://www.rfdtvthetheatre.com/'>RFD-TV The Theatre</a><a class='wntopHeaderLeftLinks' href='http://store.rfdtv.com/category-s/100.htm'>Store</a></div>").insertAfter("#WNContainerMemberSearch-headertop");
    
    //search icon show hide
    $wn("#WNSearchBox-headertop .wnQueryText").hide(); 
    $wn("#WNSearchBox-headertop .wnSubmit").hide();
    $wn("#WNSearchBox-headertop .wnSubmit").attr('value', '');
    $wn("#WNSearchBox-headertop .wnQueryText").after("<div id='searchIcon'><img src='http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/search_icon.png'></div>");
    $wn("div").on("click", "#searchIcon", function() {
    	var searchBoxWidth = $wn(".wnQueryText").width();
    	$wn("#WNSearchBox-headertop .wnQueryText").animate({'width':"toggle"});
    	$wn("#WNSearchBox-headertop .wnSubmit").show();
    	$wn("#searchIcon").hide();
    	return false;
    });
    $wn("#WNSearchBox-headertop .wnQueryText").on("click", function() {return false;});
    $wn("body").on("click", function(e) {
    	$wn("#WNSearchBox-headertop .wnQueryText").hide(); 
    	$wn("#WNSearchBox-headertop .wnSubmit").hide();
    	$wn("#searchIcon").show();
    });
}
function headlineBoxes(){
	$wn('#WNCol2 .headlineBox .summaryImage.abridged').show();
	$wn('#WNCol2 .headlineBox .feature').each(function(){
		var imgSource = $wn(this).find('.summaryImage.abridged img').attr('data-path');
		$wn(this).find('.summaryImage.abridged img').attr('src', imgSource);
	});
	$wn('#WNCol2 .headlineBox .wnGroup').each(function(){
		$wn(this).find('.wnContent.more span').text('More');
		$wn(this).find('.wnContent.more').appendTo(this);
		
	});
}
