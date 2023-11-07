window.SINGLE_TAB = "  ";
window.ImgCollapsed = "./Collapsed.gif";
window.ImgExpanded = "./Expanded.gif";
window.QuoteKeys = true;
window.LinkKeys = false;
window.LinkKeys = false;
window.ShowFrist = false;
window.NullKeys = false;
window.ShowInLine = false;
window.SortKeys = false;
window.KeyField = null;
window.ShowField = null;
window.UnShowField = null;
window.FilterField = null;
window.IsCollapsible = true;


window.onload = function () {

	var s = getString("json");
	if (!s) {
		s = "{\"id\":259322,\"name\":\"books\",\"list\":[{\"id\":259321,\"name\":\"apple\",\"publisher\":null,\"author\":{\"name\":\"崧岳\",\"state\":\"active\",\"avatar_url\":\"https://const-x.github.io/htmls/json/logo-s.ico\",\"web_url\":\"https://git2.superboss.cc/songyue\"}},{\"id\":259320,\"name\":\"orange\",\"publisher\":\"AAA\",\"author\":{\"name\":\"崧岳\",\"state\":\"active\",\"avatar_url\":\"https://const-x.github.io/htmls/json/logo-s.ico\",\"web_url\":\"https://git2.superboss.cc/songyue\"}}]}"
	}
	$id("json_input").value = s;
}


function getString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(r[2]);
	return null;
}

