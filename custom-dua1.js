/* httprequest */
if (typeof (wng_includesTracker) == 'undefined') { var wng_includesTracker = {}; } wng_includesTracker['/global/interface/httprequest/httprequest.js'] = 1; if (!wng_includesTracker['/global/interface/globals.js']) { var wng_includesDomain = ''; var wng_includesVersion = ''; try { wng_includesDomain = wng_pageInfo.contentDomain; wng_includesVersion = wng_pageInfo.includesVersion; } catch (e) { wng_includesDomain = 'http://content.worldnow.com'; wng_includesVersion = '20070120'; } document.writeln('<scr' + 'ipt type="text/javascript" src="' + wng_includesDomain + '/global/interface/globals.js?ver=' + wng_includesVersion + '"></scr' + 'ipt>'); } var wng_doc = document; var WNHttpRequestManager = function () { var _PROXY_URL = 'http://www.rfdtv.com/global/interface/httprequest/hrproxy.asp'; var _PROXY_PARAM_URL = 'url'; var _METHODS = { GET: 1, HEAD: 1, POST: 1, PUT: 1, DELETE: 1 }; var _METHOD_DEFAULT = 'GET'; var _POST_MIMETYPE_DEFAULT = 'application/x-www-form-urlencoded'; var _XMLPARSER_LIBVERSIONS = [['MSXML2', '3.0'], ['MSXML2', '2.6'], ['Microsoft', '']]; var _RESPONSE_HEADERS_DELIMITER = new RegExp(':\\s+|\\n', 'g'); var _READYSTATE_HANDLERS = { onSuccess: true, onError: true, onCompleted: 4, onInteractive: 3, onLoaded: 2, onLoading: 1, onUninitialized: 0 }; var _encodeURIComponent = (typeof (encodeURIComponent) != 'undefined') ? encodeURIComponent : escape; function _convertXMLParserObjectType(libraryName, objectType) { if (libraryName != 'Microsoft') { return objectType; } switch (objectType) { case 'DOMDocument': { return 'XMLDOM'; break; } case 'FreeThreadedDOMDocument': { return 'FreeThreadedXMLDOM'; break; } case 'DSOControl': { return 'XMLDSO'; break; } default: { return objectType; break; } } } function _getProgId(libraryName, objectType, version) { var progId = ''; if (libraryName && objectType) { progId = libraryName + '.' + objectType; if (version) { progId += '.' + version; } } return progId; } function _getXMLParserActiveXControl(objectType) { if (!objectType || !window.ActiveXObject) { return; } var libraryName = _getXMLParserActiveXControl.libraryName; if (libraryName) { objectType = _convertXMLParserObjectType(libraryName, objectType); return new ActiveXObject(_getProgId(libraryName, objectType, _getXMLParserActiveXControl.version)); } var libVersion, libraryName, version, tempObjectType, xmlHttp, xmlParserObj; for (var i = 0, v = _XMLPARSER_LIBVERSIONS, l = v.length; i < l; i++) { libVersion = v[i], libraryName = libVersion[0], version = libVersion[1]; try { tempObjectType = _convertXMLParserObjectType(libraryName, objectType); xmlParserObj = new ActiveXObject(_getProgId(libraryName, tempObjectType, version)); _getXMLParserActiveXControl.libraryName = libraryName; _getXMLParserActiveXControl.version = version; return xmlParserObj; } catch (e) { } } } function _getXMLHttpRequest() { var request = null; try { if (window.XMLHttpRequest) { request = new XMLHttpRequest(); } else { request = _getXMLParserActiveXControl('XMLHTTP'); } } catch (e) { request = null; } return request; } function _loadXMLDocFromString(text) { var xmlDoc = null; if (text) { if (window.DOMParser) { var parser = new DOMParser(); xmlDoc = parser.parseFromString(text, 'text/xml'); if (xmlDoc.documentElement.nodeName == 'parsererror') { xmlDoc = null; } } else { xmlDoc = _getXMLParserActiveXControl('DOMDocument'); if (xmlDoc) { xmlDoc.async = false; loaded = xmlDoc.loadXML(text); if (!loaded) { xmlDoc = null; } } } } return xmlDoc; } function _setRequestHeaders(request, headers) { try { for (var header in headers) { request.setRequestHeader(header, headers[header]); } } catch (e) { } } function _extractResponseHeaders(headersText) { var values = headersText.split(_RESPONSE_HEADERS_DELIMITER); var headers = {}; var l = headers.length; if (l) { var i = 0; do { headers[values[i++]] = values[i++]; } while (i < l); } return headers; } function _XMLHttpResponse(request) { this.status = request.status; this.statusText = request.statusText; this.responseText = request.responseText; responseXML = request.responseXML; if (!responseXML || !responseXML.documentElement) { responseXML = _loadXMLDocFromString(this.responseText); } this.responseXML = responseXML; this._headersText = request.getAllResponseHeaders(); this._headers = null; } _XMLHttpResponse.prototype = { getResponseHeader: function (header) { if (!this._headers) { this._headers = _extractResponseHeaders(this._headersText); } return this._headers[header]; }, getAllResponseHeaders: function () { return this._headersText; } }; function _XMLHttpWrapper(url, options) { this.url = url; this.setOptions(options); this._statesHandled = {}; var self = this; this._handleRequestChange = function () { try { var readyState = self.request.readyState; } catch (e) { self.onRequestError(e); } switch (readyState) { case 0: { self._performCallback('onUninitialized'); break; } case 1: { self._performCallback('onLoading'); break; } case 2: { self._performCallback('onLoaded'); break; } case 3: { self._performCallback('onInteractive'); break; } case 4: { self._onRequestStateCompleted(); break; } } }; } _XMLHttpWrapper.prototype = { PROXY_URL: _PROXY_URL, setOptions: function (options) { if (typeof (options) != 'object' || options instanceof Array) { options = {}; } options.async = true; if (!_METHODS[options.method]) { options.method = _METHOD_DEFAULT; } if (!options.requestHeaders) { options.requestHeaders = {}; } if (options.method == 'POST') { if (!options.postData) { options.postData = ''; } if (!options.requestHeaders['Content-Type']) { options.requestHeaders['Content-Type'] = _POST_MIMETYPE_DEFAULT; } } if (!options.parameters) { options.parameters = ''; } this.options = options; }, getRequestUrl: function () { var url = this.url, useProxy = false; if (!url || typeof (url) != 'string') { return null; } var domainStart = url.indexOf('//'), slashIndex = url.indexOf('/'), urlLen = url.length; var hostEnd = (slashIndex > -1) ? slashIndex : urlLen; if (domainStart > -1 || (url.substring(0, hostEnd)).indexOf('.') > -1) { var protocol = url.substring(0, url.indexOf(':') + 1); if (protocol && protocol != window.location.protocol) { useProxy = true; } else { var domainEnd = url.indexOf('/', domainStart + 2); domainStart = (domainStart != -1) ? domainStart + 2 : 0, domainEnd = (domainEnd != -1) ? domainEnd : urlLen; var domain = url.substring(domainStart, domainEnd); if (window.location.host != domain) { useProxy = true; } } } var separator = (url.indexOf('?') == -1) ? '?' : '&'; var options = this.options; if (options.method == 'GET') { var parameters = this.getRequestParameters(); if (parameters.length) { url += separator + parameters; } } var fullUrl = ''; if (useProxy) { url = _encodeURIComponent(url); fullUrl += this.PROXY_URL; var separator = (fullUrl.indexOf('?') == -1) ? '?' : '&'; var parameters = this.getRequestParameters('proxyParameters'); if (parameters.length) { fullUrl += separator + parameters; separator = '&'; } fullUrl += separator + _PROXY_PARAM_URL + '='; } fullUrl += url; var separator = (fullUrl.indexOf('?') == -1) ? '?' : '&'; fullUrl += separator + 'rand=' + (Math.floor(Math.random() * 999999)); return fullUrl; }, getRequestParameters: function (type) { var parameters = (type != 'proxyParameters') ? this.options['parameters'] : this.options['proxyParameters']; var paramsTypeOf = typeof (parameters); var paramsStr = ''; if (parameters && paramsTypeOf == 'string') { var params = parameters.split('&'); for (var i = 0, l = params.length, param; i < l; i++) { param = params[i].split('='); paramsStr += '&' + _encodeURIComponent(param[0]) + '=' + _encodeURIComponent(param[1]); } } else if (paramsTypeOf == 'object' && !(parameters instanceof Array)) { for (var key in parameters) { paramsStr += '&' + _encodeURIComponent(key) + '=' + _encodeURIComponent(parameters[key]); } } if (paramsStr) { paramsStr = paramsStr.substr(1); } return paramsStr; }, makeRequest: function () { try { var request = _getXMLHttpRequest(); if (request) { var url = this.getRequestUrl(); if (url) { this.request = request; var options = this.options, method = options.method, headers = options.requestHeaders; var content = null; if (method == 'POST') { content = options.postData; if (headers.mimetype == _POST_MIMETYPE_DEFAULT) { var parameters = this.getRequestParameters(); if (parameters) { if (content) { content += '&'; } content += parameters; } } headers['Content-Length'] = content.length; headers['Connection'] = 'close'; } request.onreadystatechange = this._handleRequestChange; if (typeof (WNClosureTracker) != 'undefined') { WNClosureTracker.add(this.request, 'onreadystatechange', true); WNClosureTracker.add(this, 'request'); } request.open(method, url, options.async); _setRequestHeaders(request, headers); request.send(content); } else { throw new Error('Invalid request url'); } } else { throw new Error('XMLHTTPRequest not supported by this browser'); } } catch (e) { this.onRequestError(e); } }, _performCallback: function (name) { try { if (this._statesHandled[name]) { return; } this._statesHandled[name] = true; var callback = this.options[name]; if (callback) { var handler, args = []; if (typeof (callback) == 'function') { handler = callback; } else if (callback instanceof Array) { handler = callback[0]; if (callback.length > 1) { args = callback[1]; } } else if (typeof (callback) == 'object') { handler = callback.callback; if (typeof (callback.args) != 'undefined') { args = callback.args; } } if (!(args instanceof Array)) { args = [args]; } if (arguments.length > 1) { var al = args.length; for (var i = 1, l = arguments.length; i < l; i++) { args[al++] = arguments[i]; } } if (typeof (handler) == 'function') { if (handler.apply) { handler.apply(this, args); } else { var arg; for (var i = 0, l = args.length, arg; i < l; i++) { arg = args[i]; if (typeof (arg) == 'string') { args[i] = "'" + arg + "'"; } } eval('handler(' + args.toString() + ')'); } } } } catch (e) { if (name != 'onError') { this.onRequestError(e); } else { } } }, onRequestError: function (e) { this.errorMessage = (e.message || e); this._performCallback('onError', e); }, _onRequestStateCompleted: function () { try { if (this._statesHandled['onCompleted']) { return; } this.response = new _XMLHttpResponse(this.request); this._performCallback('onCompleted'); var status = this.response.status; delete this.request['onreadystatechange']; this.request = null; if (status == 200 || status == 304) { this._performCallback('onSuccess'); } else { throw new Error('XMLHTTPRequest status was ' + status); } } catch (e) { this.onRequestError(e); } } }; var Manager = { Handlers: {}, makeRequest: function (url, options) { var xmlHttpRequest = new _XMLHttpWrapper(url, options); xmlHttpRequest.makeRequest(); return xmlHttpRequest; }, transferNodeData: function (parent, nodeName, target) { var result = false; try { var source = parent.getElementsByTagName(nodeName); source = (source.length) ? source[0] : this.retrieveChildElement(parent, nodeName); if (source) { var hasInnerHTML = typeof (target.innerHTML) != 'undefined'; var nLen = source.childNodes.length; if (hasInnerHTML && nLen == 1) { target.innerHTML = source.firstChild.nodeValue; result = true; } else if (hasInnerHTML && typeof (source.xml) != 'undefined' && nLen) { if (nLen == 1) { target.innerHTML = source.firstChild.xml; } else { var htmlStr = ''; var child = source.firstChild; if (child) { do { htmlStr += child.xml; } while (child = child.nextSibling); } target.innerHTML = htmlStr; } result = true; } else { try { target.appendChild(wng_doc.importNode(source, true)); result = true; } catch (e) { } } } } catch (e) { } if (!result && target && target.style) { target.style.display = 'none'; } return result; }, retrieveChildElement: function (parent, nodeName) { if (!parent.childNamesIndex) { parent.childNamesIndex = { _index: 0 }; } var namesIndex = parent.childNamesIndex; var nIndex = (!recalculate) ? namesIndex._index : 0; var nodes = parent.childNodes, nLen = nodes.length; if (nIndex === nLen) { var cIndex = namesIndex[nodeName]; return (typeof (cIndex) == 'number') ? nodes[cIndex] : null; } var node; while (nIndex < nLen) { node = nodes[nIndex]; if (node.nodeType === 1) { namesIndex[node.nodeName] = nIndex; if (node.nodeName === nodeName) { break; } } nIndex++; } namesIndex._index = nIndex; parent.childNamesIndex = namesIndex; var cIndex = namesIndex[nodeName]; return (typeof (cIndex == 'number')) ? nodes[cIndex] : null; } }; Manager.Handlers.RSS = function () { var _RSS_TARGET_DEFAULT = '_blank'; var _RSS_REQUIRED_NODES_DEFAULT = { link: 1, title: 1 }; function _createItemStructure(target) { var item = wng_doc.createElement('DIV'); item.className = 'rssItem'; var href = wng_doc.createElement('A'); href.setAttribute('target', target); item.appendChild(href); var desc = wng_doc.createElement('DIV'); desc.className = 'rssItemDesc'; item.appendChild(desc); return item; } return { onSuccess: function (targetId, options) { try { if (!options) { options = {}; } var wrapper = wng_doc.getElementById(targetId); if (options.clearTarget) { var child = wrapper.firstChild; while (child) { wrapper.removeChild(child); child = wrapper.firstChild; } } var xmlDoc = this.response.responseXML; var nodes = xmlDoc.documentElement.getElementsByTagName('item'), nLen = nodes.length; if (nLen == 0 && options.hideEmpty) { return; } var limit = options.limit; if (typeof (limit) != 'number' || limit > nLen) { limit = nLen; } var bucket = wng_doc.createElement('DIV'); bucket.className = 'rssBucket'; var header = wng_doc.createElement('DIV'); header.className = 'rssHeader'; var oHeader = options.header; if (oHeader) { if (typeof (header.innerHTML) != 'undefined') { header.innerHTML = oHeader; } else { oHeader = (oHeader.nodeType) ? oHeader.cloneNode(true) : wng_doc.createTextNode(oHeader); header.appendChild(oHeader); } } var footer = wng_doc.createElement('DIV'); footer.className = 'rssFooter'; var oFooter = options.footer; if (oFooter) { if (typeof (footer.innerHTML) != 'undefined') { footer.innerHTML = oFooter; } else { oFooter = (oFooter.nodeType) ? oFooter.cloneNode(true) : wng_doc.createTextNode(oFooter); footer.appendChild(oFooter); } } var items = wng_doc.createElement('DIV'); items.className = 'rssItems'; var displayWhileLoading = options.displayWhileLoading; if (displayWhileLoading) { bucket.appendChild(header); bucket.appendChild(items); wrapper.appendChild(bucket); } var itemClone = _createItemStructure(options.target || _RSS_TARGET_DEFAULT); var requiredNodes = options.requiredNodes || _RSS_REQUIRED_NODES_DEFAULT; var transfer = WNHttpRequestManager.transferNodeData; var retrieve = WNHttpRequestManager.retrieveChildElement; for (var i = 0, node, item, linkVal; i < limit; i++) { node = nodes[i]; item = itemClone.cloneNode(true); linkVal = node.getElementsByTagName('link'); linkVal = (linkVal.length) ? linkVal[0] : retrieve(node, 'link'); linkVal = (linkVal) ? linkVal.firstChild : null; if (linkVal && linkVal.nodeValue) { item.firstChild.setAttribute('href', linkVal.nodeValue); } else if (requiredNodes['link']) { continue; } if (!transfer(node, 'title', item.firstChild) && requiredNodes['title']) { continue; } if (!transfer(node, 'description', item.lastChild) && requiredNodes['description']) { continue; } items.appendChild(item); } if (!displayWhileLoading) { bucket.appendChild(header); bucket.appendChild(items); } bucket.appendChild(footer); if (!displayWhileLoading) { wrapper.appendChild(bucket); } } catch (e) { this.onRequestError(e); } }, onError: function (targetId, options, e) { try { if (!options) { options = {}; } if (options.hideTarget) { var wrapper = wng_doc.getElementById(targetId); wrapper.style.display = 'none'; } } catch (e) { } } }; } (); return Manager; } ();

/*================================
 * INSERT LIBs
 *================================*/
document.write("\<script src='http://ftpcontent.worldnow.com/wncustom/js/jquery.ellipsis.js' type='text/javascript'>\<\/script>");

/*================================
 * GLOBAL VARIABLES
 *================================*/

var url = window.location.href.indexOf('#') > -1 ? window.location.href.substring(0, window.location.href.indexOf('#')) : window.location.href;
url = url.indexOf('/?clienttype=smartdevice') > -1 ? url.replace('/?clienttype=smartdevice', '') : url; // use check mobile on desktop
url = url.indexOf('?clienttype=smartdevice') > -1 ? url.replace('?clienttype=smartdevice', '') : url; // use check mobile on desktop
var isPromotion1 = wng_pageInfo.contentClassification == "Promotion 1" ? true : false;
    isPromotion1 = wng_pageInfo.containerId == 310304 ? true : isPromotion1;
    isPromotion1 = wng_pageInfo.containerId == 304378 ? true : isPromotion1;
var proxyURL = 'https://crossorigin.me/';
var MostPopularStoriesCategoryNumber = "259595";
var MostPopularVideosCategoryNumber = "259596";
var MostPopularNumberOfItems = "10";
var proxyURL = "https://crossorigin.me/";
var itemsLatestNewsWesternSport = 17;
var itemsTopStoryWesternSport = 10;

var weatherDummy = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/weather_author_dummy.PNG';
var iconHourlyForecast = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/icon_weather_page.png';
// link social of the team weather
var wxTeamSocialInfo = [
    ['Steve Kenyon', 'https://www.facebook.com/RodeoProfilesSteveKenyon', 'https://twitter.com/ProRodeoLive', 'newsdesk@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/steve_kenyon156x132.jpg'],
    ['Mark Oppold', 'https://www.facebook.com/OfficialRFDTV', 'https://twitter.com/markoppold', 'newsdesk@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/mark_oppold_156x132.jpg'],
    ['Janet Adkison', 'https://www.facebook.com/OfficialRFDTV', 'https://twitter.com/janetadkison', 'newsdesk@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/Adkison_156x132.jpg'],
    ['Flint Rasmussen', 'https://www.facebook.com/Flint-Rasmussen-124268980977250/', 'https://twitter.com/Flintrass', 'newsdesk@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/flint_rasmussen_156x132.jpg'],
    ['Christina Loren', 'https://www.facebook.com/Christina.Loren.Meteorologist/', 'https://twitter.com/Christina_Loren', 'Chris@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/christina_156x132.jpg'],
    ['Marlin Bohling', 'https://www.facebook.com/OfficialRFDTV', 'https://twitter.com/MarlinOnAir', 'newsdesk@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/marlin_156x132.jpg'],
    ['Amy Wilson', 'https://www.facebook.com/OfficialRFDTV', 'https://twitter.com/amysuewilson', 'wsr@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/amy_wilson_156x132.jpg'],
    ['Tim Ross', 'https://www.facebook.com/OfficialRFDTV', 'https://twitter.com/timrossfineart', 'newsdesk@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/tim_ross_156x132.jpg'],
    ['Tim Blain', 'https://www.facebook.com/OfficialRFDTV', 'https://twitter.com/OfficialRFDTV', 'Timb@rfdtv.com',
    'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/rfdtv_anchors/tim_ross_156x132.jpg']

];
var jsonUrls = {
    dataJSON: "?clienttype=container.json",
    weather: "/category/259585/weather?clienttype=weather.json",
    schedule: {
        RFDTV: "http://schedule.rfdcc.com/rfdtv/default.json",
        FamilyNet: "http://schedule.rfdcc.com/rfdtv/default_fnet.json",
        RuralRadio: "http://schedule.rfdcc.com/rfdtv/default_radio.json",
        RFDTVLink: 'http://www.rfdtv.com/category/267411/schedule',
        FamilyNetLink: 'http://family.rfdcc.com/schedule',
        RuralRadioLink: 'http://schedule.rfdcc.com/radio/index.html'
    },
    weatherPage: {
        data: "http://data-services.wsi.com/200904-01/576347879/Weather/Report/",
        defaultZipCode: '37201',
        info: '?clienttype=weather.json'
    }
};

