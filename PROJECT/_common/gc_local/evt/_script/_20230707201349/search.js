var headerSearch={unifiedSearchPC:function(){$("body").removeClass("fixed-scroll is-mo")},unifiedSearchMo:function(){$("body").removeClass("is-pc");var val=$(".unified-search-input-inner .inp").val();if(val.length<1)$(".unified-search-layer.type-keyword").show()},uinifiedSearchControl:function(){var that=this,winW=$(window).width();if(winW>800)that.unifiedSearchPC();else that.unifiedSearchMo()},unifiedSearchClear:function(){var searchWrap=$(".unified-search-input-inner"),searchInp=searchWrap.find(".inp"),
searchClear=searchWrap.find(".btn-inp-clear");searchInp.on("change keyup paste",function(){var val=$(this).val();if(val.length){searchClear.show();$(".inp-placeholder").hide()}else{searchClear.hide();$(".inp-placeholder").show()}})},eventListener:{uinifiedSearchOpen:function(){$("#gnbmask").remove();$(".gnbMenu > ul > li > a").attr("aria-selected","false");$(".gnbMenu > ul > li > a").removeClass("open");$(".s-gnbSubWrap").slideUp(0);$(".s-gnb-depth-2 li").removeClass("on").find("button").removeClass("selected");
$("#header").removeClass("active");var that=headerSearch,winW=$(window).width();$(".unified-search-input-wrap").addClass("is-active");if(!$("body").children().is(".page-dimmed"))$("body").append("<div class='page-dimmed'></div>");if(winW>800){that.unifiedSearchPC();$("body").addClass("fixed-scroll is-pc")}else{that.unifiedSearchMo();$("body").addClass("fixed-scroll is-mo")}},uinifiedSearchClose:function(){$(".unified-search-input-wrap").removeClass("is-active");$("body").removeClass("is-pc is-mo");
$(".unified-search-layer").hide();$("body").removeClass("fixed-scroll");$("#gnbmask").hide();$(".unified-search-input-wrap .inp").val("");$(".unified-search-input-wrap .btn-inp-clear").hide();$(".inp-placeholder").show();$(".header-right .link-search").focus();
//if(isSecApp()=="true")window.secapp.showAndHideGnb("VISIBLE")
},uinifiedSearchInp:function(){$(".unified-search-layer.type-auto").hide();var val=$(".unified-search-input-inner .inp").val();if(val.length<1)$(".unified-search-layer.type-keyword").show()},
unifiedSearchInpClear:function(){var searchWrap=$(".unified-search-input-inner"),searchInp=searchWrap.find(".inp"),searchClear=searchWrap.find(".btn-inp-clear");searchInp.val("");searchClear.hide();$(".unified-search-layer.type-auto").hide();$(".unified-search-layer.type-keyword").show();$(".inp-placeholder").show()},initEventListener:function(){var that=this,unifiedSearchEventId=".unifiedSearchEvent";$("#header").off(unifiedSearchEventId);$(".unified-search-input-wrap").off(unifiedSearchEventId);
$("#header").on("click"+unifiedSearchEventId,".link-search",that.uinifiedSearchOpen);$(".unified-search-input-wrap").on("click"+unifiedSearchEventId,".btn-close-search",that.uinifiedSearchClose);$(document).on("click"+unifiedSearchEventId,".page-dimmed",that.uinifiedSearchClose);$(".unified-search-input-wrap").on("click"+unifiedSearchEventId,".btn-inp-clear",that.unifiedSearchInpClear)},uinifiedSearchKeyword:function(){$(".unified-search-layer.type-keyword").hide()},uinifiedSearchChange:function(){var that=
headerSearch;that.eventListener.uinifiedSearchKeyword()}},init:function(){var that=this;that.unifiedSearchClear();that.eventListener.initEventListener()}};$(document).ready(function(){searchInputManager.init();headerSearch.init();$("#unifiedInputSearch").on("keypress",function(e){if(e.keyCode!=13)return;$("#unifiedSearchButton").trigger("click")})});$(window).resize(function(){if($(".unified-search-input-wrap").hasClass("is-active"))headerSearch.uinifiedSearchControl()});
var wnAddonParamVo=function(query,target,range,collection,datatype,convert){if(query!="")this.query=query;if(target!="")this.target=target;if(range!="")this.range=range;if(collection!="")this.collection=collection;if(datatype!="")this.datatype=datatype;if(convert!="")this.convert=convert};
var WNSearchParamVo=function(query,startCount,collection,sort,pageSize,setMaxPrice,setMinPrice,maxPrice,minPrice,siteCd,searchField,documentField,exQuery,siteName,useMobileYN,isBestMatchYn,useSuggestQueryYN,isFilterSet,isFilter1stSet,isFilter2ndSet,isProductSearchAllTab,currentPage,isTriggeredByTab,incl,excl){if(query!="")this.query=query;if(startCount!="")this.startCount=startCount;if(collection!="")this.collection=collection;if(sort!="")this.sort=sort;if(pageSize!="")this.pageSize=pageSize;if(setMaxPrice!=
"")this.setMaxPrice=setMaxPrice;if(setMinPrice!="")this.setMinPrice=setMinPrice;if(maxPrice!="")this.maxPrice=maxPrice;if(minPrice!="")this.minPrice=minPrice;if(siteCd!="")this.siteCd=siteCd;if(searchField!="")this.searchField=searchField;if(documentField!="")this.documentField=documentField;if(exQuery!="")this.exQuery=exQuery;if(siteName!="")this.siteName=siteName;if(useMobileYN!="")this.useMobileYN=useMobileYN;if(isBestMatchYn!="")this.isBestMatchYn=isBestMatchYn;if(useSuggestQueryYN!="")this.useSuggestQueryYN=
useSuggestQueryYN;if(isFilterSet!="")this.isFilterSet=isFilterSet;if(isFilter1stSet!="")this.isFilter1stSet=isFilter1stSet;if(isFilter2ndSet!="")this.isFilter2ndSet=isFilter2ndSet;if(isProductSearchAllTab!="")this.isProductSearchAllTab=isProductSearchAllTab;if(currentPage!="")this.currentPage=currentPage;if(isTriggeredByTab!="")this.isTriggeredByTab=isTriggeredByTab;if(incl!="")this.incl=incl;if(excl!="")this.excl=excl};
function searchDatetimestampToString(timestamp){var d=new Date(timestamp),month=""+(d.getMonth()+1),day=""+d.getDate();if(month.length<2)month="0"+month;if(day.length<2)day="0"+day;return[month,day].join("-")}var Pager=function(){};
Pager.prototype={init:function(options){this.initialize=true;this.data=setDefaultIfNull(options.data,{});this.pageSize=setDefaultIfNull(options.data.pageSize,options.pageSize);this.blockSize=options.blockSize;this.totalCount=setDefaultIfNull(options.totalCount,0);this.pagingHtmlTag=options.pagingHtmlTag;this.pagingHtml=options.pagingHtml;this.appendingTargetHtml=options.appendingTargetHtml;this.paginationHtml=options.paginationHtml;this.paginationTargetHtml=options.paginationTargetHtml;this.paginationWingBarHtml=
options.paginationWingBarHtml;this.firstBtnClass=options.firstBtnClass;this.prevBtnClass=options.prevBtnClass;this.nextBtnClass=options.nextBtnClass;this.lastBtnClass=options.lastBtnClass;this.callback=options.callback},setCurrentStatus:function(currentPage){var that=this;that.pageGroupCount=Math.ceil(that.totalCount/(that.pageSize*that.blockSize));that.pageGroup=Math.floor((currentPage-1)/that.blockSize)+1;that.lastPage=Math.ceil(that.totalCount/that.pageSize);that.groupFirstPage=parseInt((that.pageGroup-
1)*that.blockSize+1);that.groupLastPage=that.groupFirstPage+that.getGroupPageCount()-1;that.prevGroupPage=that.groupFirstPage-1;that.nextGroupPage=that.groupLastPage+1},getStartCount:function(){var that=this;that.currentPage=that.currentPage==undefined?1:that.currentPage;if(that.currentPage==1)return 0;return that.pageSize*(that.currentPage-1)},getGroupPageCount:function(){var that=this;if(that.pageGroup*5<that.lastPage)return that.blockSize;return that.lastPage-(that.pageGroup-1)*that.blockSize},
getPageGroup:function(currentPage,blockSize){return Math.floor((currentPage-1)/blockSize)+1},getPage:function(currentPage){var that=this;$(that.paginationTargetHtml+" .active").removeClass("active");$(that.paginationTargetHtml+" a").css("cursor","");that.setCurrentStatus(currentPage);if(that.totalCount==0)$(that.paginationTargetHtml).empty();if(parseInt(that.lastPage)+1<=currentPage)return;that.currentPage=currentPage;that.data.startCount=that.getStartCount();if(that.initialize){that.initialize=false;
that.drawPagingBar(currentPage)}$(that.paginationTargetHtml+' [page="'+currentPage+'"]').addClass("active");$(that.paginationTargetHtml+' [page="'+currentPage+'"] a').css("cursor","default");$(that.paginationTargetHtml+" a").off("click").on("click",function(e){var $target=$(e.target),pageNum=$target.text();pager.isPagingDataSet=true;that.getPage(pageNum);that.callAjax();$("html").scrollTop($(that.appendingTargetHtml).offset().top-$("div.sticty-searchbar-inner").height())});$(that.paginationTargetHtml+
' [page="'+currentPage+'"] a').off("click")},callAjax:function(){this.callback()},getWingPage:function(currentPage){var that=this;that.initialize=false;that.drawPagingBar(currentPage);that.getPage(currentPage);that.callAjax();$("html").scrollTop($(that.appendingTargetHtml).offset().top-$("div.sticty-searchbar-inner").height())},drawWingBar:function(currentPage){var that=this;$(that.paginationWingBarHtml).removeClass("disable");$(that.paginationWingBarHtml).removeAttr("page");if(currentPage==1||that.pageGroup==
1){$(that.paginationHtml+that.firstBtnClass).addClass("disable");$(that.paginationHtml+that.prevBtnClass).addClass("disable")}else{$(that.paginationHtml+that.firstBtnClass).attr({"page":1});$(that.paginationHtml+that.prevBtnClass).attr({"page":that.prevGroupPage})}if(currentPage==that.lastPage||that.pageGroup==that.pageGroupCount){$(that.paginationHtml+that.nextBtnClass).addClass("disable");$(that.paginationHtml+that.lastBtnClass).addClass("disable")}else{$(that.paginationHtml+that.nextBtnClass).attr({"page":that.nextGroupPage});
$(that.paginationHtml+that.lastBtnClass).attr({"page":that.lastPage})}$(that.paginationWingBarHtml).off("click").on("click",function(e){var $span=$(e.target).parent(),pageNum=$span.attr("page");if(pageNum==undefined)return;pager.isPagingDataSet=true;pager.getWingPage(pageNum)})},drawPagingBar:function(currentPage){var that=this;that.setCurrentStatus(currentPage);that.drawWingBar(currentPage);$(that.paginationTargetHtml).empty();for(var i=that.groupFirstPage;i<=that.groupLastPage;i++){var $pagingHtml=
$(that.pagingHtml);$pagingHtml.attr("page",i);var $page=$pagingHtml.children("a"),$pagingHtmlTag=$(that.pagingHtmlTag);$page.text(i);$pagingHtmlTag.append($pagingHtml);$(that.paginationTargetHtml).append($pagingHtml)}}};