function $id(id) {
	return document.getElementById(id);
}
function IsArray(obj) {
	return obj && typeof obj === 'object' && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
}
function LevelChanged() {
	var lv = $id("Level").value;
	CollapseLevel(lv)
}
function Process() {
	SetTab();
	//window.IsCollapsible = $id("CollapsibleView").checked;
	var json = $id("json_input").value;
	var html = "";
	window.KeyField = $id("keyfield").value;
	if(window.KeyField && window.KeyField !=""){
		window.KeyField = window.KeyField.split(' ');
	}else{
		window.KeyField = ["id"];
	}
	window.ShowField = $id("showfield").value;
	if(window.ShowField && window.ShowField !=""){
		window.ShowField = window.ShowField.split(' ');
	}
	window.UnShowField = $id("unShowfield").value;
	if(window.UnShowField && window.UnShowField !=""){
		window.UnShowField = window.UnShowField.split(' ');
	}
	window.FilterField = $id("filterfield").value;
	if(window.FilterField && window.FilterField !=""){
		window.FilterField = JSON.parse("{" + window.FilterField +"}");
		window.ctFilter = $id("ctFilter").checked;
	}
	try {
		if (json == "") json = "\"\"";
		var obj = eval("[" + json + "]");
		html = ProcessObject(obj[0],0,false,false,false,false);
		$id("Canvas").innerHTML = "<PRE class='CodeContainer'>" + html + "</PRE>";
	} catch(e) {
		$id("Canvas").innerHTML = "";
	}
}
window._dateObj = new Date();
window._regexpObj = new RegExp();
function ProcessObject(obj,indent,addComma,isArray,isPropertyContent,ignoreShowField) {
	var html = "";
	var comma = (addComma) ? "<span class='Comma'>,</span>":"";
	var type = typeof obj;
	var clpsHtml = "";
	if (IsArray(obj)) {
		if (obj.length == 0) {
			html += GetRow(indent,"<span class='ArrayBrace'>[]</span>" + comma,isPropertyContent);
		} else {
			var keyValue = "<label class='keyValue' onselectstart='return false' >"+obj.length+"</label>";
			clpsHtml = window.IsCollapsible ? "<span><img src=\"" + window.ImgExpanded + "\" onClick=\"ExpImgClicked(this)\" />"+keyValue+"</span><span class='collapsible'>":"";
			html += GetRow(indent,"<span class='ArrayBrace'>[</span>" + clpsHtml,isPropertyContent);
			for (var i = 0; i < obj.length; i++) {

				var sub = obj[i];
				if(!sub && window.NullKeys){
					continue;
				}

				var ignoreSubShowField =false;
				if(window.ShowField && !ignoreShowField){
					var subtype = typeof sub;
					if (subtype == "object") {
						if (window.ShowField && window.ShowField.indexOf(prop) != -1) {
							ignoreSubShowField =true;
						}else {
							if(!containsKey(sub,window.ShowField)){
								continue;
							}
						}
					}else if(!IsArray(sub)){
						if (window.ShowField && window.ShowField.indexOf(prop) == -1){
							continue;
						}
					}
				}
				html += ProcessObject(sub,indent + 1,i < (obj.length - 1),true,false,ignoreShowField);
			}
			clpsHtml = window.IsCollapsible ? "</span>":"";
			html += GetRow(indent,clpsHtml + "<span class='ArrayBrace'>]</span>" + comma);
		}
	} else if (type == 'object') {
		if (obj == null) {
			html += FormatLiteral("null","",comma,indent,isArray,"Null");
		} else if (obj.constructor == window._dateObj.constructor) {
			html += FormatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString() + "*/","",comma,indent,isArray,"Date");
		} else if (obj.constructor == window._regexpObj.constructor) {
			html += FormatLiteral("new RegExp(" + obj + ")","",comma,indent,isArray,"RegExp");
		} else {
			var numProps = 0;
			for (var prop in obj) numProps++;
			if (numProps == 0) {
				html += GetRow(indent,"<span class='ObjectBrace'>{ }</span>" + comma,isPropertyContent);
			} else {
				var keys = jsonSort(obj);
				var keyValue = "";
				var filter = "";
				var ObjectBrace = "ObjectBrace";
				var Expanded = "<img src=\"" + window.ImgExpanded + "\" onClick=\"ExpImgClicked(this)\" />";
				var collapsible = '';
				var filted = false;
				if(window.FilterField && incluedKey(keys,Object.keys(window.FilterField))){
					for (var key in window.FilterField){
						var eql = obj[key] == window.FilterField[key];
						if(ctFilter){
							eql = !eql;
						}
						if(!eql){
							filter += (" " +key+":"+ obj[key]);
							filted = true;
						}
					}
				}
				if(filted){
					ObjectBrace = "ObjectBraceFilted";
					Expanded= "<img src=\"" + window.ImgCollapsed + "\" onClick=\"ExpImgClicked(this)\" />";
					filter = "<label class='filterValue' onselectstart='return false' style='display:inline;visibility:visible;' >"+filter+"</label>";
					collapsible  = "style='display:none;'"
				}
				if(window.KeyField){
					for (var inx in window.KeyField){
						var key = window.KeyField[inx];
						if(obj[key]){
							keyValue += (" " +key+":"+ obj[key]);
						}
					}
					keyValue = "<label class='keyValue' "+(filted?"style='display:inline;visibility:visible;'":"")+" onselectstart='return false' >"+keyValue+"</label>";
				}
				
				clpsHtml = window.IsCollapsible ? "<span>"+Expanded+ keyValue+filter
						+"</span><span class='collapsible' "+collapsible+">":"";
				html += GetRow(indent,"<span class='"+ObjectBrace+"'>{</span>" + clpsHtml,isPropertyContent);

				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var sub = obj[prop];
					if(!sub && window.NullKeys){
						continue;
					}

					var ignoreSubShowField =false;

					var unShowField = false;

					window.ShowFrist

					if(window.UnShowField){
						if(window.UnShowField.indexOf(prop) !== -1){
							unShowField  = true;
						}
					}

					if(window.ShowField){
						var subtype = typeof sub;
						if (subtype == "object") {
							if (ignoreShowField) {
								ignoreSubShowField =ignoreShowField;
							}else if (window.ShowField && window.ShowField.indexOf(prop) != -1) {
								ignoreSubShowField =true;
							}else {
								if(!containsKey(sub,window.ShowField)){
									continue;
								}
							}
						}else {
							if (!ignoreShowField && window.ShowField.indexOf(prop) == -1 ){
								continue;
							}
						}

						if(!window.ShowFrist && unShowField){
							continue;
						}
					}else{
						if(unShowField){
							continue;
						}
					}

					var style = "PropertyName"
					if(window.ShowField && window.ShowField.indexOf(prop) != -1
						|| window.KeyField && window.KeyField.indexOf(prop) != -1 ){
						style = "PropertyShow";
					}

					var quote = window.QuoteKeys ? "\"":"";
					var last = i == numProps-1;
					html += GetRow(indent + 1,"<span class='"+style+"'>" + quote + prop + quote + "</span>:" + ProcessObject(sub,indent + 1,!last,false,true,ignoreSubShowField));
				}
				clpsHtml = window.IsCollapsible ? "</span>":"";
				html += GetRow(indent,clpsHtml + "<span class='"+ObjectBrace+"'>}</span>" + comma,false);
			}
		}
	} else if (type == 'number') {
		html += FormatLiteral(obj,"",comma,indent,isArray,"Number");
	} else if (type == 'boolean') {
		html += FormatLiteral(obj,"",comma,indent,isArray,"Boolean");
	} else if (type == 'function') {
		if (obj.constructor == window._regexpObj.constructor) {
			html += FormatLiteral("new RegExp(" + obj + ")","",comma,indent,isArray,"RegExp");
		} else {
			obj = FormatFunction(indent,obj);
			html += FormatLiteral(obj,"",comma,indent,isArray,"Function");
		}
	} else if (type == 'undefined') {
		html += FormatLiteral("undefined","",comma,indent,isArray,"Null");
	} else {
		html += handleString(obj,comma,indent,isArray);
	}
	return html;
}