// a schedule HTML RAW structure to render this schedule block
var scheduleDiv = '<div id="div-full-schedule">' +
    '<div id="div-full-schedule-title">' +
    ' <span class="active" id="rfd-tv">RFD-TV</span>' +
    '<span id="family-net"><span class="rules">|</span>FAMILYNET</span>' +
    ' <span id="rural-radio"><span class="rules">|</span>RURAL RADIO</span>' +
    '</div>' +
    '<div id="div-full-schedule-content">' +
    '<div class="div-sub-content-out">' +
    '<img class="img-pre-button" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/iconleft.png" alt="previous" />' +
    '</div>' +
    '<div id="div-full-schedule-rfd-tv" class="div-schedule-content-tab">' +
    '</div>' +
    '<div id="div-full-schedule-familynet" class="div-schedule-content-tab hide">' +
    '</div>' +
    '<div id="div-full-schedule-rural-radio" class="div-schedule-content-tab hide">' +
    '</div>' +
    '<div class="div-sub-content-out" style="margin-left: -5px; margin-right: 0px;">' +
    '<img class="img-next-button" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/iconright.png" alt="next" />' +
    '</div>' +
    '<div id="div-full-shedule"><a href="/category/267411/schedule" tagret="blank">full schedule</a></div>' +
    '</div>' +
    '</div>';
// a weather page HTML RAW structure to render this Weather Forecast block
var weatherForecastPage = '<div id="currentConditions"><div class="conditions"></div><div class="player">' +
    '</div></div>' +
    '<div id="meterologistForecast"></div>' +
    '<div class="wnBlock displaySize">' +
    '<div class="hourly-forecast-wrapper clearfix">' +
    '<div class="wnGroup contentGroup collapsible closed">' +
    '<div class="wnItem header"><h3><span class="text siteDefault">Hourly Forecast</span><div class="wnClear"></div></h3></div>' +
    '<div id="hourlyForecast" class="hourly-group jcarousel clearfix">' +
    '<span><img style="     transform: rotate(180deg); webkit-transform: rotate(180deg); ms-transform: rotate(180deg) " src="' + iconHourlyForecast + '"></span>' +
    '<ul class="hourly-rail"></ul>' +
    '<span><img src="' + iconHourlyForecast + '"></span>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="wnBlock displaySize">' +
    '<div class="daily-forecast-wrapper clearfix">' +
    '<div class="wnGroup contentGroup collapsible closed">' +
    '<div class="wnItem header"><h3><span class="text siteDefault">7 DAY FORECAST</span><div class="wnClear"></div></h3></div>' +
    '<div id="dailyForecast" class="daily-group jcarousel clearfix">' +
    '<ul class="daily-rail"></ul>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