function incluedKey(keys,arr){
	for (var idx in keys){
		if(arr.indexOf(keys[idx]) != -1){
			return true;
		}
	}
	return false;
}

function handleString(obj,comma,indent,isArray) {
	if (window.LinkKeys) {
		var content = obj.toString().split("\\").join("\\\\").split('"').join('\\"');
        var isUrl = false;
		if(content.indexOf('http://') >= 0 ||　content.indexOf('https://') >= 0　){
			isUrl = true;
		}
		if (isUrl) {
			var str;
			if(endwith(content,"jpg") || endwith(content,"JPG") || endwith(content,"png") || endwith(content,"PNG") || endwith(content,"gif") || endwith(content,"GIF")
			|| endwith(content,"jpeg") || endwith(content,"JPEG") || endwith(content,"bmp") || endwith(content,"BMP") || endwith(content,"tga") || endwith(content,"TGA")
				|| endwith(content,"ico") || endwith(content,"ICO")
			){
                str = "<span class='image'><image src='" + content + "' /></span>";
			}else{
			    str = "<span class='href'><a target='_blank'   href='" + content + "'>\"" + content + "\"</a>" + comma + "</span>";
			}
			if (isArray) {
				return GetRow(indent,str);
			} else {
				return str;
			}
		} else {
			return FormatLiteral(obj,"\"",comma,indent,isArray,"String");
		}
	} else {
		return FormatLiteral(obj,"\"",comma,indent,isArray,"String");
	}
}

function jsonSort(jsonObj) {
    let arr = [];
    for (var key in jsonObj) {
        arr.push(key)
    }
    if(window.SortKeys){
    	arr.sort();
    }
    return arr;
}

function containsKey(jsonObj,targets) {
	var keys = jsonSort(jsonObj)
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		if(targets.indexOf(key) !== -1){
			return true;
		}
		obj = jsonObj[key];
		var type = typeof obj;
		if (IsArray(obj)) {
			if (obj.length > 0) {
				for (var j = 0; j < obj.length;j++) {
					if (containsKey(obj[j],targets)){
						return true;
					}
				}
			}
		} else if (type == 'object') {
			if (containsKey(obj,targets)){
				return true;
			}
		}
	}
	return false;
}

    
function FormatLiteral(literal,quote,comma,indent,isArray,style) {
	if (typeof literal == 'string') literal = literal.split("<").join("&lt;").split(">").join("&gt;");
	var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
	if (isArray) str = GetRow(indent,str);
	return str;
}
function FormatFunction(indent,obj) {
	var tabs = "";
	for (var i = 0; i < indent; i++) tabs += window.TAB;
	var funcStrArray = obj.toString().split("\n");
	var str = "";
	for (var i = 0; i < funcStrArray.length; i++) {
		str += ((i == 0) ? "":tabs) + funcStrArray[i] + "\n";
	}
	return str;
}
function GetRow(indent,data,isPropertyContent) {
   if(window.ShowInLine){
   		return data;
   }
	var tabs = "";
	for (var i = 0; i < indent && !isPropertyContent; i++) tabs += window.TAB;
	if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n"  ){
		if( isPropertyContent == undefined || isPropertyContent){
			data = data + "\n";
		}else{
			data = data + "\n";
		}
	} 
	return tabs + data;
}
function CollapsibleViewClicked() {
	Process();
}

function AdviceViewClicked() {
	var checked = $id("adviceView").checked
	$id("CollapsibleViewDetail").style.display = checked ? "":"none";
	if(!checked){
		$id("NullKeys").checked = false;
		window.NullKeys = false;
		$id("LinkKeys").checked = false;
		window.LinkKeys = false;
		$id("SortKeys").checked = false;
		window.SortKeys = false;
		Process();
	}
}

function QuoteKeysClicked() {
	window.QuoteKeys = $id("QuoteKeys").checked;
	Process();
}
function NullKeysClicked() {
	window.NullKeys = $id("NullKeys").checked;
	Process();
}
function LinkKeysClicked() {
	window.LinkKeys = $id("LinkKeys").checked;
	Process();
}
function SortKeysClicked() {
	window.SortKeys = $id("SortKeys").checked;
	Process();
}
function ShowFristClicked() {
	window.ShowFrist = $id("showFrist").checked;
	Process();
}

function endwith(str,end){
	var d=str.length-end.length;
    return (d>=0&&str.lastIndexOf(end)==d)
}

function CollapseAllClicked() {
	EnsureIsPopulated();
	TraverseChildren($id("Canvas"),
	function(element) {
		if (element.className == 'collapsible') {
			MakeContentVisible(element,false);
		}
	},
	0);
}
function ExpandAllClicked() {
	EnsureIsPopulated();
	TraverseChildren($id("Canvas"),
	function(element) {
		if (element.className == 'collapsible') {
			MakeContentVisible(element,true);
		}
	},
	0);
}
function MakeContentVisible(element,visible) {
	var img = element.previousSibling.firstChild;
	var lable = element.previousSibling.lastElementChild;
	if ( !! img.tagName && img.tagName.toLowerCase() == "img") {
		element.style.display = visible ? 'inline':'none';
		element.previousSibling.firstChild.src = visible ? window.ImgExpanded:window.ImgCollapsed;
	}
	if(lable){
		lable.style.display= visible ? 'none':'inline' ;
		lable.style.visibility= visible ? 'hidden':'visible' ;
	}
}
function TraverseChildren(element,func,depth) {
	for (var i = 0; i < element.childNodes.length; i++) {
		TraverseChildren(element.childNodes[i],func,depth + 1);
	}
	func(element,depth);
}
function ExpImgClicked(img) {
	var container = img.parentNode.nextSibling;
	if (!container) return;
	var disp = "none";
	var src = window.ImgCollapsed;
	var lable = img.nextSibling;
	
	if (container.style.display == "none") {
		disp = "inline";
		src = window.ImgExpanded;
		if(lable){
			lable.style.display= 'none';
			lable.style.visibility= 'hidden' ;
		}
	}else{
		if(lable){
			lable.style.display= 'inline';
			lable.style.visibility= 'visible' ;
		}
	}
	container.style.display = disp;
	img.src = src;
}
function CollapseLevel(level) {
	EnsureIsPopulated();
	TraverseChildren($id("Canvas"),
	function(element,depth) {
		if (element.className == 'collapsible') {
			if (depth >= level) {
				MakeContentVisible(element,false);
			} else {
				MakeContentVisible(element,true);
			}
		}
	},
	0);
}
function TabSizeChanged() {
	SetTab();
	Process();
}
function SetTab() {
	var select = $id("TabSize");
	var val = parseInt(select.options[select.selectedIndex].value)
	window.TAB = MultiplyString(val,window.SINGLE_TAB);
	if(-1 == val){
   	window.ShowInLine = true;
	window.IsCollapsible = false;
   }else{
   	window.ShowInLine = false;
	window.IsCollapsible = true;
   }
}
function EnsureIsPopulated() {
	if (!$id("Canvas").innerHTML && !!$id("json_input").value) Process();
}
function MultiplyString(num,str) {
	var sb = [];
	for (var i = 0; i < num; i++) {
		sb.push(str);
	}
	return sb.join("");
}
function SelectAllClicked() {
	if ( !! document.selection && !!document.selection.empty) {
		document.selection.empty();
	} else if (window.getSelection) {
		var sel = window.getSelection();
		if (sel.removeAllRanges) {
			window.getSelection().removeAllRanges();
		}
	}
	var range = ( !! document.body && !!document.body.createTextRange) ? document.body.createTextRange() :document.createRange();
	if ( !! range.selectNode) range.selectNode($id("Canvas"));
	else if (range.moveToElementText) range.moveToElementText($id("Canvas"));
	if ( !! range.select) range.select($id("Canvas"));
	else window.getSelection().addRange(range);
}
function ClearAllClicked() {
	$id("keyfield").value = '';
	$id("showfield").value= '';
	$id("filterfield").value= '';
	$id("unShowfield").value= '';
}

function ConvertStr2Json() {
	var json = $id("json_input").value;

	if(json){
		if(json.charAt(0) == "\""){
			json = json.substring(1);
		}
		if(json.charAt(json.length - 1) == "\""){
			json = json.substring(0,json.length - 1);
		}
		var res = json.replaceAll("\\\"", "\"");
		$id("json_input").value= res;
	}
}


function  showfieldChanged(){
	var val = $id("showfieldselect").value;
	$id("showfield").value = val;
}

function LinkToJson() {
	var val = $id("json_input").value;
	val = escape(val.split('/n').join(' ').split('/r').join(' '));
	$id("InvisibleLinkUrl").value = val;
	$id("InvisibleLink").submit();
}