/* script block handle render video player in weather block homepage */
function WN187476() {

    var wnWidgetId_513;
    if (wnWidgetId_513 == undefined) wnWidgetId_513 = "187476";

    var WNVideoCanvas513 = new WNVideoWidget("WNVideoCanvas", "divWNVideoCanvas513");
    WNVideoCanvas513.SetStylePackage("dark");
    WNVideoCanvas513.SetVariable("widgetId", wnWidgetId_513);
    WNVideoCanvas513.SetVariable("addThisDivId", "divWNImageCanvas513_addThis");
    WNVideoCanvas513.SetVariable("incanvasAdDivId", "divWNImageCanvas513_adDiv");
    WNVideoCanvas513.SetVariable("helpPage", "http://www.rfdtv.com/story/4925699/player-help");
    WNVideoCanvas513.SetVariable("isMute", "false");
    WNVideoCanvas513.SetVariable("isAutoStart", "false");
    WNVideoCanvas513.SetSkin(CANVAS_SKINS.flat.silver);
    WNVideoCanvas513.SetVariable("toolsShareButtons", "link,share");
    WNVideoCanvas513.SetVariable("overlayShareButtons", "link,share");
    WNVideoCanvas513.SetWidth(275);
    WNVideoCanvas513.SetHeight(169);
    WNVideoCanvas513.RenderWidget();

    var WNGallery513 = new WNVideoWidget("WNGallery", "divWNGallery513");
    WNGallery513.SetStylePackage("dark");
    WNGallery513.SetVariable("widgetId", wnWidgetId_513);
    WNGallery513.SetVariable("addThisDivId", "divWNImageCanvas513_addThis");
    WNGallery513.SetVariable("incanvasAdDivId", "divWNImageCanvas513_adDiv");
    WNGallery513.SetVariable("isContinuousPlay", "false");
    WNGallery513.SetVariable("hasSearch", "false");
    WNGallery513.SetVariable("topVideoCatNo", "317627");
    WNGallery513.SetWidth(1);
    WNGallery513.SetHeight(1);
    WNGallery513.RenderWidget();
}
/* script block handle render video player in weather block for the weather page */
function WN188924() {

    var wnWidgetId_673;
    if (wnWidgetId_673 == undefined) wnWidgetId_673 = "188924";

    var WNVideoCanvas673 = new WNVideoWidget("WNVideoCanvas", "divWNVideoCanvas673");
    WNVideoCanvas673.SetStylePackage("dark");
    WNVideoCanvas673.SetVariable("widgetId", wnWidgetId_673);
    WNVideoCanvas673.SetVariable("addThisDivId", "divWNImageCanvas673_addThis");
    WNVideoCanvas673.SetVariable("incanvasAdDivId", "divWNImageCanvas673_adDiv");
    WNVideoCanvas673.SetVariable("helpPage", "http://www.rfdtv.com/story/4925699/player-help");
    WNVideoCanvas673.SetVariable("isMute", "false");
    WNVideoCanvas673.SetVariable("isAutoStart", "false");
    WNVideoCanvas673.SetSkin(CANVAS_SKINS.flat.silver);
    WNVideoCanvas673.SetVariable("toolsShareButtons", "link,share");
    WNVideoCanvas673.SetVariable("overlayShareButtons", "link,share");
    WNVideoCanvas673.SetWidth(520);
    WNVideoCanvas673.SetHeight(290);
    WNVideoCanvas673.RenderWidget();

    var WNGallery673 = new WNVideoWidget("WNGallery", "divWNGallery673");
    WNGallery673.SetStylePackage("dark");
    WNGallery673.SetVariable("widgetId", wnWidgetId_673);
    WNGallery673.SetVariable("addThisDivId", "divWNImageCanvas673_addThis");
    WNGallery673.SetVariable("incanvasAdDivId", "divWNImageCanvas673_adDiv");
    WNGallery673.SetVariable("isContinuousPlay", "false");
    WNGallery673.SetVariable("hasSearch", "false");
    WNGallery673.SetVariable("topVideoCatNo", "317627");
    WNGallery673.SetWidth(1);
    WNGallery673.SetHeight(1);
    WNGallery673.RenderWidget();

}
var CDEVRFDTV = {

    WNHttpRequestManagerRequest: function (url, callbacksuccess, callbackerror) {
        WNHttpRequestManager.makeRequest(url, {
            onSuccess: function () {
                // var data = $.parseJSON(this.response.responseText);
                callbacksuccess(this.response);
            },
            onError: function (e) {
                console.log('error when call WNHttpRequestManager function.');
                callbackerror(e);
                return;
            }
        });
    },
    callAjax: function (url, callbacksuccess, callbackerror) {
        $.ajax({
            url: url,
            success: function (data) {
                callbacksuccess(data);
            },
            error: function (data) {
                callbackerror(data);
            }
        });
    },
    ///////////////////////////////
    // WEBSITE
    ///////////////////////////////
    schedule: function () {
        var isLoaded = 0;
        var indexRFDTV = 0;
        var indexFamilyNet = 0;
        var indexRadio = 0;
        var listScheduleRFDTV = [];
        var listScheduleFamilyNet = [];
        var listScheduleRuralRadio = [];
        var childShow = 0;
        var currentPositionPostOfScheduleRFDTV = 0;
        var currentPositionPostOfScheduleFamilyNet = 0;
        var currentPositionPostOfScheduleRadio = 0;
        var divSubContent = '<div class="div-sub-content" number="{?number}" >' +
            '<span class="span-up {?hide}">{?when}</span>' +
            '<span class="span-time-start">{?time}</span>' +
            '<span class="span-who">{?whoShow}</span>' +
            '<span class="span-ep">{?ep}</span>' +
            '</div>';
        // get data
        // function getData() {
        //     CDEVRFDTV.WNHttpRequestManagerRequest(proxyURL + jsonUrls.schedule.RFDTV, renderScheduleRFDTV, '');
        //     CDEVRFDTV.WNHttpRequestManagerRequest(proxyURL + jsonUrls.schedule.FamilyNet, renderScheduleFamilyNet, '');
        //     CDEVRFDTV.WNHttpRequestManagerRequest(proxyURL + jsonUrls.schedule.RuralRadio, renderScheduleRuralRadio, '');
        // }

        function getData() {
            CDEVRFDTV.callAjax(proxyURL + jsonUrls.schedule.RFDTV, renderScheduleRFDTV, renderScheduleRFDTV);
            CDEVRFDTV.callAjax(proxyURL + jsonUrls.schedule.FamilyNet, renderScheduleFamilyNet, renderScheduleFamilyNet);
            CDEVRFDTV.callAjax(proxyURL + jsonUrls.schedule.RuralRadio, renderScheduleFamilyNet, renderScheduleRuralRadio);
            // CDEVRFDTV.WNHttpRequestManagerRequest(jsonUrls.schedule.RFDTV, renderScheduleRFDTV, '');
            // CDEVRFDTV.WNHttpRequestManagerRequest(jsonUrls.schedule.FamilyNet, renderScheduleFamilyNet, '');
            // CDEVRFDTV.WNHttpRequestManagerRequest(jsonUrls.schedule.RuralRadio, renderScheduleRuralRadio, '');
            autoUpdateSchedule();
        }
        /**
         * Render schedule data
         */
        function renderScheduleRFDTV(data) {
            var str = data.responseText;
            if ( typeof str == 'undefined' )
              return;
            str = str.substring(21);
            str = str.substring(0, str.length - 4);
            try {
                data = $.parseJSON(str);
            } catch (erro) {
                data = '';
            }
            if (typeof data != "string") {
                listScheduleRFDTV = data.items;
                addContentToDiv('div-full-schedule-rfd-tv', listScheduleRFDTV);
                resetWidthForSubDiv('div-full-schedule-rfd-tv');
            }
            isLoaded++;
        };
        function filterSchedule(ob, type) {
            index = 0;
            for (var i = 0; i < ob.length; i++) {
                var time = convertToEDTTimeZone(new Date(ob[i].airdate));
                if (new Date() <= new Date(ob[i].airdate)) {
                    if (i != 0)
                        switch (type) {
                            case 1:
                                indexRFDTV = i - 1;
                                break;
                            case 2:
                                indexFamilyNet = i - 1;
                                break;
                            case 3:
                                indexRadio = i - 1;

                        }
                    break;
                }
            }

        }
        function autoUpdateSchedule() {
            setInterval(function () {
                var time = new Date();
                var minute = time.getMinutes();
                if ((minute == 0 || minute == 30) && isLoaded >= 3) {
                    isLoaded = 0;
                    getData();
                }
            }, 1000);
        }
        function renderScheduleFamilyNet(data) {
            var str = data.responseText;
            if ( typeof str == 'undefined' )
              return;
            str = str.substring(21);
            str = str.substring(0, str.length - 4);
            try {
                data = $.parseJSON(str);
            } catch (erro) {
                data = '';
            }
            if (typeof data != "string") {
                listScheduleFamilyNet = data.items;
                addContentToDiv('div-full-schedule-familynet', listScheduleFamilyNet);
                resetWidthForSubDiv('div-full-schedule-familynet');
            }
            isLoaded++;
        };

        function renderScheduleRuralRadio(data) {
            var str = data.responseText;
            if ( typeof str == 'undefined' )
              return;
            str = str.substring(21);
            str = str.substring(0, str.length - 4);
            try {
                data = $.parseJSON(str);
            } catch (erro) {
                data = '';
            }
            if (typeof data != "string") {
                listScheduleRuralRadio = data.items;
                addContentToDiv('div-full-schedule-rural-radio', listScheduleRuralRadio);
                resetWidthForSubDiv('div-full-schedule-rural-radio');
            }
            isLoaded++;
        }

        function addContentToDiv(id, ob) {
            $wn('#' + id).html('');
            var divAfter = '';
            var divbBefore = '';
            if (id.indexOf('rfd-tv') > -1) {
                filterSchedule(ob, 1);
                index = indexRFDTV;
                currentPositionPostOfScheduleRFDTV = index;
            } else if (id.indexOf('familynet') > -1) {
                filterSchedule(ob, 2);
                index = indexFamilyNet;
                currentPositionPostOfScheduleFamilyNet = index;
            } else {
                filterSchedule(ob, 3);
                index = indexRadio;
                currentPositionPostOfScheduleRadio = index;
            }
            for (var i = 0; i < ob.length; i++) {
                // var time = CDEVRFDTV.convertDate(ob[i].airdate);
                var time = convertToEDTTimeZone(new Date(ob[i].airdate));
                var who = ob[i].title;
                var ep = ob[i].tease;
                var subdiv = divSubContent;
                if (i < index) {
                    subdiv = subdiv.replace(/\{\?hide}/i, 'hide').replace(/\{\?when}/i, 'somethin');
                    subdiv = subdiv.replace(/\{\?time}/i, time).replace(/\{\?whoShow}/i, who).replace(/\{\?ep}/i, ep).replace(/\{\?number}/i, (i));
                    divbBefore += subdiv;
                } else {
                    if (i == index) {
                        subdiv = subdiv.replace(/\{\?hide}/i, 'on-now').replace(/\{\?when}/i, 'on now');
                    } else if (i == (index + 1)) {
                        subdiv = subdiv.replace(/\{\?hide}/i, 'up-next').replace(/\{\?when}/i, 'up next');
                    } else {
                        subdiv = subdiv.replace(/\{\?hide}/i, 'hide').replace(/\{\?when}/i, 'somethin');
                    }
                    subdiv = subdiv.replace(/\{\?time}/i, time).replace(/\{\?whoShow}/i, who).replace(/\{\?ep}/i, ep).replace(/\{\?number}/i, (i));
                    divAfter += subdiv;
                }

            }
            $wn('#' + id).append((divAfter + divbBefore));
            return;
        };

        function convertToEDTTimeZone(clientDate) {
            //EDT
            offset = -5.0;
            utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
            serverDate = new Date(utc + (3600000 * offset));
            return serverDate.toLocaleString() + ' EDT';
        };

        function detectTagsAcitve() {
            // dectec what is thing active?
            var $divAcitve = '';
            $wn('.div-schedule-content-tab').each(function () {
                var classes = $wn(this).attr('class');
                if (classes.indexOf('hide') == -1) {
                    $divAcitve = $wn(this);
                }
            });
            return $divAcitve;
        };
        // calc and set width for subDiv in schedule
        function resetWidthForSubDiv(idParent) {
            var id = detectTagsAcitve()[0].getAttribute("id");
            if (id == idParent) {
                var wParent = $wn('#' + idParent).outerWidth();
                var children = $wn('#' + idParent + ' div');
                // reset natural width
                $wn('#' + idParent + ' div').css('width', 'auto');
                var countChildShow = 1;
                var totalShow = children[0].offsetWidth + 10;
                for (var i = 1; i < children.length; i++) {
                    if (wParent - (totalShow + children[i].offsetWidth) < 50) {
                        break;
                    } else {
                        totalShow += children[i].offsetWidth;
                        countChildShow++;
                    }
                }
                childShow = countChildShow;
                // reset width for divs
                if (countChildShow > 1) {
                    var residualWidth = wParent - totalShow;
                    var parts = residualWidth / countChildShow;
                    // edit width of div show
                    for (var i = 0; i < countChildShow; i++) {
                        children[i].style.width = children[i].offsetWidth + parts + 'px';
                    }
                }
            }
        };
        // run
        getData();
        $wn('#WNHeader .wnContainerMemberSearch').css('display', 'none');

        // events
        $wn('img.img-pre-button').click(function () {
            // dectec what is thing active?
            var $divAcitve = detectTagsAcitve();
            var countChild = $divAcitve.children().length;
            var currentPositionPostOfSchedule = 0;
            if ($divAcitve.attr('id').indexOf('rfd-tv') > -1) {
                currentPositionPostOfSchedule = currentPositionPostOfScheduleRFDTV;
            } else if ($divAcitve.attr('id').indexOf('familynet') > -1) {
                currentPositionPostOfSchedule = currentPositionPostOfScheduleFamilyNet;
            } else {
                currentPositionPostOfSchedule = currentPositionPostOfScheduleRadio;
            }
            if (countChild > childShow && currentPositionPostOfSchedule > 0) {
                if ($divAcitve.attr('id').indexOf('rfd-tv') > -1) {
                    currentPositionPostOfScheduleRFDTV--;
                } else if ($divAcitve.attr('id').indexOf('familynet') > -1) {
                    currentPositionPostOfScheduleFamilyNet--;
                } else {
                    currentPositionPostOfScheduleRadio--;
                }

                $divAcitve.find('.div-sub-content:last').prependTo($divAcitve);

                resetWidthForSubDiv('div-full-schedule-rfd-tv');
                resetWidthForSubDiv('div-full-schedule-familynet');
                resetWidthForSubDiv('div-full-schedule-rural-radio');
            }

        });
        $wn('img.img-next-button').click(function () {
            // dectec what is thing active?
            var $divAcitve = detectTagsAcitve();
            var countChild = $divAcitve.children().length;
            var currentPositionPostOfSchedule = 0;
            if ($divAcitve.attr('id').indexOf('rfd-tv') > -1) {
                currentPositionPostOfSchedule = currentPositionPostOfScheduleRFDTV;
            } else if ($divAcitve.attr('id').indexOf('familynet') > -1) {
                currentPositionPostOfSchedule = currentPositionPostOfScheduleFamilyNet;
            } else {
                currentPositionPostOfSchedule = currentPositionPostOfScheduleRadio;
            }
            if (countChild > childShow && currentPositionPostOfSchedule < (countChild - childShow)) {
                if ($divAcitve.attr('id').indexOf('rfd-tv') > -1) {
                    currentPositionPostOfScheduleRFDTV++;
                } else if ($divAcitve.attr('id').indexOf('familynet') > -1) {
                    currentPositionPostOfScheduleFamilyNet++;
                } else {
                    currentPositionPostOfScheduleRadio++;
                }
                $divAcitve.append($divAcitve.find('.div-sub-content:first'));

                resetWidthForSubDiv('div-full-schedule-rfd-tv');
                resetWidthForSubDiv('div-full-schedule-familynet');
                resetWidthForSubDiv('div-full-schedule-rural-radio');

            }
        });
        // click tags
        $wn('#div-full-schedule-title > span').click(function (index) {

            $wn('#div-full-schedule-title span').removeClass('active');
            $wn('.div-schedule-content-tab').addClass('hide');
            $wn(this).addClass('active');

            if (this.id === 'rfd-tv') {
                $wn('#div-full-schedule-rfd-tv').removeClass('hide');
                addContentToDiv('div-full-schedule-rfd-tv', listScheduleRFDTV);
                resetWidthForSubDiv('div-full-schedule-rfd-tv');
                $wn('#div-full-shedule > a').attr('href', jsonUrls.schedule.RFDTVLink);
            } else if (this.id === 'family-net') {
                $wn('#div-full-schedule-familynet').removeClass('hide');
                addContentToDiv('div-full-schedule-familynet', listScheduleFamilyNet);
                resetWidthForSubDiv('div-full-schedule-familynet');
                $wn('#div-full-shedule > a').attr('href', jsonUrls.schedule.FamilyNetLink);
            } else {
                $wn('#div-full-schedule-rural-radio').removeClass('hide');
                addContentToDiv('div-full-schedule-rural-radio', listScheduleRuralRadio);
                resetWidthForSubDiv('div-full-schedule-rural-radio');
                $wn('#div-full-shedule > a').attr('href', jsonUrls.schedule.RuralRadioLink);
            }

            if (wng_pageInfo.isMobile) {
                $wn('<span></span>').prependTo($wn('.div-sub-content'));
            }

        });
    },
    ///////////////////////////////
    //
    // WEBSITE
    //
    ///////////////////////////////
    footer: function () {
        var content = 'All content © Copyright 2000 - 2016 Frankly and RFDTV. All Rights Reserved.For more information on this site, please read our' +
            ' <a href="/global/story.asp?s=18990" style="color: brown; font-weight: bold;"></a> <a style="color: brown; font-weight: bold;">Privacy Policy,</a> and ' +
            '<a href="/global/story.asp?s=18991" style="color: brown; font-weight: bold;">Terms of Service</a>, and ' +
            '<a class="adchoice" href="//www.aboutads.info/choices" target="policy" style="color: brown; font-weight: bold;">Ad Choices.</a>';
        $wn('div#csFooterBottomText').html(content);
        $wn('img.wnFooter:first').attr('src', 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/wnow_banner_black.PNG');
        // reset content of tags A
        $wn('#WNFooterLinks ul li').each(function () {
            $wn(this).html($wn(this).find('a'));
        });

        return;
    },
    ///////////////////////////////
    //
    // HOME PAGE
    //
    ///////////////////////////////
    headlineBoxCol4ID68: function () {
        //===================
        // Headline Box Col4 68
        //===================
        $wn('#DisplaySizeId68 ul li:gt(2)');
        $wn('#DisplaySizeId68 .displaySizeId-7 .summaryImage.abridged img').attr('width', 'auto');
        $wn('#DisplaySizeId68 .displaySizeId-7 .summaryImage.abridged img').css({
            'width': '100%',
            'margin-bottom': '7px'
        });
        $wn('#DisplaySizeId68 .wnContent.headline.abridged').insertAfter($wn('#DisplaySizeId68 .displaySizeId-7 .summaryImage.abridged'));
        $wn('#DisplaySizeId68 ul').append($wn('#DisplaySizeId68 a.wnContent.more.enabled').text('MORE VIDEOS'));
        $wn('#DisplaySizeId68 ul').append('<a href=" ' +
            $wn('#DisplaySizeId68 .wnContent.summaryImage.abridged a').attr('href') +
            ' "><img id="icon-player"  src = "http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png"/></a>');

        $('#DisplaySizeId68 li.feature:gt(0)').remove();

        $('#DisplaySizeId68 li.feature').find('.summaryImage.abridged').css({
            'width':'100%',
            'padding' : '0px',
            'margin-top' : '5px'
        });
        $('#DisplaySizeId68 .toggle').remove();
        $('#DisplaySizeId68 li.feature').find('.summaryImage.abridged img').css('width','100%');
        $('#DisplaySizeId68 li.feature').find('h4.headline').insertAfter($('#DisplaySizeId68 li.feature').find('.summary.abridged'));
        $('#DisplaySizeId68 li.feature').css({
            'background-color' : '#fff',
            'padding': '5px'
        });
        $('#DisplaySizeId68 > ul > li.wnItem.header > h3 > span').css('padding-left', '8px');
        return;
    },
    ///////////////////////////////
    //
    // WEBSITE
    //
    ///////////////////////////////
    brandingAndNavigation: function () {
        var isSearch = false;
        var brandingHide = '<div id="branding-hide-menu" style=" display: none; width: 100%;background: #212121;text-align: center;"></div>';
        $wn(brandingHide).prependTo('body');
        // Branding and navigation var
        // move navigation bar to Branding
        $wn('#WNBranding').append('<div id="new-area-nagivation-bar"></div>'); // create div to branding
        $wn('#new-area-nagivation-bar').append($wn('section.nav.wn-bg-page-nav')); // move menus to div
        $wn('section.nav.wn-bg-page-nav').addClass('show');
        // move search icon to navigation
        $wn('#new-area-nagivation-bar section.nav.wn-bg-page-nav.show nav ul:first').append($wn('#WNContainerMemberSearch-headertop'));
        // show search icon
        $wn('#WNContainerMemberSearch-headertop').css('display', 'block');
        // insert div-icon
        var divIcon = '<div id="searchIcon-change" style="display: block;"><img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/white_search_icon.PNG"></div>';
        //        var divSearch = '<div id="input-form-search"></div>';
        $wn('#WNSearchBox-headertop form').append(divIcon);
        //        $wn('#input-form-search').append($wn('#WNSearchBox-headertop form input.wnQueryText'));

        $wn('#searchIcon-change').click(function () {
            $wn(this).css('display', 'none');
            $wn('#WNContainerMemberSearch-headertop input[class="wnSubmit"]').css('display', 'block');
            $wn('#WNSearchBox-headertop form input.wnQueryText').css('display', 'block');
            $wn('#WNSearchBox-headertop form input.wnQueryText').focus();
        });

        $wn(document).mouseup(function (e) {
            var container = $wn("#WNContainerMemberSearch-headertop input.wnQueryText");

            if (!container.is(e.target) // if the target of the click isn't the container...
                &&
                container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                container.hide();
                $wn('#WNContainerMemberSearch-headertop input[class="wnSubmit"]').css('display', 'none');
                $wn('#searchIcon-change').css('display', 'block');
            }
        });

        $wn('#WNContainerMemberSearch-headertop input[class="wnSubmit"]').attr('value', '');

        // move ticker
        $wn('#WNHeader').append($wn('div.tickercontainer'));
        if (!wng_pageInfo.isMobile)
            $wn('#branding-hide-menu').append($wn('#WNBranding').clone().attr('id', 'WNBranding-clone'));
        // custom search button clone
        $wn('#WNBranding-clone #new-area-nagivation-bar #searchIcon-change').click(function () {
            var $input = $wn('#WNBranding-clone #new-area-nagivation-bar .wnQueryText');
            if (!isSearch) {
                $wn('#WNBranding-clone #new-area-nagivation-bar input.wnQueryText').show();
                isSearch = true;
            } else {
                var host = window.location.host;
                window.location.href = 'http://' + host + '/search?vendor=ez&qu=' + $input.val().replace(/ /g, '+');
            }
        });
        if (wng_pageInfo.isMobile) {
            $wn('#DisplaySizeId40').hide();
            $('#WNBranding').insertBefore('#WNAd105');
            $('#WNBranding').insertBefore('#WNAd106');
        }

        $wn('#WNContainerMemberSearch-headertop input.wnSubmit').css('z-index', '1000000');
        $wn(window).click(function (e) {
            if (e.target.nodeName != 'IMG' && e.target.nodeName != 'INPUT') {
                $wn('#WNContainerMemberSearch-headertop #searchIcon-change').css('display', 'block');
                isSearch = false;
            }


        });

        return;
    },
    ///////////////////////////////
    //
    // HOME PAGE
    //
    ///////////////////////////////
    headlineBoxCol4ID78: function () {
        //===================
        // Headline Box Col4 78
        var count = 1;
        $wn('#DisplaySizeId78 > ul > li.wnItem.feature:gt(0)').remove();

        $wn('#DisplaySizeId78 .wnItem.header h3 ').append('<span class="hr-span"></span>');
        $wn('#DisplaySizeId78 > ul > li.wnItem.feature').each(function (index) {
            if (index < 1) {
                $wn(this).find('.summaryImage.abridged img').attr('width', 'auto');
                $wn(this).find(' .summaryImage.abridged img').css('width', '100%');
                $wn(this).find(' .wnContent.headline:lt(0)').remove();
                $wn('#DisplaySizeId78 > ul > li.wnItem> div.wnContent.summaryImage:eq(0)').remove();
                $wn(this).find(' .wnContent.headline').insertAfter($wn(this).find('.summaryImage'));
                var text = $wn('.displaySize.displaySizeId78 .summary.abridged p').text();
                if (text.indexOf('. . . ') > -1) {
                    $wn('.displaySize.displaySizeId78 .summary.abridged p').text(text.substring(0, text.length - 6) + '..');
                }
                $wn(this).find('div.wnContent.summary').show();
            }
        });
    },
    ///////////////////////////////
    //
    // FOOTER, SCHEDULE, NAVIGATION
    //
    ///////////////////////////////
    forMobileDesign: function () {
        //===============
        // for Mobile
        //================
        if (wng_pageInfo.isMobile) {
            // insert css
            var link = document.createElement("link");
            link.href = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/custom-responsive-dua1.css';
            //link.href = 'http://localhost:8080/professionalservices/clients/rfdtv/custom-responsive-dua1.css';
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen";
            document.getElementsByTagName("head")[0].appendChild(link);
            // footer
            var content = 'All content © Copyright 2000 - 2016 Frankly and RFDTV. All Rights Reserved. For more information on this site, please read our ' +
                'Privacy Policy, and ' +
                'Terms of Service';
            $wn('#WNFooter .footerContent').html(content);
            $wn('img.wnFooter:first').attr('src', 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/footer-icon-mobile.PNG');
            // move navigation
            $wn('#WNBranding').append($wn('#WNNavSearchSwitch'));
            $wn('#WNNavSearchSwitch').css('display', 'block');
            $wn('#WNHeader').after($wn('#DisplaySizeId40'));
            // handle ticker

            // schedule
            // move icon next and pre
            $wn('#div-full-schedule-content').append($wn('.img-pre-button'));
            $wn('#div-full-schedule-content').append($wn('.img-next-button'));
            $wn('<span></span>').prependTo($wn('.div-sub-content'));

        }
    },
    ///////////////////////////////
    //
    // http://managerfdtv.managedua1.worldnow.com/story/22867419/agday
    //
    ///////////////////////////////
    styleSingleStories: function () {
        if (window.location.href.indexOf('story/22867419') > 5) {
            //when the page load is a single story, detect block story loading ready
            if ($wn('#WNContainerStory').length) {
                //create a new div
                jQuery('<div/>', {
                    'id': 'listTopics',
                    'class': 'wnColConfig4'
                }).insertBefore('#WNCols23-4');

                $.ajax({

                    url: '/category/267410/shows?clienttype=container.json',
                    success: function (xml) {
                        var features = xml.features;
                        var len = features.length;
                        var category = [];
                        for (var i = 0; i < len; i++) {
                            if (features[i].displaysize == '80') {
                                category.push(features[i]);
                            }
                        }
                        CDEVRFDTV.renderListTopics(category);
                    }

                });

                //add headline div
                jQuery('<div/>', {
                    'id': 'headlineStory',
                    'class': 'wnColConfig4'
                }).insertAfter('#listTopics');
                $wn('<h3></h3>').appendTo('#headlineStory');
                // $wn('#WNStoryHeader').hide();
                //  $wn('#headlineStory h3').text($wn('#WNStoryHeader h3').text());
                $wn('#WNDS37').prependTo("#WNCols23-4");
                $wn('#WNStoryHeader').prependTo("#WNCols23-4");
                //add abstract images div
                jQuery('<div/>', {
                    'id': 'abstractImages',
                    'class': 'wnColConfig4'
                }).insertAfter('#headlineStory');
                // body story
                if (!wng_pageInfo.isMobile)
                    $wn('#headlineStory').append($wn('#WNDS29'));
                $wn('#WNDS29 iframe').parent().css('height', '545px');
                if (wng_pageInfo.isMobile) {
                    $wn('#WNCol23Top').prependTo($wn('#WNStoryBody'));
                    $wn('#headlineStory').prependTo($wn('#WNStoryBody'));
                }
            }
        } else {
            //other single stories pages
            // $wn(window).ready(function () {
            //if have summary images
            if ($wn('#WNStoryRelatedBox').length) {
                jQuery('<div/>', {
                    'class': 'video-player'
                }).insertBefore('#WNStoryRelatedBox');
            } else { //havent summry images
                jQuery('<div/>', {
                    'class': 'video-player'
                }).insertBefore('#WNStoryBody');
            }
            //append video player after headline
            $wn('#WNDS37').prependTo('.video-player');
            //move Addthis share social
            $wn('#WNDS37 > div > div.wnDVUtilityBlock').insertBefore('#WNStoryHeader h3').css('float', 'right');
            //remove section title of this story
            $wn('#WNStoryHeader .wnSectionTitle').hide();
            // });
        }
    },

    other: function () {
        /*event page */
        if (window.location.href.indexOf('category/267414') > 4) {
            $wn('#DisplaySizeId82').hide();
            var div = '<div id="div-upcoming"><span>upcoming rfd-tv events</span><span></span></div>'
            $wn(div).prependTo($wn('#DisplaySizeId-7'));

            $wn('#DisplaySizeId-7 .wnContent.summaryImage.left').each(function () {
                $wn(this).insertBefore($wn(this).parent().find('h4:first'));
            });
        }
    },

    socialIcons: function (id) {
        if (!wng_pageInfo.isMobile) {
            var div = '<div id="col4-social-icons">' +
                '<a href="#" class="fb" target="_blank"></a>' +
                '<a href="#" class="ln" target="_blank"></a>' +
                '<a href="#" class="tw" target="_blank"></a>' +
                '<a href="#" class="rss" target="_blank"></a>' +
                '<a href="#" class="mail" target="_blank"></a>' +
                '</div>';
            // insert to page
            $wn('#' + id).append($wn(div));
            // $wn(div).append($wn('#' + id));
            var linkSocialTools = [
                'https://www.facebook.com/OfficialRFDTV', // facebook
                'https://twitter.com/officialrfdtv', // tw
                'http://www.youtube.com/user/RFDTVnetwork', // youtube
                'https://www.instagram.com/rfdtv/', // cap
                'mailto:info@rfdtv.com', // mail
            ];
            for (var i = 0; i < linkSocialTools.length; i++) {
                $wn('#col4-social-icons a:nth-of-type(' + (i + 1) + ')').attr('href', linkSocialTools[i]);
            }
        }
    },

    promoAre: function () {
        if (url.indexOf('category/267414') > 4 || url.indexOf('story/22867419') > 4 || url.indexOf('category/274535') > -1) {
            // $wn('#DisplaySizeId24').html('');
            var promoDiv = '<div style="width: 100%;">' +
                '<div id="div-prommo-box">' +
                '<div id="prommo-img">' +
                '<a href="#">' +
                '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/prommo-box.PNG" alt="" />' +
                '</a>' +
                '</div>' +
                '<div id="prommo-title"> <span>workplace best practices</span></div>' +
                '</div>' +
                '</div>';
            $wn('#DisplaySizeId24').css('display', 'block');
            $wn(promoDiv).prependTo($wn('#WNCol4'));
        }
    },
    /*================================
     * WEATHER BLOCK ON COL 4: WITH VIDEO PLAYER AND HUMAN INFO BELOW IT
     *================================*/
    col4weather: function () {
        if ($wn('body').attr('class').indexOf('home') > -1 || url.indexOf('268477/news') > -1) {
            var divW = '<div id="col4wb">' +
                '<div class="weatherBox">' +
                '<div class="headline">' +
                '<h1>Weather Forecast</h1>' +
                '<span class="hr"></span>' +
                '</div>' +
                '</div>' +
                '<div class="authorBox">' +
                '</div>' +
                '</div>';
            $wn(divW).prependTo($wn('#WNCol4'));
            $wn('#col4wb .headline').after('<div id="divWNWidgetsContainer513" style="overflow:hidden;height:169px;width:275px;">' +
                '<div id="divWNVideoCanvas513"></div> <div id="divWNGallery513"></div> </div>');

            $wn('#col4wb .headline').after('<script type="text/javascript" src="http://RFDTV.images.worldnow.com/interface/js/WNVideo.js?ver=20110628400"><\/script>');
            $wn('#col4wb .headline').after('<script type="text/javascript">var wnOnLibraryLoad = function() {if (window.removeEventListener) ' +
                '{window.removeEventListener("load", wnOnLibraryLoad , false);} else if (window.detachEvent) {window.detachEvent("onload", wnOnLibraryLoad );}; ' +
                ' WN187476();}; if (window.addEventListener) {window.addEventListener("load", wnOnLibraryLoad , false);} else if (window.attachEvent) ' +
                ' {window.attachEvent("onload", wnOnLibraryLoad );}<\/script>');

            String.prototype.replaceAll = function (find, replace) {
                var str = this;
                return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
            };

            function remove_tags(html) {
                return jQuery(html).text();
            }

            $.ajax({
                url: 'http://' + window.location.host + jsonUrls.weather
            })
                .fail(function (err) {
                    console.log(err);
                })
                .done(function (result) {
                    //var data = $.parseJSON(result);
                    var data = result;
                    renderWeatherForecast(data);
                    renderAuthorInformation(data);
                });

            var renderWeatherForecast = function (data) {
                $wn('#divWNWidgetsContainer513').hide();
                var title = data.header;
                var abstract = remove_tags(data.currentconditions);
                var url = data.weatherconditions.contenturl;
                var weatherForecastElement = '';
                var weatherForecastRaw = '<div class="videoplayer"></div>' +
                    '<div class="weatherContent">' +
                    '<a href="{*weatherURL*}"><h1>{*title*}</h1></a>' +
                    '<div class="content"><span class="abstract">{*abstract*}</span><span class="readmore"><a href="{*weatherURL*}"> Read More</a></span></div>' +
                    '</div>';
                weatherForecastElement = weatherForecastRaw
                    .replaceAll('{*weatherURL*}', url)
                    .replaceAll('{*title*}', title)
                    .replaceAll('{*abstract*}', abstract);
                $wn('.weatherBox').append(weatherForecastElement);
                $wn('#divWNWidgetsContainer513').appendTo($wn('.videoplayer'));
                $wn('#divWNWidgetsContainer513').show();
            };

            var renderAuthorInformation = function (data) {
                var author = data.byline;
                var authorName = author.firstname + " " + author.lastname;
                var authorTitle = author.title;
                var authorLink = author.link;
                var authorProfileImage = "'" + author.profileimage + "'";
                var social = author.socialnetworksinfo;
                var facebookLink = ((typeof author.socialnetworksinfo.facebook !== 'undefined') && (author.socialnetworksinfo.facebook !== '')) ? "https://www.facebook.com/" + author.socialnetworksinfo.facebook : 'null';
                var emailaddress = ((typeof author.socialnetworksinfo.emailaddress !== 'undefined') && (author.socialnetworksinfo.emailaddress !== '')) ? "mailto:" + author.socialnetworksinfo.emailaddress : 'null';
                var google = ((typeof author.socialnetworksinfo.google !== 'undefined') && (author.socialnetworksinfo.google !== '')) ? "https://plus.google.com/u/1/+" + author.socialnetworksinfo.google : 'null';
                var instagram = ((typeof author.socialnetworksinfo.instagram !== 'undefined') && (author.socialnetworksinfo.instagram !== '')) ? "https://www.instagram.com/" + author.socialnetworksinfo.instagram + "/" : 'null';
                var twitter = ((typeof author.socialnetworksinfo.twitter !== 'undefined') && (author.socialnetworksinfo.twitter !== '')) ? "https://twitter.com/" + author.socialnetworksinfo.twitter : 'null';
                var authorInformationElement = '';
                var authorInformationRaw = '<div class="wrapperWeather">' +
                    '<div class="avatar" style="background: url({*authorProfileImage*}); background-position: center center; background-size: cover;"></div>' +
                    '<div class="authorInfo">' +
                    '<span class="authorFullname"><a href="{*authorLink*}">{*authorName*}</a></span>' +
                    '<span class="authorFullTitle">{*authorTitle*}</span>' +
                    '</div>' +
                    '</div>' +
                    '<ul class="listSocial">' +
                    '<li><a href="{*facebook*}"><img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/facebook.png" /></a></li>' +
                    '<li><a href="{*twitter*}"><img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/twitter.png" /></a></li>' +
                    '<li><a href="{*emailaddress*}"><img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/email.png" /></a></li>' +
                    '<li><a href="{*google*}"><img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/google.png" /></a></li>' +
                    '<li><a href="{*instagram*}"><img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/instagram.png" /></a></li>' +
                    '</ul>';

                authorInformationElement = authorInformationRaw
                    .replaceAll('{*authorProfileImage*}', authorProfileImage)
                    .replaceAll('{*authorLink*}', authorLink)
                    .replaceAll('{*authorName*}', authorName)
                    .replaceAll('{*authorTitle*}', authorTitle)
                    .replaceAll('{*facebook*}', facebookLink)
                    .replaceAll('{*twitter*}', twitter)
                    .replaceAll('{*emailaddress*}', emailaddress)
                    .replaceAll('{*google*}', google)
                    .replaceAll('{*instagram*}', instagram);
                $wn('.authorBox').append(authorInformationElement);
                //if col4weather not in homepage, remove, white border seperate 2 parts
                if (wng_pageInfo.containerClass !== 'home') {
                    $wn('.authorBox').css('border', 'none');
                }
                $wn('.listSocial li').each(function () {
                    if (($wn(this).find('a').attr('href') === 'null') || ($wn(this).is(':empty'))) $wn(this).remove();
                });
            }
        }
    },


    /* UPDATED FOR HOMEPAGE*/
    //remove all unnecessary block
    cleanHomePage: function () {
        if (wng_pageInfo.containerClass == 'home') {
            $wn('#WNDS29').remove();
            $wn('#WNTopStoryWrap').remove();
            $wn('#DisplaySizeId80').remove();
            $wn('#DisplaySizeId7').remove();
            $wn('#WNDS-20').remove();
        }
    },
    escapeRegExp: function (str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },
    replaceAll: function (str, find, replace) {
        if ((typeof replace == 'undefined') || (replace.length == 0)) {
            return '';
        } else {
            return str.replace(new RegExp(CDEVRFDTV.escapeRegExp(find), 'g'), replace);
        }
    },
    convertDate: function (e, t, i, a) {
        return t = t || "%MMM% %DD%, %YYYY% %h%:%mm% %AMPM% %tz%",
            1 == a ? new Date(e).customFormat(t, i) : new Date(e).customFormat(t, i)
    },
    remove_tags: function (html) {
        return jQuery(html).text();
    },
    /*======================================================================================================
     *
     * SPLICES STORIES IN ARRAY WITH MATCHED DISPLAYSIZE, FROM BEGININDEX, WITH NUMBER STORIES IN DATA PARAMS
     *
     *=======================================================================================================*/
    spliceStories: function (displaySize, beginIndex, numerStories, data) {
        var dataDS = [];
        var result = [];
        //CHECK FIRST: if beginIndex param if greater than data length, return empty array now!!
        if (beginIndex > data.length - 1) {
            return result;
        }
        //loop and push all data stories matched this displaySize
        for (var i = 0; i < data.length; i++) {
            if (data[i].displaysize == displaySize) {
                dataDS.push(data[i]);
            }
        }
        //when beginIndex greater than length of data DISPLAYSIZE input. CANNOT get any result form it
        if (beginIndex > dataDS.length - 1) {
            return result;
        }
        //loop all matched data matched and get avaiable data
        for (var j = beginIndex; j < dataDS.length; j++) {
            result.push(dataDS[j]);
            //if number of result equals number user need or end of array result
            if ((result.length == numerStories) || (j == dataDS.length - 1)) {
                return result;
            }
        }
    },
    //get all topic in story in push it in a result array
    getStoryListTopics: function (story) {
        var list = [];
        if (typeof story == 'undefined') {
            return list;
        }
        if ((typeof story.topics !== 'undefined') && (story.topics.length > 0)) {
            for (var i = 0; i < story.topics.length; i++) {
                list.push(story.topics[i].value);
            }
        }
        return list;
    },
    //get headline of specific story
    getStoryHeadline: function (story) {
        return story.headline;
    },
    //get hyperlink of specific story
    getStoryLink: function (story) {
        var type = story.type;
        var storyID = story.id;
        var pageurl = story.seo.pageurl;
        return '/' + type + '/' + storyID + '/' + pageurl;
    },
    //get id of specific story
    getStoryID: function (story) {
        return story.id;
    },
    //get abstractimage of specific story
    getStoryAbtractImage: function (story) {
        //if the story is hasn't have any abtractimage, just use default images
        if ((typeof story.abstractimage == 'undefined') || (story.abstractimage.length == 0)) {
            return 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/RFDTV_thumbnail.jpg';
        } else {
            return story.abstractimage.filename;
        }
    },
    //get date of specific story
    getStoryDate: function (story) {
        var date;
        //if story has lastediteddate, mean that story has been edited
        if ((typeof story.lastEditedDate !== 'undefined') || (story.lastEditedDate.length > 0)) {
            date = 'Updated: ' + CDEVRFDTV.convertDate(story.lastEditedDate, '', false);
        } else {
            date = 'Posted: ' + CDEVRFDTV.convertDate(story.lastEditedDate, '', false);
        }
        return date;
    },
    //get abstract content of specific story
    getStoryAbstract: function (story) {
        return CDEVRFDTV.remove_tags(story.abstract);
    },
    //getStory iconClip
    getStoryIconClip: function (story) {
        var hasClip = false;
        if ((typeof story.surfaceable !== 'undefined') && (story.surfaceable[0].type == 'Clip') && (story.surfaceable[0].status == 'L')) {
            hasClip = true;
        }

        return hasClip;
    },
    //render list topics of story into html element
    rendertopicList: function (data) {
        var list = [];
        var result = '';
        if (typeof data == 'undefined') {
            return '<ul style="display: none"><li class="tag"></li></ul>';
        }
        for (var i = 0; i < data.length; i++) {
            list.push(data[i]);
        }
        var itemRaw = '<li class="tag {*topicClass*} {*display*}">{*topic*}</li>';
        var listDefaultTopics = ['rural lifestyle', 'music', 'agriculture', 'western sports', 'equine', 'news'];
        for (var j = 0; j < list.length; j++) {
            var display = 'hidden';
            var topicClass = '';
            if (listDefaultTopics.indexOf(list[j].toLowerCase()) > -1) {
                display = 'show';
                switch (list[j].toLowerCase()) {
                    case 'rural lifestyle':
                        topicClass = 'lifestyle';
                        break;
                    case 'music':
                        topicClass = 'music';
                        break;
                    case 'agriculture':
                        topicClass = 'agriculture';
                        break;
                    case 'western sports':
                        topicClass = 'sports';
                        break;
                    case 'equine':
                        topicClass = 'equine';
                        break;
                    case 'news':
                        topicClass = 'news';
                        break;
                }
            } else {
                topicClass = 'other';
            }
            var item = CDEVRFDTV.replaceAll(itemRaw, '{*topic*}', list[j]);
            var item = CDEVRFDTV.replaceAll(item, '{*topicClass*}', topicClass);
            var item = CDEVRFDTV.replaceAll(item, '{*display*}', display);
            result += item;
        }

        return '<ul>' + result + '</ul>';
    },


    /*================================
     *
     * RENDER TOP FEATURES (TOP STORIES IN HOMEPAGE) WITH 3 FIRST STORY DS = -20
     *
     *================================*/
    renderFeatureElement: function (data) {
        var mainStoryHTML = '';
        var listItemsHTML = '';

        var mainStoryRaw = '<div class="main-story">' +
            '<a href="{*storyURL*}"><div class="main-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '{*topic*}' + '<ul>{*iconPlay*}</ul>' +
            '</div></a>' +
            '<div class="main-info">' +
            '<a href="{*storyURL*}"><h1>{*headline*}</h1></a>' +
            '<span>{*abtract*}</span>' +
            '</div>' +
            '</div>';

        for (var i = 0; i < 1; i++) {
            var topics = CDEVRFDTV.getStoryListTopics(data[i]);
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var imgSrc = CDEVRFDTV.getStoryAbtractImage(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var abstract = CDEVRFDTV.getStoryAbstract(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryRaw, '{*topic*}', CDEVRFDTV.rendertopicList(topics));
            mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryHTML, '{*storyURL*}', link);
            mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryHTML, '{*imgSRC*}', imgSrc);
            mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryHTML, '{*headline*}', headline);
            mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryHTML, '{*abtract*}', abstract);

            if (hasClip) {
                mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryHTML, '{*iconPlay*}', '<img class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
            } else {
                mainStoryHTML = CDEVRFDTV.replaceAll(mainStoryHTML, '{*iconPlay*}', '<img style="display: none" class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
            }
        }

        var itemRaw = '<div class="list-story-item">' +
            '<a href="{*storyURL*}"><div class="item-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '{*topic*}' + '{*iconPlay*}' +
            '</div></a>' +
            '<div class="item-info">' +
            '<a href="{*storyURL*}"><h1>{*headline*}</h1></a>' +
            '</div>' +
            '</div>';

        for (var i = 1; i < data.length; i++) {

            var topics = CDEVRFDTV.getStoryListTopics(data[i]);
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var imgSrc = CDEVRFDTV.getStoryAbtractImage(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var abstract = CDEVRFDTV.getStoryAbstract(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            var item = itemRaw;

            item = CDEVRFDTV.replaceAll(item, '{*storyURL*}', link);
            item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgSrc);
            item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
            item = CDEVRFDTV.replaceAll(item, '{*topic*}', CDEVRFDTV.rendertopicList(topics));

            if (hasClip) {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<img class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
            } else {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<img style="display: none" class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
            }

            listItemsHTML += item;

        }

        listItemsHTML = '<div class="list-story">' + listItemsHTML + '</div>';
        $wn('.wrapper').html(mainStoryHTML + listItemsHTML);
    },
    //
    //
    // RENDER SLIDESHOW BENEATH TOP FEATURES ELEMENT BLOCK
    //
    //
    renderSlideShowElement: function (data) {
        var slideShowHTML = '';

        var slideShowRAW = '<li><div class="list-story-item">' +
            '<a href="{*storyURL*}"><div class="item-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '{*topic*}' +
            '</div></a>' +
            '<div class="item-info">' +
            '<a href="{*storyURL*}"><h1>{*headline*} {*iconPlay*}</h1></a>' +
            '</div>' +
            '</div></li>';
        for (var i = 0; i < data.length; i++) {
            var topics = CDEVRFDTV.getStoryListTopics(data[i]);
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var imgSrc = CDEVRFDTV.getStoryAbtractImage(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var abstract = CDEVRFDTV.getStoryAbstract(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            var item = slideShowRAW;

            item = CDEVRFDTV.replaceAll(slideShowRAW, '{*storyURL*}', link);
            item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgSrc);
            item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
            item = CDEVRFDTV.replaceAll(item, '{*topic*}', CDEVRFDTV.rendertopicList(topics));

            if (hasClip) {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
            } else {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
            }

            slideShowHTML += item;
        }
        $wn('.slide-list').html('<ul>' + slideShowHTML + '</ul>');
    },
    //
    //
    // RENDER LASTEST NEWS BLOCK ELEMENT
    //
    //
    renderLastestNewsElement: function (data) {

        if (typeof data == 'undefined' || data.length === 0) {
            $('#WNLastestNews').remove();
            return false;
        }

        var lasttestNewsElement = '';
        var lasttestNewsElementRaw = '<li>' +
            '<a href="{*storyURL*}"><div class="lastest-news-thumbnail title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '{*topic*}' +
            '</div></a>' +
            '<div class="lastest-news-content">' +
            '<a href="{*storyURL*}"><h1>{*headline*} {*iconPlay*}</h1></a>' +
            '<span class="date">{*date*}</span>' +
            '<span class="abstract">{*abtract*}</span>' +
            '</div>' +
            '</li>';

        for (var i = 0; i < data.length; i++) {

            var topics = CDEVRFDTV.getStoryListTopics(data[i]);
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var imgSrc = CDEVRFDTV.getStoryAbtractImage(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var abstract = CDEVRFDTV.getStoryAbstract(data[i]);
            var date = CDEVRFDTV.getStoryDate(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            var item = lasttestNewsElementRaw;

            item = CDEVRFDTV.replaceAll(lasttestNewsElementRaw, '{*storyURL*}', link);
            item = CDEVRFDTV.replaceAll(item, '{*storyURL*}', link);
            item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgSrc);
            item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
            item = CDEVRFDTV.replaceAll(item, '{*topic*}', CDEVRFDTV.rendertopicList(topics));
            item = CDEVRFDTV.replaceAll(item, '{*date*}', date);
            item = CDEVRFDTV.replaceAll(item, '{*abtract*}', abstract);

            if (hasClip) {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
            } else {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
            }

            lasttestNewsElement += item;
        }

        $wn(".lastest-news-content h1").ellipsis({
            row: 2,
            onlyFullWords: true
        });
        $wn('.lastest-news-content .abstract').ellipsis({
            row: 2,
            onlyFullWords: true
        });

        $wn('.list-lastest-news').html(lasttestNewsElement);
    },
    //
    //
    // RENDER CATEGORY NAME ELEMENT
    //
    //
    renderCategoryNews: function (data, categoryURL) {
        var featuresElement = '';
        var listSubItem = '';

        //override categoryURL
        categoryURL = 'http://www.rfdtv.com/category/267410/shows';

        var featuresElementRaw = '<div class="features">' +
            '<a href="{*storyURL*}"><div class="features-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '{*topic*}' +
            '</div></a>' +
            '<div class="features-abstract">' +
            '<a href="{*storyURL*}"><h1>{*headline*} {*iconPlay*}</h1></a>' +
            '<span class="abstract-features">{*abtract*}</span>' +
            '<a style="display: block" href="{*storyURL*}"><span class="readmore"></span></a>' +
            '</div>' +
            '</div>';

        var listSubItemRaw = '<a href="{*storyURL*}"><span class="sub-headline">{*headline*} {*iconPlay*}</span></a>'

        var btnMoreRaw = '<div class="btn-lg-more">' +
            '<a href="' + categoryURL + '"><span>More</span></a>' +
            '</div>';

        //render features story
        for (var i = 0; i < 1; i++) {
            var topics = CDEVRFDTV.getStoryListTopics(data[i]);
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var imgSrc = CDEVRFDTV.getStoryAbtractImage(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var abstract = CDEVRFDTV.getStoryAbstract(data[i]);
            var date = CDEVRFDTV.getStoryDate(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            featuresElement = CDEVRFDTV.replaceAll(featuresElementRaw, '{*storyURL*}', link);
            featuresElement = CDEVRFDTV.replaceAll(featuresElement, '{*imgSRC*}', imgSrc);
            featuresElement = CDEVRFDTV.replaceAll(featuresElement, '{*headline*}', headline);
            featuresElement = CDEVRFDTV.replaceAll(featuresElement, '{*topic*}', CDEVRFDTV.rendertopicList(topics));
            featuresElement = CDEVRFDTV.replaceAll(featuresElement, '{*abtract*}', abstract);

            if (hasClip) {
                featuresElement = CDEVRFDTV.replaceAll(featuresElement, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
            } else {
                featuresElement = CDEVRFDTV.replaceAll(featuresElement, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
            }
        }

        //render list sub items stories
        for (var i = 1; i < data.length; i++) {
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            if (Math.abs(i % 2) == 1) {
                var item = listSubItemRaw;
                item = '<li>' + CDEVRFDTV.replaceAll(listSubItemRaw, '{*storyURL*}', link);
                item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
                if (hasClip) {
                    item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
                } else {
                    item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
                }
                listSubItem += item;
            } else {
                var item = listSubItemRaw;
                item = CDEVRFDTV.replaceAll(listSubItemRaw, '{*storyURL*}', link)
                item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline) + '</li>';
                if (hasClip) {
                    item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
                } else {
                    item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
                }
                listSubItem += item;
            }
        }

        listSubItem = '<ul class="list-sub-headline">' + listSubItem + '</ul>';

        $wn('.category-name').append(featuresElement + listSubItem + btnMoreRaw);
    },
    //
    //
    // RENDER LIST LAST 8 ITEMS
    //
    //
    renderListStoriesElement: function (data) {
        var listStoriesElement = '';

        var listStoriesElementRaw = '<li>' +
            '<a href="{*storyURL*}"><div class="lastest-news-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '{*topic*}' +
            '</div></a>' +
            '<div class="lastest-news-content">' +
            '<a href="{*storyURL*}"><h1>{*headline*} {*iconPlay*}</h1></a>' +
            '<span class="date">{*date*}</span>' +
            '<span class="abstract">{*abtract*}</span>' +
            '</div>' +
            '</li>';

        var btnMoreRaw = '<div class="btn-lg-more"><a href="/category/268477/news"><span>More Stories</span></a></div>';

        for (var i = 0; i < data.length; i++) {
            var topics = CDEVRFDTV.getStoryListTopics(data[i]);
            var link = CDEVRFDTV.getStoryLink(data[i]);
            var imgSrc = CDEVRFDTV.getStoryAbtractImage(data[i]);
            var headline = CDEVRFDTV.getStoryHeadline(data[i]);
            var abstract = CDEVRFDTV.getStoryAbstract(data[i]);
            var date = CDEVRFDTV.getStoryDate(data[i]);
            var hasClip = CDEVRFDTV.getStoryIconClip(data[i]);

            var item = listStoriesElementRaw;

            item = CDEVRFDTV.replaceAll(listStoriesElementRaw, '{*storyURL*}', link);
            item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgSrc);
            item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
            item = CDEVRFDTV.replaceAll(item, '{*topic*}', CDEVRFDTV.rendertopicList(topics));
            item = CDEVRFDTV.replaceAll(item, '{*date*}', date);
            item = CDEVRFDTV.replaceAll(item, '{*abtract*}', abstract);

            if (hasClip) {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
            } else {
                item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
            }

            listStoriesElement += item;
        }
        listStoriesElement = '<ul class="list-lastest-news">' + listStoriesElement + '</ul>' + btnMoreRaw;
        $wn('.list-stories').html(listStoriesElement);
    },

    /*==================================================================================================
     *
     * BUILDING TOP FEATRUES BLOCK ON HOMEPAGE WITH FIRST 3 STORIES FOR TOP STORIES AND SLIDESHOW BELOW IT
     *
     *====================================================================================================*/
    topFeaturesBlock: function (data) {
        //this features only work on homepage
        if (wng_pageInfo.containerClass == 'home') {

            //insert comment for WNDS7
            $wn('<!--DISPLAY SIZE 20: Features Top Section-->').insertBefore('#WNDS-20');
            jQuery('<div/>', {
                'id': 'WNDS-20'
            }).insertAfter('#WNCols23-4 > div:nth-child(1)');

            //add top features block
            jQuery('<div/>', {
                'id': 'WNTopFeatures'
            }).appendTo('#WNDS-20');

            //add wrapper into Top Features Block
            jQuery('<div/>', {
                'class': 'wrapper'
            }).appendTo('#WNTopFeatures');

            //add slideshow into Top Features Block
            jQuery('<div/>', {
                'id': 'WNDS7',
                'class': 'slideshow'
            }).insertAfter('.wrapper');

            //insert comment for WNDS7
            $wn('<!--DISPLAY SIZE 7: Slideshows-->').insertBefore('#WNDS7');

            var storiesData = [];
            for (var i = 0; i < data.length; i++) {
                if ((typeof data[i].type !== 'undefined') && (data[i].type == 'story')) {
                    storiesData.push(data[i]);
                }
            }

            CDEVRFDTV.renderFeatureElement(CDEVRFDTV.spliceStories('-20', 0, 3, storiesData));

            //reset storiesData for make new slideshow block
            var storiesData = [];

            for (var i = 0; i < data.length; i++) {
                if ((data[i].type == 'category') && (data[i].displaysize == '7')) {
                    var slideshowURL = data[i].link;
                    for (var j = 0; j < data[i].nested.features.length; j++) {
                        storiesData.push(data[i].nested.features[j]);
                    }
                }
            }

            var headline = '<div class="headline">' +
                '<h1>slideshows</h1>' +
                '<a href="' + slideshowURL + '"><span class="btn btn-more">More</span></a>' +
                '</div>';
            $wn('.slideshow').append(headline);

            //add slide into Top Features Block
            jQuery('<div/>', {
                'class': 'slide-list'
            }).insertAfter('#WNTopFeatures .headline');

            CDEVRFDTV.renderSlideShowElement(CDEVRFDTV.spliceStories('-20', 0, 5, storiesData));

            //ellipsis headline
            $wn(".main-info h1").ellipsis({
                row: 2,
                onlyFullWords: true
            });
            //ellipsis abstract
            $wn(".main-info span").ellipsis({
                row: 2,
                onlyFullWords: true
            });
            //ellipsis headline of items
            $wn('.item-info h1').ellipsis({
                row: 2,
                onlyFullWords: true
            });
        }
    },
    ///////////////////////////////
    //
    // BUILD LASTEST NEWS BLOCK
    //
    ///////////////////////////////
    lastestNewsBlock: function (data, id, begin, end) {

        //add lastest news block
        jQuery('<div/>', {
            'id': 'WNLastestNews',
            'class': 'lastest-news'
        }).insertBefore('#WNCol23Top');

        //add skeleteon raw structure
        var headline = '<div class="headline">' +
            '<h1>Latest News</h1>' +
            '</div>' +
            '<ul class="list-lastest-news">' +
            '</ul>';
        $('.lastest-news').append(headline);

        var storiesData = [];

        if (wng_pageInfo.isMobile) {
            $wn('#WNLastestNews').insertAfter('#WNDS-20');
        }

        var storiesData = [];

        for (var i = 0; i < data.length; i++) {
            if ((typeof data[i].type !== 'undefined') && (data[i].type == 'story')) {
                storiesData.push(data[i]);
            }
        }

        if (wng_pageInfo.permaLink == "/category/274535/western-sports") {
            $('#WNLastestNews').insertAfter('#WNCol2 #WNDS-20');
        }

        CDEVRFDTV.renderLastestNewsElement(CDEVRFDTV.spliceStories(id, begin, end, storiesData));


    },
    ///////////////////////////////
    //
    // BUILD CATEGORY NAME BLOCK
    //
    ///////////////////////////////
    categoryNameBlock: function (data) {
        if (wng_pageInfo.containerClass == 'home') {

            for (var i = 0; i < data.length; i++) {
                if ((data[i].type == 'category') && (data[i].displaysize == '80')) {

                    storiesData = [];
                    var categoryHeadline = data[i].headline;
                    var categoryURL = data[i].link;

                    for (var j = 0; j < data[i].nested.features.length; j++) {
                        storiesData.push(data[i].nested.features[j]);
                    }

                    //add lastest news block
                    jQuery('<div/>', {
                        'id': 'WNDS80',
                        'class': 'category-name'
                    }).insertAfter('.lastest-news');

                    //append headline
                    $wn('.category-name').append('<div class="headline">' +
                        '<h1>' + categoryHeadline + '</h1>' +
                        '<span class="seperator"></span>' +
                        '</div>');

                    CDEVRFDTV.renderCategoryNews(CDEVRFDTV.spliceStories('-20', 0, 5, storiesData), categoryURL);
                }
            }
            //insert comment into lastest news block
            $wn('<!--DISPLAY SIZE 80: Latest News-->').insertBefore('#WNDS80');

            $wn(".abstract-features").ellipsis({
                row: 4,
                onlyFullWords: true
            });
            $wn('.list-sub-headline li a span').ellipsis({
                row: 2,
                onlyFullWords: true
            });
        }
    },
    ///////////////////////////////
    //
    // BUILD LIST LAST 8 STORIES
    //
    ///////////////////////////////
    list8storiesBlock: function (data) {

        //add lastest news block
        jQuery('<div/>', {
            'id': 'WNListStories',
            'class': 'list-stories'
        }).insertAfter('.category-name');


        var storiesData = [];

        for (var i = 0; i < data.length; i++) {
            if ((typeof data[i].type !== 'undefined') && (data[i].type == 'story')) {
                storiesData.push(data[i]);
            }
        }

        CDEVRFDTV.renderListStoriesElement(CDEVRFDTV.spliceStories('-20', 6, 8, storiesData));

        $wn(".lastest-news-content h1").ellipsis({
            row: 2,
            onlyFullWords: true
        });
        $wn('.abstract').ellipsis({
            row: 3,
            onlyFullWords: true
        });

    },
    ///////////////////////////////
    //
    // BUILD LIST HIGHLIGHT
    //
    ///////////////////////////////
    slideshowHighlightBlock: function () {
        // if ((wng_pageInfo.containerClass == 'category') || (wng_pageInfo.containerClass == 'weather') || ( wng_pageInfo.containerClass == "story")) {

        //if no already exist DS7, cannot display this
        if (!$wn('#DisplaySizeId7').length || wng_pageInfo.contentClassification == "Homepage") {
            return false;
        }
        //if category is landing page, do not render this hightlight block
        // if (window.location.href.indexOf('category/267410') > 5) {
        //     return true;
        // }

        //get all element for older DS7
        var slideShowHTML = '';
        var slideShowRAW = '<li><div class="list-story-item">' +
            '<a href="{*storyURL*}"><div class="item-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
            '</div></a>' +
            '<div class="item-info">' +
            '<a href="{*storyURL*}"><h1>{*headline*}</h1></a>' +
            '</div>' +
            '</div></li>';

        var slideshowHeadline = $wn('#DisplaySizeId7 li.header h3 > span').first().text();
        var moreBtnLink = $wn('#DisplaySizeId7  li.header a.more').first().attr('href');

        $wn('#DisplaySizeId7 ul:first-child li.feature').each(function (index) {
            if (index == 5) return false; //if number of element is greater than 5
            var headline = $wn(this).find('h4.headline.abridged').text();
            var link = $wn(this).find('h4.headline.abridged > a').attr('href');
            if (typeof $wn(this).find('.summaryImage.abridged a img').attr('data-path') === 'undefined') {
                var imgURL = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/RFDTV_thumbnail.jpg';
            } else {
                var imgURL = $wn(this).find('.summaryImage.abridged a img').attr('data-path');
            }

            var item = slideShowRAW;

            item = CDEVRFDTV.replaceAll(slideShowRAW, '{*storyURL*}', link);
            item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgURL);
            item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
            slideShowHTML += item;
        });

        $wn('#DisplaySizeId7').remove();
        //create Headlinebox Col2A
        jQuery('<div/>', {
            'id': 'DisplaySizeId7',
            'class': 'wnBlock displaySize displaySizeId7'
        }).insertBefore('#WNFooter');
        $wn('<!--Start of Display Size: Headline Box - Col 2B (7)-->').insertBefore('#DisplaySizeId7');
        $wn('<!--End of Display Size: Headline Box - Col 2B (7)-->').insertAfter('#DisplaySizeId7');

        //add slideshow into Top Features Block
        jQuery('<div/>', {
            'id': 'WNSlideshow'
        }).appendTo('#DisplaySizeId7');

        jQuery('<div/>', {
            'id': 'WNSlideshowAlignment'
        }).appendTo('#WNSlideshow');

        jQuery('<div/>', {
            'class': 'slideshow'
        }).appendTo('#WNSlideshowAlignment');

        //if the current page is agday or events, More button is not has >>
        if ((url.indexOf('story/22867419') > -1) || (url.indexOf('category/267414') > -1) ||
            (url.indexOf('category/274535') > -1)) {
            var headline = '<div class="headline">' +
                '<h1>' + slideshowHeadline + '</h1>' +
                '<a href="' + moreBtnLink + '"><span class="btn btn-more">More</span></a>' +
                '</div>';
        } else {
            var headline = '<div class="headline">' +
                '<h1>' + slideshowHeadline + '</h1>' +
                '<a href="' + moreBtnLink + '"><span class="btn btn-more">More >></span></a>' +
                '</div>';
        }
        $wn('.slideshow').append(headline);

        //add slide into Top Features Block
        jQuery('<div/>', {
            'class': 'slide-list'
        }).insertAfter('#WNSlideshow .headline');

        $wn('#WNSlideshow .slide-list').html('<ul>' + slideShowHTML + '</ul>');

        $wn('#DisplaySizeId7 .slide-list h1').ellipsis({
            row: 2,
            onlyFullWords: true
        });

        // }
        $wn('#DisplaySizeId7').prependTo('#WNFooter');
        $wn('#WNFooter #DisplaySizeId7').css('margin-bottom', '0px');

        if ((wng_pageInfo.contentClassification == 'News') || (wng_pageInfo.contentClassification == 'Weather')) {
            $wn('#DisplaySizeId7 .headline').css('border', 'none');
            $wn('#WNSlideshowAlignment > div > div.headline > a').css({
                'position': 'absolute',
                'right': '0px',
                'bottom': '15px',
                'width': '120px'
            });
            $wn('#WNSlideshowAlignment .slideshow').css('height', '255px');
        }
        if (wng_pageInfo.containerType == 'S') {
            $wn('#WNSlideshowAlignment > div > div.headline > a').css('bottom', '222px');
        }
    },
    //
    //RENDER LIST TOPICS
    //
    renderListTopics: function (data) {
        var isShow = false;
        var listTopics = '';
        var listElement = '';
        var listHTMLRAW = '<a item ="{*order*}" class="{*active*}" ><li class=\"topic-item\"  >{*headline*}</li></a>';
        var len = data.length;
        for (var i = 0; i < len; i++) {
            var active = i == 0 ? 'active' : '';

            item = CDEVRFDTV.replaceAll(listHTMLRAW, '{*order*}', data[i].displayorder);
            item = CDEVRFDTV.replaceAll(item, '{*headline*}', data[i].headline);
            item = item.replace(/\{\*active\*}/i, active);
            listElement += item;
        }
        listTopics = '<ul class=\"list-topic\">' + listElement + '</ul>';
        $wn('#listTopics').append(listTopics);
        if (wng_pageInfo.isMobile) {
            $wn('#listTopics').append("<div id='list-topic-hambeger'><span></span><span></span><span></span></div>");

            //when click expand harmburger
            // click ham menu
            $wn('#list-topic-hambeger').click(function () {
                if (!isShow) { /* show  */
                    $wn('.list-topic a').css('display', 'table-row');
                    $wn('#listTopics').css('height', '280px');
                    isShow = !isShow;
                } else { /* hide */
                    $wn('.list-topic a').not('.active').css('display', 'none');
                    $wn('#listTopics').css('height', '40px');
                    isShow = !isShow;
                }
            });
            //when choose a topic
            $wn('.list-topic a').click(function () {
                if ($wn(this).attr('class').indexOf('active') == -1) {
                    isShow = !isShow;
                    $wn('.list-topic a').each(function () {
                        $wn(this).hide();
                        $wn(this).removeClass('active');
                    })
                    //hide all and display for only
                    $wn('#listTopics').css('height', '40px');
                    $wn(this).css('display', 'table-cell');
                    $wn(this).addClass('active');
                }
            });
        }
    },
    /* ====================
     * weather page not col4
     * ==================== */

    weatherPage: function () {

        var left = 0;
        var right = 7;
        // check page's url to view weatherpage
        if (url.indexOf('/weather') > -1) {

            // insert weatherForecastPage structure into site
            $wn(weatherForecastPage).prependTo($wn('#WNCol23'));
            // video weather

            var weatherForecast = '<div id="weather-forecast">' +
                '<div id="weather-forecast-detail">' +
                '<h4>WEATHER FORECAST</h4>' +
                '<span class="current"></span>' +
                '<div class="details">' +
                '<ul>' +
                '<li><span>Temperature</span><span></span></li>' +
                '<li><span>Feels Like </span><span></span></li>' +
                '<li><span>Humidity </span><span></span></li>' +
                '<li><span>Pressure</span><span></span></li>' +
                '<li><span>Wind</span><span></span></li>' +
                '<li><span>Precip</span><span></span></li>' +
                '</ul>' +
                '<div id="img-weather"><div><img src=""><span></span></div></div>' +
                '</div>' +
                '<div class="zipcode-search">' +
                '<input type="text" placeholder="Enter Zip Code">' +
                '<input type="button" value="Search">' +
                '</div>' +
                '</div>' +
                '<div id="weather-forecast-video">'

            '</div>' +
                '<div style="clear: both;"></div>' +
                '</div>';

            $wn('#currentConditions').append(weatherForecast);
            $wn('<div style="clear: both;"></div>').insertAfter('#weather-forecast-video')
            $wn('#weather-forecast').prependTo($wn('#WNCols23-4'));
            $wn('#weather-forecast-video').append('<div id="divWNWidgetsContainer673" style="overflow:hidden;height:290px;width:520px;"> <div id="divWNVideoCanvas673"></div> </div>' +
                '<div id="divWNVideoCanvas673"></div> <div id="divWNGallery673"></div> </div>');

            $wn('#weather-forecast-video').append('<script type="text/javascript" src="http://RFDTV.images.worldnow.com/interface/js/WNVideo.js?ver=20110628400"><\/script>');
            $wn('#weather-forecast-video').append('<script type="text/javascript">var wnOnLibraryLoad = function() {if (window.removeEventListener) {window.removeEventListener("load", wnOnLibraryLoad , false);} else if (window.detachEvent) {window.detachEvent("onload", wnOnLibraryLoad );}; WN188924();}; if (window.addEventListener) {window.addEventListener("load", wnOnLibraryLoad , false);} else if (window.attachEvent) {window.attachEvent("onload", wnOnLibraryLoad );}<\/script>');

            if (typeof wnWxWSIinfo === 'undefined' || wnWxWSIinfo === null) {
                var wnWxWSIinfo = {};
            }
            // set video
            // $wn('#weather-forecast-video').append("<script type='text/javascript' src='http://api.worldnow.com/feed/v2.0/widgets/188924?alt=js&contextaffiliate=1184'></script>");
            url = url.indexOf('?clienttype=smartdevice') > -1 ? url.replace('?clienttype=smartdevice', '') : url; // use check mobile on desktop
            // get the weather information from producer
            $.ajax(url + jsonUrls.weatherPage.info)
                .done(function (data) {
                    wnWxWSIinfo.wnInfo = {};
                    wnWxWSIinfo.wnInfo.header = data.header;
                    wnWxWSIinfo.wnInfo.currentconditions = data.currentconditions;
                    wnWxWSIinfo.wnInfo.byline = data.byline;
                    wnWxWSIinfo.wnInfo.lastupdatedate = data.lastupdatedate;
                    // mock data
                    getData(jsonUrls.weatherPage.defaultZipCode);
                    addEvvents();
                    // createADBox('#WNCol4', 'WNAD131',  300, 250);
                })
                .fail(function (data) {
                    console.log('error');
                    //alert( "error" );
                })
                .always(function (data) {

                });

        }
        /**
         * count items show on page of Hourly Daily
         * @return {[type]} [description]
         */
        function countItemHourlyShow() {
            $wn('ul.hourly-rail li').show();// reset items
            /* when button cancel click -> hide  */
            $wn("#hourlyForecast span:first").hide();
            $wn("#hourlyForecast span:last").show();
            var numberItems = Math.floor($wn('ul.hourly-rail').width() / 72); // 72 is width one item.
            left = 0;
            right = numberItems - 1;
            var realW = 72 + ($wn('ul.hourly-rail').width() - 72 * numberItems) / numberItems;
            $wn('ul.hourly-rail li').css('width', (realW).toString());
        }
        // some events for the weather page
        function addEvvents() {
            /* when button cancel click -> hide  */
            $wn("#hourlyForecast span:first").hide();
            // search weather follows zipcode
            $wn('div#weather-forecast .zipcode-search input[type="button"]').click(function () {
                var zip = $wn('div#weather-forecast .zipcode-search input[type="text"]').val();
                if (zip.length != 5 || Number(zip).toString() == 'NaN') {
                    alert('Please enter 5-digit zip code.');
                    return;
                }
                getData(zip);
            });
            /* next and back */
            $wn("#hourlyForecast span:last").click(function () {
                var len = $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li').length;

                if ((len - 1) > right) {
                    left++;
                    right++;
                    $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li').show();
                    $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li:lt(' + left + ')').hide();
                    $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li:gt(' + right + ')').hide();
                    $wn("#hourlyForecast span:first").show();
                    if ((len - 1) == right)
                        $wn(this).hide();
                } else {
                    $wn(this).hide();
                }
            });
            $wn("#hourlyForecast span:first").click(function () {
                var len = $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li').length;
                if (left > 0) {
                    left--;
                    right--;
                    $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li').show();
                    $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li:lt(' + left + ')').hide();
                    $wn('.hourly-forecast-wrapper.clearfix ul.hourly-rail li:gt(' + right + ')').hide();
                    $wn("#hourlyForecast span:last").show();
                    if (left == 0)
                        $wn(this).hide();
                } else {
                    $wn(this).hide();
                }
            });
            $wn('div#weather-forecast-detail .zipcode-search input[type="text"]').keypress(function (e) {
                var key = e.which;
                if (key == 13) // the enter key code
                {
                    $wn('div#weather-forecast .zipcode-search input[type="button"]').click();
                    return false;
                }
            });
            // event landscape for mobile
            window.addEventListener("orientationchange", function () {
                var deg = screen.orientation.angle;
                setTimeout(function () { /// delay for browswer do something, I don't know what happen into to the broswer, but if not have setTimeout, it runs not true.

                    if (deg == 90) { // landscape
                        $wn('.daily-forecast-wrapper.clearfix ul li:nth-child(2) span:nth-child(1)').css('width', '124px');
                        countItemHourlyShow();
                    } else {
                        $wn('.daily-forecast-wrapper.clearfix ul li:nth-child(2) span:nth-child(1)').css('width', '108px');
                        countItemHourlyShow();
                    }
                }, 500);

            });

        }
        // call api get data
        function getData(zipcode) {
            $.ajax({
                url: jsonUrls.weatherPage.data + zipcode,
                success: function (response) {
                    var isError = response.getElementsByTagName('Error');
                    // get all information
                    var $city = $wn(response).find('City')[0];
                    $city = $wn($city);
                    if (isError.length == 0) { // right
                        var $cO = $city.find('CurrentObservation');
                        var $dF = $city.find('DailyForecast').find('Day:lt(7)');
                        var $hF = $city.find('HourlyForecast').find('Hour:lt(21)');
                        var $tF = $city.find('DailyForecast').find('Day:eq(0)');
                        var $cH = $city.find('HourlyForecast').find('Hour:eq(0)');
                        var cityName = $city.attr('Name');

                        var phrase = ($tF.attr('PhraseDay').length > 1) ? $tF.attr('PhraseDay') : $tF.attr('PhraseNight');
                        // change title
                        $wn('#weather-forecast span.current').text('Currently in ' + cityName);
                        // change details
                        changeDetails($cO, $tF);
                        // show MeterologistForecast
                        showMeterologistForecast(cityName, wnWxWSIinfo, phrase);
                        // show hourly
                        showHourlyForecast($hF);
                        // show daily
                        showDailyForecast($dF);
                        $wn('#WNAffRFDTV #WNColsAll .wnDSContainer-standard').remove();
                        $wn('#DisplaySizeId29').remove();


                    } else { // not found the city
                        alert('No cities found.');
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        // apply the weather information
        function changeDetails($cO, $tF) {
            var temperature = $cO.attr('TempF');
            var wind = $cO.attr('WndSpdMph');
            var humidity = $cO.attr('RelHumidity');
            var feelslike = $cO.attr('FeelsLikeF');
            var precip = $tF.attr('PrecipChance');
            var pressure = $cO.attr('Pressure');
            var img = $cO.attr('IconCode');
            var sky = $cO.attr('Sky');
            $wn('#weather-forecast #weather-forecast-detail .details ul li:first span:last').text(temperature + '');
            $wn('#weather-forecast #weather-forecast-detail .details ul li:nth-of-type(2) span:last').text(feelslike + '');
            $wn('#weather-forecast #weather-forecast-detail .details ul li:nth-of-type(3) span:last').text(humidity + '%');
            $wn('#weather-forecast #weather-forecast-detail .details ul li:nth-of-type(4) span:last').text(pressure);
            $wn('#weather-forecast #weather-forecast-detail .details ul li:nth-of-type(5) span:last').text(wind + 'mph');
            $wn('#weather-forecast #weather-forecast-detail .details ul li:nth-of-type(6) span:last').text(precip + ' in.');
            var src = 'http://ftpcontent.worldnow.com/wncustom/wx_icons/wsi50/' + img + '.png';
            $wn('#weather-forecast #weather-forecast-detail .details #img-weather img').attr('src', src);
            $wn('#weather-forecast #weather-forecast-detail .details #img-weather span').text(sky);

            $wn('#weather-forecast-detail > div.details > ul > li:nth-child(1) > span:nth-child(2)').append('&deg;');
            $wn('#weather-forecast-detail > div.details > ul > li:nth-child(2) > span:nth-child(2)').append('&deg;');
        }
        // show meterologistForecast
        function showMeterologistForecast(cityName, meterologistForecast, phrase) {
            var meterologistForecast = '';
            if (cityName.toLowerCase() === 'nashville') {
                meterologistForecast += '<div class="todays-forecast clearfix">';

                meterologistForecast += '<div class="info">';
                meterologistForecast += '<h3>FORECAST: ' + wnWxWSIinfo.wnInfo.header + '</h3>';
                meterologistForecast += '<h5>LAST UPDATED: ' + moment(wnWxWSIinfo.wnInfo.lastupdatedate).format('h:mmA, MMMM D, YYYY ') + '</h5>';
                meterologistForecast += wnWxWSIinfo.wnInfo.currentconditions;
                meterologistForecast += '</div>';
                meterologistForecast += '</div>';

                meterologistForecast += '<div class="bylines">';
                meterologistForecast += '<img class="profile-image" src="' + wnWxWSIinfo.wnInfo.byline.profileimage + '">';
                meterologistForecast += '<div class="profile-name">' + wnWxWSIinfo.wnInfo.byline.firstname + ' ' + wnWxWSIinfo.wnInfo.byline.lastname + '</div>';
                meterologistForecast += '<div class="profile-title">' + wnWxWSIinfo.wnInfo.byline.title + '</div>';
                meterologistForecast += '<div class="contact-info">';

                meterologistForecast += '<a class="fb" href="http://www.facebook.com/' + wnWxWSIinfo.wnInfo.byline.socialnetworksinfo.facebook + '" target="_blank">' +
                    '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/facebook.png"></a>' +
                    '<a class="twitter" href="http://www.twitter.com/' + wnWxWSIinfo.wnInfo.byline.socialnetworksinfo.twitter + '" target="_blank">' +
                    '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/twitter.png"></a>' +
                    '<a class="email" href="mailto:' + wnWxWSIinfo.wnInfo.byline.emailaddress + '" target="_blank">' +
                    '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/email.png"></a></div>';
                meterologistForecast += '</div>';
            } else {
                meterologistForecast += '<div class="todays-forecast clearfix"><h3>TODAY\'S FORECAST</h3>' + phrase + '</div></div>';
            }
            $wn('#meterologistForecast').html(meterologistForecast);
            $wn('#meterologistForecast').append('<div style="clear:both;" ></div>');
        }
        // show hourly Forecast
        function showHourlyForecast(hourlyList) {
            if (hourlyList.length > 0) {
                var len = hourlyList.length;
                var hourlyDiv = '';
                for (var i = 0; i < len; i++) {
                    var $hour = $wn(hourlyList[i]);
                    var d = new Date($hour.attr('ValidDateLocal')),
                        dd,
                        firstClass = '';
                    if (i === 0) {
                        firstClass = 'active';
                    }

                    d = d.toLocaleTimeString();
                    dd = d.replace(/[0-9]/g, '').replace(/:/g, '').replace(/ /g, '');
                    d = d.split(":")[0];
                    dd = dd.substring(0, 2);
                    d = d + ' ' + dd;
                    d = i == 0 ? "NOW" : d;
                    hourlyDiv += '<li id="hourly-' + (i + 1) + '" class="hourly ' + firstClass + ' clearfix" data-hournum="' + $hour.attr('HourNum') + '">';
                    hourlyDiv += '<div class="time">' + d + '</div>';
                    hourlyDiv += '<div class="precip-chance">' + $hour.attr('PrecipChance') + '&#37;</div>';
                    hourlyDiv += '<div class="wx-icon" ><img style="width:25px;" src="http://ftpcontent.worldnow.com/wncustom/wx_icons/wsi40/' +
                        $hour.attr('IconCode') + '.png' + '"></div>';
                    hourlyDiv += '<div class="temperature">' + $hour.attr('TempF') + '&deg;</div>';
                    hourlyDiv += '<div class="wind-speed clearfix">' + $hour.attr('WndDirCardinal') + '&nbsp;' + $hour.attr('WndSpdMph') + ' mph</div>';
                    hourlyDiv += '</li>';
                }
                $wn('#hourlyForecast .hourly-rail').html(hourlyDiv);
                countItemHourlyShow();
            }

        }
        // show daily Forecast
        function showDailyForecast(dailyList) {
            if (dailyList.length > 0) {
                var len = dailyList.length;
                var liList = '';
                // create title
                liList = '<li><span>Date</span><span>Outlook</span><span>Hight</span><span>Low</span><span>Chance of Precip</span></li>';
                for (var i = 0; i < len; i++) {
                    var $day = $wn(dailyList[i]);
                    var ValidDateUtc = $day.attr('ValidDateUtc');
                    var month = ValidDateUtc.substring(0, ValidDateUtc.indexOf('/'));
                    ValidDateUtc = ValidDateUtc.substring(ValidDateUtc.indexOf('/') + 1, ValidDateUtc.length);
                    var day = ValidDateUtc.substring(0, ValidDateUtc.indexOf('/'));
                    var date = month + '/' + day;
                    var DayOfWk = $day.attr('DayOfWk');
                    DayOfWk = i == 0 ? 'Today' : DayOfWk.substring(0, 3) + ' ' + date;
                    var HiTempF = $day.attr('HiTempF');
                    var LoTempF = $day.attr('LoTempF');
                    var IconCode = $day.attr('IconCode');
                    var PrecipChance = $day.attr('PrecipChance');

                    liList += '<li>';
                    if (wng_pageInfo.isMobile && i == 0) {
                        if (screen.orientation.angle == 90)// landscape
                            liList += '<span style="width: 124px;">' + DayOfWk + '</span>';
                        else // portrait
                            liList += '<span style="width: 108px;">' + DayOfWk + '</span>';
                    }
                    else
                        liList += '<span>' + DayOfWk + '</span>';
                    liList += '<span style="background-size: contain !important;background: url(http://ftpcontent.worldnow.com/wncustom/wx_icons/wsi50/' + IconCode + '.png) white center no-repeat;" ></span>';
                    liList += '<span>' + HiTempF + '&deg;' + '</span>';
                    liList += '<span>' + LoTempF + '&deg;' + '</span>';
                    liList += '<span>' + PrecipChance + '%</span>';
                    liList += '</li>';
                }
                $wn('#dailyForecast .daily-rail').html(liList);
            }
        }

        // AD box
        function createADBox(parent, id, width, height) {
            var ad = '<div id=" ' + id + ' " style = "background: #d6ffd7;width: ' + width + 'px; height: ' + height + 'px;"></div>';
            $wn(parent).append(ad);
        }
    },

    //==============
    //===== Weather page Col4
    /* set CSS because in the home page need different css and this page need different CSS on one div HTML tags */
    redesignWeartherNewOrBlogAndMeetTheTeam: function () {
        $wn('.wnDVWxFullForecast.wnWxHorizontal.wnDSContainer-standard').addClass('weather-override');

        $wn('div#DisplaySizeId7').addClass('weather-override');

        $wn('#WNAffRFDTV #WNColsAll #WNCol4').addClass('weather-override');

        /* weather new/blog at id div#DisplaySizeId68 */
        $wn('div#DisplaySizeId68 span.text.abridgedHeadline').text('WEATHER NEWS/BLOG'); // change title
        $wn('div#DisplaySizeId68 a.wnContent.more.enabled').hide(); // hide MORE button
        $wn('div#DisplaySizeId68 .timestamps.wnDate').hide(); // hide updated time if has
        // move image up header
        $wn('div#DisplaySizeId68 .wnContent.summaryImage.abridged.left.width115').each(function () {
            $wn(this).insertBefore($wn(this).parent().find('h4.wnContent.headline.abridged'));
        });
        $wn('div#DisplaySizeId68').addClass('weather-override');
        /* title */
        $wn('div#DisplaySizeId68 .header').addClass('weather-override');
        $wn('.displaySize.displaySizeId68 .header .text').addClass('weather-override');
        // li
        $wn('.displaySize.displaySizeId68 .feature').addClass('weather-override');
        // image
        $wn('.displaySize.displaySizeId68 .summaryImage.width115 img').addClass('weather-override');
        $wn('.displaySize .displaySizeId-7 .summaryImage.abridged').addClass('weather-override');
        $wn('#DisplaySizeId68 h4.wnContent.headline.abridged').addClass('weather-override');
        $wn('.displaySize.displaySizeId68 .headline .text').addClass('weather-override');
        $wn('.wnItem.toggle').addClass('weather-override');

        /* meet the team */
        CDEVRFDTV.meetTheTeam();
    },
    meetTheTeam: function () {


        //render RAW before fe-format it again to MEET THE TEAM Section
        //before sometimes it cannot render fully list

        $.ajax({
            url: location.href + '?clienttype=container.json'
        })
        .fail(function (err) {
            console.log(err);
        })
        .done(function (data) {
            var meetheteamCategory = CDEVRFDTV.spliceStories('78', 0, 1, data.features);
            var person = [];
            for (var i = 0; i < meetheteamCategory[0].nested.features.length; i++) {
                person.push(meetheteamCategory[0].nested.features[i]);
            }

            $wn('#DisplaySizeId78 ul.contentGroup li.feature').remove();

            var personListElement = '';

            for (var j = 0; j < person.length; j++) {
                if (typeof person[j].abridged.abstractimage == 'undefined') {
                    var thumbnail = '';
                } else {
                    var thumbnail = person[j].abridged.abstractimage.filename;
                }

                var personRAW = '<li class="wnItem feature General001 story priority-1 odd displaySizeId-7 odd-7"><meta content="General001"><meta content="2016-02-03 18:32:24"><h4 class="wnContent headline"><a href="' + person[j].link + '"><span class="text">' + person[j].headline + '</span></a></h4><h4 class="wnContent headline abridged"><a href="' + person[j].link + '"><span class="text">' + person[j].headline + '</span></a></h4><div class="wnContent summaryImage left width90"><a href="' + person[j].link + '"><img border="0" width="90" data-path="' + thumbnail + '" title="' + person[j].headline + '" alt="' + person[j].headline + '"></a><span class="caption left width90"><span class="text">' + person[j].headline + '</span></span></div><div class="wnContent summaryImage abridged left width115"><a href="' + person[j].link + '"><img border="0" width="115" data-path="' + thumbnail + '" class="" src="' + thumbnail + '" style="display: block;"></a></div><div class="wnContent summary abridged"><span class="text">' + person[j].abstract + '</span></div><div class="wnContent summary"><span class="text">' + person[j].abstract + '</span></div><div class="wnClear"></div></li>';

                personListElement += personRAW;
            }

            $wn(personListElement).insertAfter('#DisplaySizeId78 > ul > li.wnItem.advertisement');


            //BEGIN RENDER MEET THE TEAM SLIDER
            var currentPositionTeam = 0;
            /* meet the team */
            // get social
            $wn('.displaySize.displaySizeId78 .headline').show();
            $wn('#DisplaySizeId78 h4.wnContent.headline.abridged').hide();

            $wn('<div>MEET THE TEAM</div>').prependTo($wn('#DisplaySizeId78'));
            $wn('div#DisplaySizeId78  .timestamps.wnDate').hide();
            // move image up header
            $wn('div#DisplaySizeId78 ul.wnGroup.contentGroup li.feature').each(function (index) {
                $wn(this).find('.headline:gt(0)').remove();
                $wn(this).find('.headline').show();
                $wn(this).find('.summaryImage').hide();
                // if ($wn(this).find('.summaryImage.abridged').length > 0) {
                //     var datapath = $wn(this).find('.summaryImage.abridged img ').attr('data-path');
                //     if (typeof datapath != 'undefined' && datapath.length > 0)
                //         $wn(this).find('.summaryImage.abridged img ').attr('src', $wn(this).find('.summaryImage.abridged img ').attr('data-path'));
                //     $wn(this).find('.summaryImage.abridged').insertBefore($wn(this).find('.headline:first'));
                // }
                // else if ($wn(this).find('.summaryImage').length > 0) {
                //     var datapath = $wn(this).find('.summaryImage img ').attr('data-path');
                //     if (typeof datapath != 'undefined' && datapath.length > 0)
                //         var href = $wn(this).find('.summaryImage a ').attr('href');
                //     $wn('<a href="' + href + '"><div class="wnContent summaryImage abridged left width115" ' +
                //         ' style="background: url(' + datapath + ') center center no-repeat #e7e8e8; background-size: contain; background-color: black;" ></div></a>').insertBefore($wn(this).find(' .headline:first'));
                // }
                // else
                // $wn('<div class="wnContent summaryImage abridged left width115" ' +
                //       ' style="background: url(' + weatherDummy + ') center center no-repeat #e7e8e8;" ></div>').insertBefore($wn(this).find(' .headline:first'));
                // headline
                var text = $wn(this).find('.headline:first a').text();
                if (text.indexOf(',') > -1) {
                    var s = text.split(',');
                    $wn(this).find('.headline a ').text('');
                    $wn(this).find('.headline a').append('<span>' + s[0] + '</span><span>' + s[1] + '</span>');
                }

            });
            //

            $wn('.wnDVWxFullForecast.wnWxHorizontal.wnDSContainer-standard').addClass('weather-override');
            $wn(' div#DisplaySizeId7').addClass('weather-override');
            $wn('div#DisplaySizeId78').addClass('weather-override');
            $wn('div#DisplaySizeId78 > div:first-child').addClass('weather-override');
            $wn('div#DisplaySizeId78 ul.wnGroup.contentGroup').addClass('weather-override');
            $wn('.displaySize.displaySizeId78 .feature').addClass('weather-override');
            var $hasImage = $wn('#DisplaySizeId78 .displaySizeId-7 .summaryImage.abridged');
            $wn('#DisplaySizeId78 .displaySizeId-7 .summaryImage.abridged').addClass('weather-override');
            $wn('#DisplaySizeId78 .summaryImage.width115 img').addClass('weather-override');
            $wn('#DisplaySizeId78 .summaryImage.width90 img').addClass('weather-override');
            $wn('#DisplaySizeId78 .summaryImage.width50 img').addClass('weather-override');
            $wn('.displaySize.displaySizeId78 .headline').addClass('weather-override');
            $wn('#DisplaySizeId78 .headline .text').addClass('weather-override');
            $wn('.displaySize.displaySizeId78 .summary.abridged').addClass('weather-override');
            $wn('div#DisplaySizeId78 ul.wnGroup.contentGroup li.feature .headline span').css('text-align', 'center');
            // remove  li not person
            $wn('#DisplaySizeId78 li').each(function () {
                if ($wn(this).attr('class').indexOf('feature') == -1) {
                    $wn(this).remove();
                }
            });


            $wn('div#DisplaySizeId78 ul.wnGroup.contentGroup li').each(function (index) {
                var authorName = $wn(this).find('h4 span:first-child').text();
                // person not in list
                var thumbnail = '';
                if ($wn(this).find('.summaryImage.abridged a img').attr('src')) {
                    thumbnail = $wn(this).find('.summaryImage.abridged a img').attr('src');
                } else {
                    thumbnail = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/weather_author_dummy.PNG';
                }
                for (var i = 0; i < wxTeamSocialInfo.length; i++) {
                    if (authorName == wxTeamSocialInfo[i][0]) {
                        thumbnail = wxTeamSocialInfo[i][4];
                        social = wxTeamSocialInfo[i];
                        break;
                    } else {
                        social = ['', 'http://www.facebook.com', 'http://www.twitter.com', '']; 
                    }
                }

                $wn('<div class="wnContent summaryImage abridged left width115" ' +
                            ' style="background: url(' + thumbnail + ') center center no-repeat; max-width: 100%; height: 132px; margin-top: 5px !important; background-size: 156px 132px;" ></div>').insertBefore($wn(this).find('.headline:first'));

                var contactInfo = '<div class="contact-info"><a class="fb" href="' + social[1] + '" target="_blank">' +
                    '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/facebook.png"></a>' +
                    '<a class="twitter" href="' + social[2] + '" target="_blank">' +
                    '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/twitter.png"></a>' +
                    '<a class="email" href="mailto:' + social[3] + '" target="_blank">' +
                    '<img src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/social-icon/email.png"></a></div>';
                $wn(contactInfo).insertAfter($wn(this).find('h4.headline'));
            });

            // button
            $wn('<span class="backward control"></span>').prependTo($wn('#DisplaySizeId78'));
            $wn('#DisplaySizeId78').append('<span class="forward control"></span>');
            // events

            /* hide */
            if ($wn('.displaySize.displaySizeId78 .feature').length < 2) {
                $wn('#DisplaySizeId78 > span.backward').hide();
                $wn('#DisplaySizeId78 > span.forward').hide();
            } else
                $wn('#DisplaySizeId78 > span.backward').hide();

            $wn('.displaySize.displaySizeId78 .feature:first').show();
            $wn('.displaySize.displaySizeId78 .feature:not(:first)').hide();

            $wn('#DisplaySizeId78 > span.forward').click(function () {
                var len = $wn('.displaySize.displaySizeId78 .feature').length;
                if (1 < len && currentPositionTeam < (len - 1)) {

                    currentPositionTeam++;
                    $wn('.displaySize.displaySizeId78 .feature').hide();
                    $wn('.displaySize.displaySizeId78 .feature:nth-of-type(' + (currentPositionTeam + 1) + ')').show();

                    $wn('#DisplaySizeId78 > span.backward').show();
                    if (currentPositionTeam == (len - 1))
                        $wn(this).hide();
                } else {
                    $wn(this).hide();
                }
            });
            $wn('#DisplaySizeId78 > span.backward').click(function () {
                var len = $wn('.displaySize.displaySizeId78 .feature').length;
                if (1 < len && currentPositionTeam > 0) {

                    currentPositionTeam--;
                    $wn('.displaySize.displaySizeId78 .feature').hide();
                    $wn('.displaySize.displaySizeId78 .feature:nth-of-type(' + (currentPositionTeam + 1) + ')').show();
                    $wn('#DisplaySizeId78 > span.forward').show();
                    if (currentPositionTeam == 0)
                        $wn(this).hide();
                } else {
                    $wn(this).hide();
                }
            });
            // hide new/blog
            $wn('#DisplaySizeId68 .contentGroup li:gt(3)').hide();

            // move before #DS 68
            $wn('#DisplaySizeId78').insertAfter($wn('#DisplaySizeId68'));
            $wn('#DisplaySizeId78 > ul > li.wnItem.feature > div.wnContent.summaryImage.abridged.left.width115 > a > img').addClass('override-team');



        });
    },
    //===============
    // move ad
    /**
     * move position of ad copy and remove old AD
     * @param  {Number} idAD        ex: WNAD46 -> idAD = 46
     * @param  {String} idContentAd ex: 246 and must different idAD of WN
     * @param  {String} style    style of jquery assign: append, prependTo, after...
     * @return {String}             no
     */
    moveAds: function (idAD, idADNew, idContentAd, style) {

        if (wng_pageInfo.ads[idAD]) {
            var myad = wng_pageInfo.ads[idAD];
            var ad = wng_pageInfo.ads[idAD];
            ad = null;
            myad.id = idADNew;
            Worldnow.AdMan.attachAd({
                selector: '#' + idContentAd,
                attachStyle: style
            }, myad);
            $wn('#WNAd' + idAD).remove();
        }
    },
    /*=================
     * News Page
     * =================*/
    newsPage: function () {
        // topStory
        var divTopStories = '<div id="WNTopFeaturesNews">' +
            '<div id="img-backgroud">' +
            '<a href="">' +
            '<img class="img-story" src="" alt="">' +
            '<img class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png" alt="" />' +
            '</a>' +
            '</div>'

            + '<div id="infor">' +
            '<div class="text">' +
            '<a href="">' +
            '<h3 class="headline"></h3>' +
            '<h4 class="summary text"></h4>' +
            '</a>' +
            '</div>' +
            '<div class="control">' +
            '<span class="backward button"></span>' +
            '<label style="display: inline-block; margin-top: 3px;" class="number">1/5</label>' +
            '<span class="forward button"></span>' +
            '</div>' +
            '</div>' +
            '</div>';
        if (window.location.href.indexOf('category/268477') > -1) {
            /* TOPSTORIES */
            var $listStories = $wn('.wnDSItems-standard .wnDVSummary:lt(5)').clone();
            var posTopStories = 0;
            // insert layout of topstory to page
            $wn('#WNCol23Top #WNDS-20').html(''); /* clear */
            $wn('#WNCol23Top #WNDS-20').append(divTopStories);
            // jquery object
            var $imageStory = $wn('#WNTopFeaturesNews #img-backgroud a .img-story');
            var $aImg = $wn('#WNTopFeaturesNews #img-backgroud a');
            var $aText = $wn('#WNTopFeaturesNews #infor .text  a ');
            var $headline = $wn('#WNTopFeaturesNews #infor .text  a .headline ');
            var $summary = $wn('#WNTopFeaturesNews #infor .text  a .summary');
            var $forward = $wn('div#infor span.forward.button');
            var $backward = $wn('div#infor span.backward.button');
            var $listNumber = $wn('div#infor label.number');
            var $iconVideo = $wn('#img-backgroud .icon-player');
            // custom layout
            $wn('#WNAffRFDTV #WNColsAll #WNCols23-4 #WNCol23 #WNCol23Top #WNTopStoryWrap').addClass('news-override');
            $wn('#WNTopStoryWrap #WNTSWContent').addClass('news-override');
            $wn('#WNAffRFDTV #WNColsAll #WNCol4').addClass('news-override');
            // show first story
            var $firstStory = $wn($listStories[0]);
            setDataToTopStory($firstStory);
            events();
            var numberMoreStories = 13;
            newsPageBlock(numberMoreStories); // new block
            topVideoCol4();

        }

        function topVideoCol4() {
            var div = '<div id="wnTopVideoCol4">' +
                '<div class="header"><span>TOP VIDEOS</span><span></span></div>' +
                '<ul class="wnContent"></ul>' +
                '<div>';
            var li = '<li><a href="">' +
                '<div class="image"></div></a>' +
                '<a href=""><div class="headline-custom"><span></span>' +
                '<img class="wnVideoIncluded" style="margin-left: 5px;" src="http://ftpcontent.worldnow.com/professionalservices/clients/kake/images/video-icon.jpg" ' +
                ' alt="Video included" border="0"></div></a>' +
                '</li>';
            var $listTopVideo = $wn('#DisplaySizeId68 ul li.feature:lt(3)');
            /* override css  */

            $wn('#DisplaySizeId68').addClass('news-override');
            $wn('#DisplaySizeId68').children().hide(); // clear
            $wn('#DisplaySizeId68').append(div); // insert structure
            var len = $listTopVideo.length;
            for (var i = 0; i < len; i++) {
                var $story = $wn($listTopVideo[i]);
                $wn('#DisplaySizeId68 #wnTopVideoCol4 .wnContent').append(li);
                var url = $story.find('.headline a').attr('href');
                var image = $story.find('.summaryImage.abridged img').attr('data-path');
                if (typeof image == 'undefined') image = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/RFDTV_thumbnail.jpg';
                var top = 'notop';
                var isVideo = $story.find('.wn-icon-video-included').length > 0 ? true : false;
                var headline = $story.find('.headline a span:first').text();
                $wn('#DisplaySizeId68 #wnTopVideoCol4 .wnContent li:nth-of-type(' + (i + 1) + ') a').attr('href', url);
                $wn('#DisplaySizeId68 #wnTopVideoCol4 .wnContent li:nth-of-type(' + (i + 1) + ') .image').css('background', 'url("' + image + '") center no-repeat black');
                $wn('#DisplaySizeId68 #wnTopVideoCol4 .wnContent li:nth-of-type(' + (i + 1) + ') .headline-custom span').text(headline);
                if (isVideo)
                    $wn('#DisplaySizeId68 #wnTopVideoCol4 .wnContent li:nth-of-type(' + (i + 1) + ') img.wnVideoIncluded').show();
            }
        }

        function events() {
            var len = $listStories.length;
            $forward.click(function () {
                if (posTopStories < len - 1) {
                    posTopStories++;
                    $listNumber.text((posTopStories + 1) + '/5');
                    setDataToTopStory($wn($listStories[posTopStories]));
                }
            });
            $backward.click(function () {
                if (posTopStories > 0) {
                    posTopStories--;
                    $listNumber.text((posTopStories + 1) + '/5');
                    setDataToTopStory($wn($listStories[posTopStories]));
                }
            });
        }

        function setDataToTopStory($story) {
            // get data
            var $total = $story.find('.wnImage.wnImageWidth-90') ? $story.find('.wnImage.wnImageWidth-90') :
                $story.find('.wnImage.wnImageWidth-115');
            $total = $total.length == 0 ? $story.find('.wnImage.wnImageWidth-250') : $total;
            $total = $total.length == 0 ? $story.find('.wnImage.wnImageWidth-50') : $total;
            var imageStory = ($total.length > 0 && $total.find('a img').attr('src').trim().length != 0) ? $total.find('a img').attr('src') : 'noimage';
            var urlSotry = $total.find('a').attr('href');
            var headline = $story.find(' > h4 span').text().length != 0 ? $story.find(' > h4 span').text() : $story.find('.more-news-content .wnRole-STORY span').text();
            var summary = $story.find(' > p').text();
            var isVideo = $story.find('.wnVideoIncluded').length > 0 ? true : false;
            // set
            $imageStory.attr('src', imageStory);
            $aImg.attr('href', urlSotry);
            $aText.attr('href', urlSotry);
            $headline.text(headline);
            $summary.text(summary);
            $headline.ellipsis({
                row: 1,
                onlyFullWords: true
            });
            $summary.ellipsis({
                row: 2,
                onlyFullWords: true
            });
            isVideo ? $iconVideo.show() : $iconVideo.hide();
        }
        /*
         *
         *   MORE NEWS BLOCK FOR NEWS PAGE.
         */
        function newsPageBlock(numberStories) {

            $wn('#WNCol2 #WNDS-20 .wnDSItems-standard').hide();

            var listStories = [];

            $wn('#WNCol23Top #WNDS-20 .wnDSItems-standard .wnDVSummary').each(function () {
                listStories.push($wn(this));
            });

            $wn('#WNCol2 #WNDS-20 .wnDSItems-standard .wnDVSummary').each(function () {
                listStories.push($wn(this));
            });

            ///////////////////
            //
            //  MORE NEWS BLOCK
            //
            //////////////////
            $wn('#WNCol2 #WNDS-20').addClass('list-more-news-wrapper').addClass('displaySizeId-20').addClass('headlineBox').removeClass('wnDSContainer-standard');
            var headlineBoxTitle = '<ul class="wnGroup contentGroup odd collapsible closed last">' +
                '<li class="wnItem header"><h3><span class="text abridgedHeadline">More News</span><div class="wnClear"></div></h3></li>' +
                '<li class="wnItem advertisement"></li>' +
                '</ul>';
            $wn('#WNCol2 #WNDS-20').prepend(headlineBoxTitle);
            //  mMUST  CHANGE DOMAIN
            var dataXML = 'http://www.rfdtv.com/category/268477/news' + jsonUrls.dataJSON;
            $.ajax({
                url: proxyURL + dataXML
            })
                .fail(function (err) {
                    console.log(err);
                })
                .done(function (xml) {
                    //get all Stories data
                    storiesData = [];
                    var listStories = xml.features;
                    var categoryTopVideo = '';
                    // filter story
                    var len = listStories.length;
                    for (var i = 0; i < len; i++) {
                        if (listStories[i].displaysize == '-20')
                            storiesData.push(listStories[i]);
                        if (listStories[i].displaysize == '68')
                            categoryTopVideo = listStories[i];
                    }
                    //get 13 stories from 4th story//
                    // var moreNewsStories = CDEVRFDTV.spliceStories('-20', 4, 13, storiesData); //
                    var listStoryLength = storiesData.length; //number total stories in list
                    storiesData = storiesData.splice(5, numberStories);

                    //loop for all stories and hold first 3 stories
                    $wn('.list-more-news-wrapper .wnDSItems-standard .wnDVSummary:lt(4)').remove();
                    $wn('.list-more-news-wrapper .wnDSItems-standard .wnDVSummary').each(function (index) {
                        var topicsArray = CDEVRFDTV.getStoryListTopics(storiesData[index]);
                        var topicsHTML = CDEVRFDTV.rendertopicList(topicsArray);
                        $wn(this).appendTo('#WNCol2 #WNDS-20 ul.wnGroup');
                        //create new div to contain abtracts image
                        jQuery('<div/>', {
                            'class': 'more-news-thumbnail'
                        }).appendTo($wn(this));
                        //create new div to contain all detail abtracts of this story
                        jQuery('<div/>', {
                            'class': 'more-news-content'
                        }).appendTo($wn(this));
                        $wn(this).find('h4').appendTo($wn(this).find('.more-news-content'));
                        $wn(this).find('.wnImage').appendTo($wn(this).find('.more-news-thumbnail'));
                        $wn(this).find('.wnDate').appendTo($wn(this).find('.more-news-content'));
                        $wn(this).find('noscript').appendTo($wn(this).find('.more-news-content'));
                        $wn(this).find('p').appendTo($wn(this).find('.more-news-content'));
                        $wn(this).find('.wnSummaryLink').remove();
                        $wn(topicsHTML).appendTo($wn(this).find('.more-news-thumbnail'));
                        //addbackground image for thumbnail
                        var backgroundURL = $wn(this).find('.more-news-thumbnail .wnImage img').first().attr('src');
                        if (typeof backgroundURL == 'undefined') backgroundURL = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/RFDTV_thumbnail.jpg';
                        $wn(this).find('.more-news-thumbnail .wnImage').css('background', 'url(' + backgroundURL + ') #000');
                        $wn(this).find('.more-news-thumbnail .wnImage img').first().hide();
                        $wn(this).find('.wnSectionTitle').hide();
                    });

                    $wn('.list-more-news-wrapper .wnDVSummary').each(function (index) {
                        if (index >= numberStories) {
                            $wn(this).hide();
                        }
                    });
                    // render topic for topvideo
                    if (typeof categoryTopVideo != 'string') {
                        var listStoriesTopVideo = categoryTopVideo.nested.features;
                        $wn('#wnTopVideoCol4  ul.wnContent li').each(function (index) {
                            var topicsArray = CDEVRFDTV.getStoryListTopics(listStoriesTopVideo[index]);
                            var topicsHTML = CDEVRFDTV.rendertopicList(topicsArray);
                            $wn(topicsHTML).appendTo($wn(this).find('a:first-child .image'));
                        });
                    }
                    $wn('#WNCol2 #WNDS-20 .wnDSItems-standard').remove();
                    $wn('<a class="wnContent more enabled" href="/category/259595/mostpopularstory">More Stories</a>').appendTo('#WNCol2 #WNDS-20 ul.wnGroup');

                    $wn('#WNDS-20 > ul > a').removeAttr('href'); //remove hyperlink for more stories

                    $wn('#WNDS-20 > ul > a').click(function () {
                        numberStories += 10;

                        if (numberStories >= listStoryLength) {
                            $wn('#WNDS-20 > ul > a').hide();
                        }

                        $wn('.list-more-news-wrapper .wnDVSummary').each(function (index) {
                            if (index >= numberStories) {
                                $wn(this).hide();
                            } else {
                                $wn(this).show();
                            }
                        });
                    });

                });
        }
    },

    //for generateDataLink to get data from XML
    generateDataLink: function () {
        var url = window.location.href;
        var hashPosition = url.indexOf('#');
        if (hashPosition == -1) {
            return url + '?debug_verbose=XML&frankly-key=MjAxNi0wOS0xNQ==&frankly-email=pmtandhqn@gmail.com&frankly-data=XML';
        } else {
            return url.substring(0, hashPosition) + '?debug_verbose=XML&frankly-key=MjAxNi0wOS0xNQ==&frankly-email=pmtandhqn@gmail.com&frankly-data=XML';
        }
    },


    //More news block bottom of every stories page
    moreNewsBlock: function () {
        $wn('#DisplaySizeId80').addClass('more-news-wrapper');
        $wn('#DisplaySizeId80').css('width', '645px;');
        $.ajax({
            url: "http://" + window.location.hostname + $wn('#DisplaySizeId80 > ul > li.wnItem.header > h3 > a').attr('href') + '?clienttype=container.json'
        })
            .fail(function (err) {
                console.log(err);
            })
            .done(function (data) {
                //get all Stories data in CATEGORY DS = 80
                storiesData = [];

                //get 3 stories DS = -20 in CATEGORY 268477
                for (var i = 0; i < data.features.length; i++) {
                    if ((data.features[i].type = 'story') && (data.features[i].displaysize == '-20')) {
                        storiesData.push(data.features[i]);
                    }
                    if (storiesData.length == 3) {
                        break;
                    }
                }
                //get 3 first stories
                var moreNewsStories = storiesData;

                //loop for all stories and hold first 3 stories
                $wn('.more-news-wrapper .closed.last li.story').each(function (index) {
                    if (index <= 2) {
                        var topicsArray = CDEVRFDTV.getStoryListTopics(moreNewsStories[index]);
                        var topicsHTML = CDEVRFDTV.rendertopicList(topicsArray);
                        //create new div to contain abtracts image
                        jQuery('<div/>', {
                            'class': 'more-news-thumbnail'
                        }).appendTo($wn(this));
                        //create new div to contain all detail abtracts of this story
                        jQuery('<div/>', {
                            'class': 'more-news-content'
                        }).appendTo($wn(this));
                        //move h4 tag into new div
                        $wn(this).find('h4').appendTo($wn(this).find('.more-news-content'));
                        //hide section title when has been displayed
                        if ($wn(this).find('h4.sectionTitle').length) {
                            $wn(this).find('h4.sectionTitle').hide();
                        }
                        //move date to this
                        $wn(this).find('.wnDate').appendTo($wn(this).find('.more-news-content'));
                        //move summary abtracts to detail content
                        $wn(this).find('.wnContent.summary').appendTo($wn(this).find('.more-news-content'));
                        //move meta to .more-news-content
                        $wn(this).find('meta').appendTo($wn(this).find('.more-news-content'));
                        var hyperlinkStory = $wn(this).find('.more-news-content h4.headline.abridged a').attr('href');
                        //append list topics for this story into thumbnail
                        $wn(topicsHTML).appendTo($wn(this).find('.more-news-thumbnail'));
                        //move summaryImage to thumbnail
                        $wn(this).find('.summaryImage').appendTo($wn(this).find('.more-news-thumbnail'));
                        $wn(this).find('.more-news-thumbnail').wrap('<a href="' + hyperlinkStory + '" />'); // add hyperlink to images thumbnail
                        //addbackground image for thumbnail
                        var backgroundURL = $wn(this).find('.summaryImage img').first().attr('data-path');
                        $wn(this).find('.more-news-thumbnail .summaryImage.abridged').css('background', 'url(' + backgroundURL + ') #000');
                        $wn(this).find('.more-news-thumbnail .summaryImage img').remove();
                        if (index == 2) {
                            //move down more stories button when stories number is 3
                            $wn('.more-news-wrapper > ul > li.wnItem.header > h3 > a').text('More Stories');
                            $wn('.more-news-wrapper > ul > li.wnItem.header > h3 > a').insertAfter($wn(this));
                        }
                    } else if (index > 2) {
                        //remove all stories after 3th story
                        $wn(this).remove();
                    }
                });
            });
        //remove toggle in last list
        $wn('.more-news-wrapper .closed.last .toggle').remove();

        //change text of title
        $wn('.more-news-wrapper > ul > li.wnItem.header > h3 > span').text('More News');
    },
    /*
     *
     *   FOOTER MENU AT THE BOTTOM OF STORIES PAGE
     *
     */

    footerMenuBlock: function () {
        $wn('#WNFooterLinks').remove();
        var menuItems = '';
        $wn('.sf-menu:eq(0) > li').each(function () {
            var item = '';
            if (($wn(this).prop('outerHTML').indexOf('<ul>') > -1) || ($wn(this).prop('outerHTML').indexOf('</ul>') > -1)) {
                var first = $wn(this).prop('outerHTML').indexOf('<ul>');
                var second = $wn(this).prop('outerHTML').indexOf('</ul>');
                item = $wn(this).prop('outerHTML').substring(0, first) + $wn(this).prop('outerHTML').substring(second + 5, $wn(this).prop('outerHTML').length);
            } else {
                item = $wn(this).prop('outerHTML');
            }

            menuItems += item;
        });

        var menuFooterRAW = '<div><ul class="footerMenu">{*listmenu*}</ul></div>';
        var menuElement = CDEVRFDTV.replaceAll(menuFooterRAW, '{*listmenu*}', menuItems);
        $wn(menuElement).prependTo('#WNCopyrightAlignment');
        $wn('.footerMenu ul').css('padding', '0px');
        $wn('#WNCopyright > table > tbody > tr > td:nth-child(1) > a > img:nth-child(1)').css('margin-top', '85px');
        // add items About and Contact Us
        // about
        $wn('#WNCopyrightAlignment > div:nth-child(1) > ul > li:nth-child(1)').clone().prependTo($wn('#WNCopyrightAlignment > div:nth-child(1) > ul'));
        $wn('#WNCopyrightAlignment > div:nth-child(1) > ul > li:nth-child(1) > a').text('About');
        $wn('#WNCopyrightAlignment > div:nth-child(1) > ul > li:nth-child(1) > a').attr('href', 'http://www.rfdtv.com/story/24589387/about-us');
        // contact us
        $wn('#WNCopyrightAlignment > div:nth-child(1) > ul > li:nth-child(1)').clone().prependTo($wn('#WNCopyrightAlignment > div:nth-child(1) > ul'));
        $wn('#WNCopyrightAlignment > div:nth-child(1) > ul > li:nth-child(2) > a').text('Contact Us');
        $wn('#WNCopyrightAlignment > div:nth-child(1) > ul > li:nth-child(2) > a').attr('href', 'http://www.rfdtv.com/category/267691/contact-us');

    },

    /*
     *
     *   MOST POPULAR BLOCK AT COL 4 OF EVERY STORIES PAGES.
     *
     */

    mostPopularBlock: function () {
        if ($wn('#DisplaySizeId78').length) {
            //remove old block if exist
            $wn('#DisplaySizeId78').remove();

            $.ajax({
                url: url + jsonUrls.dataJSON
            })
                .fail(function (err) {
                    console.log(err);
                })
                .done(function (data) {
                    //get all Stories data
                    storiesData = [];
                    for (var i = 0; i < data.features.length; i++) {
                        if ((data.features[i].type = 'category') && (data.features[i].displaysize == '78')) {
                            for (var j = 0; j < data.features[i].nested.features.length; j++) {
                                storiesData.push(data.features[i].nested.features[j]);
                                if (storiesData.length == 3) {
                                    break;
                                }
                            }
                        }
                    }
                    //get 3 first stories
                    var moreNewsStories = storiesData;

                    jQuery('<div/>', {
                        'id': 'DisplaySizeId78',
                        'class': 'wnBlock displaySize displaySizeId78 headlineBox popularBlock'
                    }).appendTo('#WNCol4');

                    //append wnClear for clearfix
                    jQuery('<div/>', {
                        'class': 'wnClear'
                    }).insertAfter('#DisplaySizeId78');

                    //append wnClear for clearfix
                    jQuery('<div/>', {
                        'id': 'mostPopular'
                    }).prependTo('#DisplaySizeId78');

                    var headlineBlock = '<div class="headline">' +
                        '<h1>Most Popular</h1>' +
                        '</div>';

                    var itemRAW = '<li>' +
                        '<a href="{*storyURL*}"><div class="most-popular-thumbnail title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
                        '{*topic*}' +
                        '</div></a>' +
                        '<div class="most-popular-content">' +
                        '<a href="{*storyURL*}"><h1>{*headline*} {*iconPlay*}</h1></a>' +
                        '</div>' +
                        '</li>';

                    var listItems = '';

                    for (var j = 0; j < moreNewsStories.length; j++) {

                        var topics = CDEVRFDTV.getStoryListTopics(moreNewsStories[j]);
                        var link = CDEVRFDTV.getStoryLink(moreNewsStories[j]);
                        var imgSrc = CDEVRFDTV.getStoryAbtractImage(moreNewsStories[j]);
                        var headline = CDEVRFDTV.getStoryHeadline(moreNewsStories[j]);
                        var hasClip = CDEVRFDTV.getStoryIconClip(moreNewsStories[j]);

                        var item = itemRAW;
                        item = CDEVRFDTV.replaceAll(itemRAW, '{*storyURL*}', link);
                        item = CDEVRFDTV.replaceAll(item, '{*storyURL*}', link);
                        item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgSrc);
                        item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
                        item = CDEVRFDTV.replaceAll(item, '{*topic*}', CDEVRFDTV.rendertopicList(topics));
                        if (hasClip) {
                            item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag title="Video included" class="inline-videoicon"></tag>');
                        } else {
                            item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<tag style="display: none" title="Video included" class="inline-videoicon"></tag>');
                        }
                        listItems += item;
                    }

                    listItems = '<ul>' + listItems + '</ul>';

                    $wn(headlineBlock).appendTo('#mostPopular');
                    $wn(listItems).appendTo('#mostPopular');

                    $wn('#DisplaySizeId78').insertBefore($wn('#WNAd252'));
                    $wn('#col4-social-icons').insertBefore('#DisplaySizeId78'); //move social icon to right place
                });
        }
    },


    /*================================
     *
     * RENDER ALL BLOCKS AND ELEMENTS FOR HOMEPAGE COL 123
     *
     *================================*/

    renderHomePage: function () {
        $.ajax({
            url: url + jsonUrls.dataJSON
        })
            .fail(function (err) {
                console.log(err);
            })
            .done(function (result) {
                var features = result.features;
                CDEVRFDTV.topFeaturesBlock(features);
                CDEVRFDTV.lastestNewsBlock(features, '-20', 3, 3);
                CDEVRFDTV.categoryNameBlock(features);
                CDEVRFDTV.list8storiesBlock(features);
            });
    },
    /*================================
     *
     * RENDER ALL BLOCKS AND ELEMENTS FOR WESTERN SPORTS
     *
     *================================*/
    westernSport: function () {
        var itemsOfTopStory = 10;
        $wn('#WNAffRFDTV').hide();
        $.ajax({
            url: url + jsonUrls.dataJSON
        })
            .fail(function (err) {
                console.log(err);
            })
            .done(function (data) {
                // var data = $.parseJSON(this.response.responseText);
                var features = data.features;

                // latest new
                CDEVRFDTV.lastestNewsBlock(features, '-20', itemsTopStoryWesternSport + 1, itemsLatestNewsWesternSport);
                // move latest new
                $wn('#DisplaySizeId-7').html($wn('#WNLastestNews'));
                //
                $wn('.lastest-news .list-lastest-news li .lastest-news-content .abstract').ellipsis({
                    row: 2,
                    onlyFullWords: true
                });
                // top stories
                topStories(features);
                // // add send use your...
                // sendUsYourWesternSport();
                // ruralRadio();

                //
                $wn('#WNCol4').css('margin-top', '0px');
                customMeetTheTeam();
                // mostPopular();
                $wn('#WNAffRFDTV').show();

            });
        /////////
        /// ABOVE IMAGE ABOVE THE MOST POPULAR BLOCK
        /// //////////
        function ruralRadio() {
            var div = '<div id="rural-radio-col4" >RURAL RADIO<h4>Western Sports Coverage</h4></div>';
            $wn(div).insertAfter($wn('#DisplaySizeId78'));
        }
        ////////////
        /// IMAGE ABOVE THE MOST POPULAR BLOCK
        /// ///////
        function sendUsYourWesternSport() {
            var img = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/sendusyour.PNG';
            var div = '<div id="send-us-your-img" style="background: url(\'' + img + '\') center center no-repeat black;"></div>';
            $wn(div).insertAfter($wn('#DisplaySizeId78'));
        }

        function topStories(feature) {
            var listTopStories = [];
            var left = 0;
            var right = 3;
            $wn('#WNCol23Top').remove();
            // filter stories list
            var stories = CDEVRFDTV.spliceStories('-20', 0, itemsTopStoryWesternSport, feature);
            var structure = '<div id="CDEV-topStories">' +
                '<div id="show-stories">' +
                '<div class="text"></div>' +
                '<a><div class="image"></div></a>' +
                '</div><div style="clear: both;">' +
                '</div>' +
                '<div id="list-stories"><ul></ul></div>' +
                '</div>';

            $wn('#WNDS-20').text('');
            $wn('#WNDS-20').append(structure);
            var listItemsHTML = '';
            var itemRaw = '<li><div class="list-story-item" number="{*number*}">' +
                '<a href="{*storyURL*}"><div class="item-thumbnail" title="{*headline*}" style="background: url(\'{*imgSRC*}\') #000 center no-repeat">' +
                /*'{*topic*}' + */
                '{*iconPlay*}' +
                '</div></a>' +
                '<div class="item-info">' +
                '<a href="{*storyURL*}"><h1>{*headline*}{*iconPlay*}</h1></a>' +
                '<span style="display: none;">{*abstract*}</span>'
            '</div>' +
                '</div></li>';
            listTopStories = stories;
            for (var i = 0; i < stories.length; i++) {

                // var topics = CDEVRFDTV.getStoryListTopics(stories[i]);
                var link = CDEVRFDTV.getStoryLink(stories[i]);
                var imgSrc = CDEVRFDTV.getStoryAbtractImage(stories[i]);
                var headline = CDEVRFDTV.getStoryHeadline(stories[i]);
                var abstract = CDEVRFDTV.getStoryAbstract(stories[i]);
                var hasClip = CDEVRFDTV.getStoryIconClip(stories[i]);

                var item = itemRaw;

                item = CDEVRFDTV.replaceAll(item, '{*storyURL*}', link);
                item = CDEVRFDTV.replaceAll(item, '{*imgSRC*}', imgSrc);
                item = CDEVRFDTV.replaceAll(item, '{*headline*}', headline);
                item = CDEVRFDTV.replaceAll(item, '{*abstract*}', abstract);
                item = CDEVRFDTV.replaceAll(item, '{*number*}', (i).toString());

                // item = CDEVRFDTV.replaceAll(item, '{*topic*}', CDEVRFDTV.rendertopicList(topics));

                if (hasClip) {
                    item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<img class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
                } else {
                    item = CDEVRFDTV.replaceAll(item, '{*iconPlay*}', '<img style="display: none;" class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
                }

                listItemsHTML += item;
                if (i == 0) { // at first loaded, show first the story
                    showTopStory(link, imgSrc, headline, abstract, hasClip);
                }
            }
            $wn('#WNDS-20 #CDEV-topStories ul').append(listItemsHTML);
            // custom show of list stories
            $wn('div#list-stories h1').ellipsis({
                row: 2,
                onlyFullWords: true
            });
            // show 4 items

            $wn('#WNDS-20 #CDEV-topStories ul li').hide();
            $wn('#WNDS-20 #CDEV-topStories ul li:lt(4)').show();
            // backward,  forward buttons
            $wn('#list-stories').append('<span class="backward control"></span>');
            $wn('#list-stories').append('<span class="forward control"></span>');
            // events
            $wn('#list-stories  span.backward').hide();
            $wn('#CDEV-topStories span.backward').click(function () {
                if (left > 0) {
                    left--;
                    right--;
                    $wn('#WNDS-20 #CDEV-topStories ul li').show();
                    $wn('#WNDS-20 #CDEV-topStories ul li:lt(' + left + ')').hide();
                    $wn('#WNDS-20 #CDEV-topStories ul li:gt(' + right + ')').hide();
                    $wn('#CDEV-topStories span.forward').show();
                    if (left == 0)
                        $wn(this).hide();
                } else {
                    $wn(this).hide();
                }

            });
            $wn('#CDEV-topStories span.forward').click(function () {
                var len = $wn('#WNDS-20 #CDEV-topStories ul li').length;
                if ((len - 1) > right) {
                    left++;
                    right++;
                    $wn('#WNDS-20 #CDEV-topStories ul li').show();
                    $wn('#WNDS-20 #CDEV-topStories ul li:lt(' + left + ')').hide();
                    $wn('#WNDS-20 #CDEV-topStories ul li:gt(' + right + ')').hide();
                    $wn('#list-stories  span.backward').show();
                    if ((len - 1) == right)
                        $wn(this).hide();
                } else {
                    $wn(this).hide();
                }
            });
            // event hover
            $wn('#list-stories ul li').hover(function (event) {
                var num = $wn(this).find('div').attr('number');
                var story = listTopStories[Number(num)];
                var link = CDEVRFDTV.getStoryLink(story);
                var imgSrc = CDEVRFDTV.getStoryAbtractImage(story);
                var headline = CDEVRFDTV.getStoryHeadline(story);
                var abstract = CDEVRFDTV.getStoryAbstract(story);
                var hasClip = CDEVRFDTV.getStoryIconClip(story);
                showTopStory(link, imgSrc, headline, abstract, hasClip);
            });
        }
        ///////////
        /// SET CONTENT FOR TOP STORY
        /// //////////
        function showTopStory(link, imgSrc, headline, abstract, hasClip) {
            $wn('#CDEV-topStories #show-stories .text').html('');
            $wn('#CDEV-topStories #show-stories a ').attr('href', link);
            $wn('#CDEV-topStories #show-stories a div ').attr('style', 'background: url(' + imgSrc + ') center center no-repeat black;');
            $wn('#CDEV-topStories #show-stories .text').append('<h3><a href="' + link + '"> ' + headline + ' </a></h3>');
            $wn('#CDEV-topStories #show-stories .text').append('<span>' + abstract + '</span>');
            if (hasClip) {
                $wn('#CDEV-topStories #show-stories a div ').html('<img class="icon-player" src="http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/play-button.png">');
            } else {
                $wn('#CDEV-topStories #show-stories a div ').html('');
            }
        }
        ////////////////
        /// CUSTOM MEETTHETEAM FOR WESTERN SPORTS
        /// ///////////
        function customMeetTheTeam() {
            $wn('#DisplaySizeId78').insertBefore('#WNDS64');
            // override
            $wn('div#DisplaySizeId78>div.weather-override').addClass('custom');
            $wn('div#DisplaySizeId78.weather-override').addClass('custom');
            $wn('.displaySize.displaySizeId78 div.contact-info a img').addClass('custom');
            $wn('.displaySize.displaySizeId78 div.contact-info').each(function () {
                // change icon
                var img = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/westernsport_icon_meettheteam.PNG';
                $wn(this).find('a:nth-of-type(1) img').attr('src', '');
                $wn(this).find('a:nth-of-type(1) img').attr('style', 'background: url(' + img + ') left center no-repeat black;');

                $wn(this).find('a:nth-of-type(2) img').attr('src', '');
                $wn(this).find('a:nth-of-type(2) img').attr('style', 'background: url(' + img + ') center center no-repeat black;');

                $wn(this).find('a:nth-of-type(3) img').attr('src', '');
                $wn(this).find('a:nth-of-type(3) img').attr('style', 'background: url(' + img + ') right center no-repeat black;');
            });
            // change backward and forward button
            var img = 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/westernsport_icon_forward_meettheteam.PNG';
            $wn('#DisplaySizeId78>span.control').attr('style', 'background: url(' + img + ') center center no-repeat ;');

            $wn('#DisplaySizeId78>span:first-child').attr('style', 'background: url(' + img + ') center center no-repeat;');
            $wn('#DisplaySizeId78>span:first-child').hide();
            $wn('div#DisplaySizeId78>div.weather-override.custom').html('<h3>MEET THE TEAM</h3><span class="cross"><s/pan>');
            $wn('.displaySize.displaySizeId78 div.contact-info a img').css({'width': '39px','height': '37px'});
            $wn('#DisplaySizeId78 > ul > li.wnItem.feature > div.contact-info > a').css('display', 'inline-block');
        }
        /////////////////
        /// MOST POPULAR COL 4 (STORIES VS VIDEOS)
        /// ///////////////////////
        function mostPopular() {
          var urlStories = 'http://api.worldnow.com/feed/v2.0/categories/'+ MostPopularStoriesCategoryNumber +'/stories?alt=xml';
          var urlVideos = 'http://api.worldnow.com/feed/v2.0/categories/'+ MostPopularVideosCategoryNumber +'/clips?alt=xml';
          var $container = $wn('#WNCol4');
          $.ajax({
              url: proxyURL + urlStories,
              success: function (data) {
                  var $data = $wn(data);

                  imostPopular($data, 1);
              },
              error: function (error) {
                  callbackerror(error);
              }
          });
          $.ajax({
              url: proxyURL + urlVideos,
              success: function (data) {
                var $data = $wn(data);
                imostPopular($data, 2);
              },
              error: function (error) {
                  callbackerror(error);
              }
          });

          function imostPopular($data, number) {

              var li = '';

              if ( $data.length > 0 && number == 1) {
                  // var stories = CDEVSupport.storySuport.spliceStories('-10', 0, 9, stories.nested.features)
                  var $stories = $data.find('story');
                  var len = $stories.length;
                  len = len < MostPopularNumberOfItems ? len : MostPopularNumberOfItems;
                  for (var i = 0; i < len; i++) {
                    var $st = $wn($stories[i]);
                      var link = '/story/' + $st.find(' > id').text() + '/' + $st.find(' seo  pageurl').text() ;
                      var headline = $st.find(' > headline').text();
                      var hasClip = $st.find(' > surfaceable >  feature > type ').text();
                      hasClip = hasClip == "Clip" ? true : false;
                      var urlImage = $st.find(' abstractimage filename').first().text();
                      li += '<li name="stories" ><span class="img" style="background: url(' + urlImage + ') black center no-repeat;">'
                          + '</span>';
                      li += '<a href="' + link + '"><h3> ' + headline + '</=h3></a>';
                      if (hasClip)
                          li += '<tag title="Video included" class="inline-videoicon"></tag></li><div style="clear: both;"></div>';
                      else
                          li += '</li><div style="clear: both;"></div>';
                  }
              }
              // video
              if ( $data.length > 0 &&  number == 2) {
                  // var stories = CDEVSupport.storySuport.spliceStories('-10', 0, 9, videos.nested.features)
                  var $videos = $data.find('clip');
                  var len = $videos.length;
                  len = len < MostPopularNumberOfItems ? len : MostPopularNumberOfItems;
                  for (var i = 0; i < len; i++) {
                      var $st = $wn($videos[i]);
                      var link = '/clip/' + $st.find(' > id').text() + '/' + $st.find(' seo  pageurl').text() ;
                      var headline = $st.find(' > headline').text();
                      var hasClip = true;
                      var urlImage = $st.find(' abstractimage filename').first().text();
                      li += '<li name="videos" style="display: none;" ><span class="img" style="background: url(' + urlImage + ') black center no-repeat;">'
                          + '</span>';
                      li += '<a href="' + link + '"><h3>' + headline + '</=h3></a>';
                      if (hasClip)
                          li += '<tag title="Video included" class="inline-videoicon"></tag></li><div style="clear: both;"></div>';
                      else
                          li += '</li><div style="clear: both;"></div>';
                  }
              }

              var isHas = $wn('#wnMostPopularTabbed > div.wnGroup > ul > li').length > 0 ? true :  false;
              if ( isHas ){
                $wn('#wnMostPopularTabbed > div.wnGroup > ul').append(li);
              }else{
              var buildHTML = '';

              buildHTML += '<div class="wnBlock displaySize displaySizeId80 headlineBox" id="wnMostPopularTabbed">';
              buildHTML += '<div class="cross"></div>';
              buildHTML += '<div class="wnGroup contentGroup collapsible closed">';
              buildHTML += '<div class="wnItem header"><h3>Most Popular</h3><span  class="cross"></span></div>';
              buildHTML += '<div class="wnMPTabs clearfix">';
              buildHTML += '<span class="wnTab wnTabOn" rel="s">Stories</span>';
              buildHTML += '<span class="wnTab" rel="v">Videos</span>';
              buildHTML += '</div>';
              buildHTML += '<ul class="mpGroup wnGroup contentGroup collapsible closed clearfix">';
              buildHTML += li;
              buildHTML += '<div class="wnClear"></div>';
              buildHTML += '</ul>';
              buildHTML += '</div>';
              buildHTML += '</div>';
              if( $wn('#col4-social-icons').length > 0  ){
                $wn(buildHTML).insertBefore($wn('#col4-social-icons'));
              }else
              if ($wn('#WNAd252').length > 0 ){
                $wn(buildHTML).insertBefore($wn('#WNAd252'));
              }else
                $container.append(buildHTML);
            }
              $wn('#wnMostPopularTabbed > div.wnGroup> ul > li > h3 > a').ellipsis({
                  row: 2,
                  onlyFullWords: true
              });
              // choose stori tap
              $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span:first').addClass('active');
              // events
              $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span:first').click(function () {
                  $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span').removeClass('active');
                  $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span:first').addClass('active');
                  $wn('#wnMostPopularTabbed ul li[name="videos"]').hide();
                  $wn('#wnMostPopularTabbed ul li[name="stories"]').show();
                  $wn('#wnMostPopularTabbed > div.wnGroup> ul > li > h3 > a').ellipsis({
                      row: 2,
                      onlyFullWords: true
                  });
              });
              $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span:last').click(function () {
                  $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span').removeClass('active');
                  $wn('#wnMostPopularTabbed .wnMPTabs.clearfix span:last').addClass('active');
                  $wn('#wnMostPopularTabbed ul li[name="videos"]').show();
                  $wn('#wnMostPopularTabbed ul li[name="stories"]').hide();
                  $wn('#wnMostPopularTabbed > div.wnGroup> ul > li > h3 > a').ellipsis({
                      row: 2,
                      onlyFullWords: true
                  });
              });
}
        }
    },
    stylingWallpaperAD: function () {

        //sidebar ads
        if (wng_pageInfo.ads[17]) {
            $wn('#WNAffRFDTV #WNHeader').css('width', '982px');
            $wn('#div-full-schedule').css('width', '982px');
            $wn('.div-sub-content-out').css('width', '44px')
            $wn('.div-schedule-content-tab').css('left', '42px');
            $wn('img.img-next-button').css('right', '11px');
            $wn('img.img-pre-button').css('right', '16px');
            $wn('.div-sub-content-out:nth-of-type(5)').css('left', '943px');
            $wn('#WNFooter').css('background-color', ' transparent');
            $wn('#WNFooter #WNCopyrightAlignment').css('width', '982px');
            $wn('#WNFooterSecondSection').css('width', '982px');
            $wn('div#div-full-schedule-title').css('padding-left', '42px');
            $wn('div#div-full-shedule').css('right', '44px');
            $wn('#csFooterBottomText').css({
                'margin-left': '0px',
                'padding-left': '140px',
                'font-size': '9.5px'
            });
            $wn('#WNFooter #WNCopyright img.wnFooter').css('margin-left', '-90px');
            $wn('#WNFooterLogos ul').css('margin-left', '145px');
            $wn('.footerMenu').css('margin', '0px');
            $wn('#WNAffRFDTV #WNColsAll #WNCols23-4 #WNCol23 #WNContainerStory').css('padding-left', '15px');
            $wn('#WNFooterLinks').css('width', '982px');
            $wn('#WNFooterLinks ul').css('margin-left', '9px');
            // slideshow footer
            $wn('#DisplaySizeId7').css({
                'width': '982px',
                'margin': '0px auto'
            });
            $wn('#WNSlideshowAlignment').css('width', '982px');
            $wn('#WNSlideshowAlignment .slideshow .headline .btn-more').css('right', '3px');
            $wn('#WNSlideshowAlignment .slideshow .headline').css('width', '873px');
            $wn('.footerMenu').css('margin-left', '0px');
        }
    },
    styleProgramming: function(){
      // if ( wng_pageInfo.containerId == 268246 || wng_pageInfo.containerId == 268271 ||
      //       wng_pageInfo.containerId == 268311 || wng_pageInfo.containerId == 268510 ||
      //     wng_pageInfo.containerId == 268316 || wng_pageInfo.containerId == 298887 ){
          $wn('#DisplaySizeId-7 > ul > li.wnItem.feature').each(function(){
            $wn(this).find(' > div.wnContent.summaryImage').insertBefore($wn(this).find('> h4.wnContent.headline').first());
            $wn(this).find(' > div.wnContent.summaryImage').css('border', 'none');
            $wn(this).find(' > div.wnContent.summaryImage').css('width', '170px');
            $wn(this).find(' > div.wnContent.summaryImage').css('height', '96px');
            $wn(this).find('> div.wnContent.summaryImage > a > img').css('width', '170px');
            $wn(this).find('> div.wnContent.summaryImage > a > img').css('height', '96px');
          });
      // }
    }


}

/**
 * When body is starting to render
 * 1. Hide original/in-build content
 * 2. Pre-populate data for rendering when body rendering is done
 */
Worldnow.EventMan.event('bodystart', function () {
    if (!isPromotion1) {
        if (!wng_pageInfo.containerClass == 'story') {
            $wn('#WNAffRFDTV').hide();
        }
    }
});
/**
 * col4 is ready to serve
 */
Worldnow.EventMan.event('WNCol4done', function () {
    if (!isPromotion1) {
        /* weather page */
        if (url.indexOf('/weather') > -1) {
            CDEVRFDTV.redesignWeartherNewOrBlogAndMeetTheTeam();
        }
        if (url.indexOf('/news') > -1 || url.indexOf('/category/274535') > -1) {
            CDEVRFDTV.meetTheTeam();
        }
        if ((wng_pageInfo.containerClass === 'story') && (window.location.href.indexOf('story/22867419') == -1)) {
            CDEVRFDTV.mostPopularBlock();

        }
        CDEVRFDTV.moveAds(52, '252', 'WNCol4', 'append');
        CDEVRFDTV.socialIcons('WNCol4');
        CDEVRFDTV.headlineBoxCol4ID68();
    }

});

/**
 * Col23 is ready to serve
 */
Worldnow.EventMan.event('wncol23done', function () {
    if (!isPromotion1) {
        // Pre-populate html for schedule
        $wn(scheduleDiv).prependTo($wn('#WNHeader'));

        // Home page
        if (wng_pageInfo.containerClass === 'home') {
            CDEVRFDTV.cleanHomePage();
        }

        // Category
        if (wng_pageInfo.containerType === 'C') {
            $wn('#DisplaySizeId80').html("");
        }
        // weather page
        CDEVRFDTV.weatherPage();

    } else { // if the page is Promotion 1 so remove CSS
        $wn('link[href="//ftpcontent.worldnow.com/professionalservices/clients/rfdtv/custom-dua1.css"]').remove();
        $wn('link[href="/professionalservices/clients/rfdtv/custom-dua1.css"]').remove();
        $wn('link[href="/professionalservices/clients/rfdtv/custom.css"]').remove();
    }


});

/**
 * Body is done
 * 1. Show custom/populated data
 */
Worldnow.EventMan.event('bodydone', function () {
    if (!isPromotion1) {
        // western sport
        if (url.indexOf('category/274535') > -1) {
            CDEVRFDTV.westernSport();
        }
        $wn('#WNAffRFDTV').show();
        // CDEVRFDTV.promoAre();
        CDEVRFDTV.col4weather();
        CDEVRFDTV.brandingAndNavigation();
        CDEVRFDTV.other();
        CDEVRFDTV.footer(); /* footer must run before forMobileDesign */
        CDEVRFDTV.forMobileDesign();
        CDEVRFDTV.schedule();
        // news page : insert here because when text show on page -> ellipsis can cut text
        CDEVRFDTV.newsPage();

        if ((wng_pageInfo.containerClass === 'story')) {
            CDEVRFDTV.styleSingleStories(); //style for singleStories
        }
        if ((window.location.href.indexOf('story/22867419') == -1) && wng_pageInfo.containerType == 'S') {
            CDEVRFDTV.moreNewsBlock(); //make more news block data
        }

        // show sideshow at footer
        CDEVRFDTV.slideshowHighlightBlock();
        if (wng_pageInfo.isMobile) {
            $wn('<div id="wnad-term" style="margin-top: 35px; margin-bottom: -15px;"></div>').insertAfter($wn('#WNHeader'));
            $wn('#WNAd103').remove();
            // CDEVRFDTV.moveAds(106, '106', 'wnad-term', 'append');
            // CDEVRFDTV.moveAds(105, '103', 'wnad-term', 'append');


        } else {
            /* event page */
            $wn('<div id="wnad-term" style="margin-top: 35px; margin-bottom: -15px;"></div>').insertAfter($wn('#WNHeader'));
            if (wng_page_containerType == 'S') {
                CDEVRFDTV.moveAds(41, '246', 'wnad-term', 'append');
            } else {
                if ($('#WNAd46').length > 0)
                    CDEVRFDTV.moveAds(46, '246', 'wnad-term', 'append');
                else {
                    if ($('#WNAd41').length > 0)
                        CDEVRFDTV.moveAds(41, '241', 'wnad-term', 'append');
                }
            }
        }
        if ((wng_pageInfo.containerClass === 'story') && (window.location.href.indexOf('story/22867419') == -1)) {
            CDEVRFDTV.footerMenuBlock(); //make footer menu block
        }
        CDEVRFDTV.stylingWallpaperAD();
        CDEVRFDTV.styleProgramming();
    }



});
window.onload = function () {
    // $wn('#DisplaySizeId7 div.headline:eq(1)').hide();
}

/**
 * Populate data when document is ready
 */
Worldnow.EventMan.event('documentready', function () {
    if (!isPromotion1) {

        if (wng_pageInfo.containerClass === 'home') {
            CDEVRFDTV.headlineBoxCol4ID78();
            CDEVRFDTV.renderHomePage();
            $wn('#DisplaySizeId78 > ul > li.wnItem.feature> div.timestamps.wnDate').hide();
        }
        // event scroll bar
        if (wng_pageInfo.isMobile) {
            $wn(document).scroll(function (event) {
                var pos = $wn(document).scrollTop();
                if (pos > 120) {
                    $wn('#WNHeader').css('height', '266px');
                    $wn('#WNBranding').addClass('top-navigation-bar');
                    // $wn('#div-full-schedule').hide();
                    $wn('.tickercontainer').hide();
                } else if (pos <= 120 && $wn('#WNBranding').css('position') == 'fixed') {
                    $wn('#WNBranding').removeClass('top-navigation-bar');
                    // $wn('#div-full-schedule').show();
                    $wn('.tickercontainer').show();
                    // CDEVRFDTV.schedule();
                }
            });
        } else {
            $wn(document).scroll(function (event) {
                var pos = $wn(document).scrollTop();
                var posBrading = $wn('#WNBranding').position().top;
                if (pos > posBrading) {
                    $wn('#branding-hide-menu').addClass('top-navigation-bar');
                    $wn('#WNBranding').css('visibility', 'hidden');
                    //$wn('#div-full-schedule').hide();
                    $wn('.tickercontainer').hide();

                    $wn('#branding-hide-menu').show();
                } else {
                    $wn('#branding-hide-menu').removeClass('top-navigation-bar');
                    // $wn('#div-full-schedule').show();
                    $wn('#WNBranding').css('visibility', 'visible');
                    $wn('.tickercontainer').show();
                    $wn('#branding-hide-menu').hide();
                    // CDEVRFDTV.schedule();
                }
            });
        }
    }

    if (wng_pageInfo.isMobile) {
        $wn('#DisplaySizeId7').prependTo('#WNRemoveBypassSection');
        $wn('#DisplaySizeId7').css('padding-bottom', '20px', 'important');
    }

});

$(window).load(function () {

    if (isPromotion1) {
        // fix on IE
        $wn('#WNDS70').css({
            'left': 'initial',
            'right': '0',
            'bottom': '14px',
            'top': 'initial',
            'height': '200px',
            'width': '648px',
            'left': '320px',
            'top': '25px'
        });
        $wn('#WNAffRFDTV > img.bg-image').attr('src', 'http://ftpcontent.worldnow.com/professionalservices/clients/rfdtv/images/TheAmericanHomePageTransparent.png');
        //fix footer at THE AMERICAN HOME PAGE
        $wn('#WNCopyright').css({
            'width': '980px',
            'display': 'block',
            'margin': '0px auto'
        });

        $wn('#WNCopyright > table > tbody > tr > td:nth-child(1)').hide();

        $wn('#csFooterBottomText').css({
            'width': '100%',
            'margin-left': '0px'
        });

        $wn('#WNCopyright > table > tbody > tr > td:nth-child(2) > div > div > div > div.menu-items > section > nav > a > img').css({
            'margin-top': '10px'
        });

        $wn('#WNSearchBox-headertop > form > input.wnQueryText').css({
            'margin-left': '-57px',
            'margin-top': '15px',
            'color': '#000',
            'width': '260px'
        });

        $wn('#WNCopyright > table > tbody > tr > td:nth-child(2) > div > div > div > div.section.search-box > ul').css({
            'padding': '0',
            'margin': '0',
            'width': '265px',
            'text-align': 'left'
        });
    }
});
