import { PT_STATE, util as _} from './bs_common';

// 단일쿠폰 다운로드 및 페이지 내 전체쿠폰 다운로드
export const coupon = {
    init(){
        // 쿠폰 기한 설정
        var couponLimit = '2022.03.31';

        var messager = {
            data: {
                content: '',
                btnText: '확인',
                okBtnText: '확인',
                cancelBtnText: '취소'
            },
            setAlertData: function (content, btnText, callback) {
                messager.data.content = content;
                messager.data.btnText = btnText;
                if (callback != undefined) {
                    messager.data.callback = callback;
                } else {
                    delete messager.data[callback];
                }
            },
            setConfirmData: function (content, okBtnText, cancelBtnText, callback) {
                messager.data.content = content;
                messager.data.okBtnText = okBtnText;
                messager.data.cancelBtnText = cancelBtnText;
                if (callback != undefined) {
                    messager.data.callback = callback;
                } else {
                    delete messager.data[callback];
                }
            },
            alert: function (content, btnText, callback) {
                messager.setAlertData(content, btnText, callback);
                commonAlert(messager.data);
                openLayer('commonAlert');
            },
            confirm: function (content, okBtnText, cancelBtnText, callback) {
                messager.setConfirmData(content, okBtnText, cancelBtnText, callback);
                commonConfirm(messager.data);
                openLayer('commonConfirm');
            },
            // 단일 쿠폰 다운로드 실패
            singleCouponDownloadFailAlert: function (content) {
                messager.alert(content, '확인', function () {
                    $('html').scrollTop(0);
                });
            },
            // 예외 처리 없는 다운로드 성공
            mustCouponDownloadSuccessAlert: function () {
                var content = '';
                content += '쿠폰 다운로드가 완료 되었습니다.<br/>';
                content += '* '+ couponLimit +' 까지 사용가능<br/><br/>';
                content += '다운로드 받으신 쿠폰은 나의 정보 > 쿠폰존 에서 확인 가능합니다.';
                messager.alert(content, '확인');
                // messager.alert(content, '확인', function() {
                //   window.location.href = '${view.stContextPath}' + 'mypage/coupon/indexCouponDownload/';
                // });
            },
            // 쿠폰 등록 성공
            successInsertSerialCoupon: function () {
                var content = '';
                content += '쿠폰이 등록되었습니다.<br/>';
                content += '등록한 쿠폰은 보유쿠폰에서 확인 가능합니다.';
                messager.alert(content, '확인', function () {
                    $('#popupEventCode .con-bottom').hide();
                    $('#popupEventCode .pop-close').trigger('click');
                    $('html').scrollTop(0);
                });
            },
            //쿠폰 등록 실패
            failInsertSerialCoupon: function (content) {
                messager.alert(content, '확인', function () {
                    $('html').scrollTop(0);
                });
            }
        };

        function downloadCoupon(type, objCoupon) {
            returnUrl = window.location.pathname;
            stPath = $('#openPop').data('st-path');
            var options = {
                url: stPath + 'xhr/member/getSession',
                type: 'POST',
                done: function (data) {
                    var session = JSON.parse(data);
                    if (session.mbrNo == 0) {
                        makeAlert('로그인 후 참여 가능합니다.', fnGoLoginPage);
                    } else {
                        var url = '';
                        if (type === 'single') {
                            url = stPath + 'xhr/mypage/coupon/couponBookDownload';
                        }
                        if (type === 'multi') {
                            url = stPath + 'xhr/mypage/coupon/couponDownload';
                        }
                        var options = {
                            url: url,
                            data: objCoupon,
                            done: function (result) {
                                messager.mustCouponDownloadSuccessAlert();
                            }
                        };
                        ajax.call(options);
                    }
                }
            };
            ajax.call(options);
        }

        // 전체 쿠폰 다운로드 이벤트 트리거
        PT_STATE.$PROJECT.off('click.couponAll').on('click.couponAll', '[data-role="btnCouponAll"]', function (e) {
            e.preventDefault();

            var strArr = [];
            $('[data-role="btnCoupon"]').each(function (i) {
                strArr.push('{cpBookNo: \'' + $(this).attr('data-cpNum') + '\'}');
            });
            downloadCoupon('multi', { couponBookJsonStr: '[' + strArr.join(', ') + ']' });
        });

        // 단일 쿠폰 다운로드 이벤트 트리거
        PT_STATE.$PROJECT.off('click.coupon').on('click.coupon', '[data-role="btnCoupon"]', function (e) {
            e.preventDefault();
            downloadCoupon('single', { cpBookNo: $(this).attr('data-cpNum') });
        });
    }
}


// [프로모션 쿠폰 다운 SCRIPT]
export const promoCoupon = {
    init(){
        var userAgent=navigator.userAgent.toUpperCase();
        var isApp = false;
        var isAndroid = false;

        if( userAgent.indexOf("SECAPP") > -1){
            isApp = true;  //앱체크
        }

        //안드로이드 체크
        isAndroid = /Android/i.test(navigator.userAgent);

        //앱 바로가기 FUNC
        function appOpen() {
            var locationUrl = window.location.href;
            var appUrl = ('https://secandroidprd.page.link/?link=' + locationUrl + '&apn=com.samsung.sec.android.prd&afl=https://apps.samsung.com/appquery/appDetail.as?appId=com.samsung.sec.android.prd');//운영 url
            window.open(appUrl);
        }

        // 알럿 메세지 선언
        var messager = {
            data : {
                content : ""
                ,	btnText : "확인"
                ,	okBtnText : "확인"
                ,	cancelBtnText : "취소"
            }
            ,setAlertData : function(content,btnText,callback){
                messager.data.content = content;
                messager.data.btnText = btnText;
                if(callback != undefined){
                    messager.data.callback = callback;
                }else{
                    delete messager.data[callback] ;
                }
            }
            ,setConfirmData : function(content,okBtnText,cancelBtnText,callback){
                messager.data.content = content;
                messager.data.okBtnText = okBtnText;
                messager.data.cancelBtnText = cancelBtnText;
                if(callback != undefined){
                    messager.data.callback = callback;
                }else{
                    delete messager.data[callback] ;
                }
            }
            ,alert :  function(content,btnText,callback){
                messager.setAlertData(content,btnText,callback);
                commonAlert(messager.data);
                openLayer('commonAlert');
            }
            ,confirm : function(content,okBtnText,cancelBtnText,callback){
                messager.setConfirmData(content,okBtnText,cancelBtnText,callback);
                commonConfirm(messager.data);
                openLayer('commonConfirm');
            }
            // 단일 쿠폰 다운로드 실패
            ,singleCouponDownloadFailAlert : function(content){
                messager.alert(content,"확인");
            }
            // pc환경 전체 다운로드 성공
            ,pcOk : function(){
                var content =  "";
                content += "#YouMake 쿠폰이 발급되었습니다.<br/>";
                content += "App 전용 쿠폰은 <br/>삼성닷컴 App에서만 사용 가능합니다.<br/><br/>";
                content += "<p style='color: gray;'>*삼성닷컴 App-Android <br/>갤럭시 스토어에서 다운 가능</p>";
                messager.alert(content,"확인");
            }
            // 앱환경 전체 다운로드 성공
            ,appOk : function(){
                var content =  "";
                content += "#YouMake 쿠폰이 발급되었습니다.<br/>";
                content += "App 전용 쿠폰은 삼성닷컴 App에서만 사용 가능합니다.";
                messager.alert(content,"확인");
            }
            // 모바일환경 전체 다운로드 성공
            ,mobileOk : function(){
                var content =  "";
                content += "#YouMake 쿠폰이 발급되었습니다.<br/>";
                content += "App 전용 쿠폰은 삼성닷컴 App에서만 사용 가능합니다.<br/><br/>";
                content += "<p style='color: gray;'>*삼성닷컴 App-Android 갤럭시 스토어에서 다운 가능</p>";
                messager.confirm(content,"APP 바로가기","확인",function(){
                    appOpen();
                });
            }
        };
        //알럿메세지 END

        function PromotionCouponDown(couponNum){
            returnUrl = window.location.pathname;
            stPath = $('#openPop').data('st-path');
            var options = {
                url : stPath + "xhr/mypage/coupon/promotionCouponDownload",
                // 쿠폰 (단일/복수) 다운가능
                data : {cpNos:[couponNum]},
                done : function(result){
                    if (result.exCd === 'COP0024') {
                        makeAlert('로그인 후 다운 가능합니다.', fnGoLoginPage);
                    } else {
                        if(result.couponDownYn=="Y"){       //쿠폰다운받기 성공여부
                            if (isApp) {//App?
                                messager.appOk();
                            }else if (isAndroid) {//Android?
                                messager.mobileOk();
                            }else{//pc or IOS?
                                messager.pcOk();
                            }

                        }else{
                            messager.singleCouponDownloadFailAlert(result.exMsg);
                        }
                    }
                }
            };
            ajax.call(options);
        }   
        
        // 2023.09.01 Alex : buying,nav 에도 쿠폰번호가 2군데 들어가서 한번에 관리
        let arrCpNum2 = `
        26995, 26996, 26997, 26998, 26999, 27000, 27001, 27002, 27003, 27004, 27005, 27006, 27007, 27008, 27009, 27010, 27011, 27012, 27013, 27014, 27019, 27020, 27021, 27022, 27031, 27032, 27033, 27034, 27035, 27036, 27037, 27038, 27039, 27040, 27041, 27042, 26989, 26990, 26991, 26992, 26993, 26994, 26115, 26116, 26117, 26118, 26119, 26120, 26121, 27459, 27461, 27462, 27463, 27464, 27465, 27466, 27467, 27468, 27469, 27470, 27471, 27472, 27473, 27474, 27475, 27476, 27477, 27478, 27479, 27480, 27481, 27482, 27483, 27484, 27485, 27486, 27487, 27488, 27456, 27455, 27460, 27457, 26915, 26922, 26912, 26913, 26914, 26903, 26904, 26905, 26916, 26925, 26926, 26930, 26931, 26932, 26939, 27345, 26937, 26938, 26891, 26892, 26893, 26894, 26895, 26896, 27374, 27375, 27376, 27377, 27378, 27379, 27405, 27406, 27407, 27408, 27409, 27353, 27354, 27355, 27356, 27357, 27527, 27526, 27520, 27537, 27531, 27530, 27525, 27528, 27519, 27521, 27522, 27524, 27532, 27534, 27535, 26796, 26800, 26804, 26808, 26812, 26816, 26820, 26824, 26828, 26832, 26836, 26840, 26792, 27088, 27089, 27090, 27091, 27092, 27093, 27107, 27108, 27109, 27110, 27111, 27112, 27113, 27114, 27115, 27100, 27101, 27102, 27103, 27104, 27248, 27557, 27260, 27261, 27258, 27259, 27272, 27273, 27274, 27275, 27276, 27277, 27278, 27279, 27280, 27281, 27304, 27305, 27306, 27307, 27308, 27309, 27310, 27311, 27312, 27313, 27314, 27316, 27320, 27324, 27317, 27321, 27325, 27333, 27334, 27335, 27336, 27337, 27338, 27339, 27340, 27341, 27329, 27330, 27331, 27332, 27249, 27250, 27282, 27283, 27315, 27284, 27285, 27286, 27287, 27288, 27289, 27290, 27291, 27292, 27318, 27322, 27326, 27319, 27323, 27327, 27328, 27293, 27294, 27295, 27296, 27297, 27298, 27299, 27300, 27301, 27302, 27179, 27176, 27177, 27178, 27191, 27192, 27193, 27194, 27195, 27196, 27197, 27198, 27199, 27200, 27201, 27202, 27203, 27204, 27205, 27206, 27181, 27207, 27209, 27211, 27213, 27215, 27208, 27210, 27212, 27214, 27139, 27155, 27156, 27141, 27149, 27151, 27168, 27169, 27164, 27170, 27162, 27163, 27172, 27134, 27137, 27556, 27064, 27065, 27062, 27063, 27060, 27061, 27070, 27071, 27072, 27073, 27066, 27067, 27068, 27069, 27049, 27050, 27051, 27046, 27047, 27048, 27056, 27057, 27058, 27059, 27052, 27053, 27054, 27055, 25644, 25646, 25648, 25640, 25662, 25665, 25667, 25671, 25681, 25730, 25683, 25684, 25689, 27450, 25693, 25694, 25734, 25705, 25710, 25711, 25651, 25654, 25657, 25659, 25674, 25733, 25679, 25680, 25685, 25686, 25687, 25688, 27451, 25690, 25691, 25692, 25695, 25696, 25697, 25699, 25706, 25707, 25708, 25709, 27421, 27420, 27423, 27422, 27425, 27424, 27427, 27426, 27429, 27428, 27431, 27430, 27433, 27432, 27435, 27434, 27437, 27436, 27448, 27438, 27441, 27440, 27443, 27442, 27445, 27444, 27447, 27449
        `;

        // 단일/복수 쿠폰 다운로드 이벤트 트리거
        PT_STATE.$PROJECT.off('click.couponPromo').on('click.couponPromo', '[data-role="btnCouponPromo"]', function (e) {
            e.preventDefault();
            const arrCpNum = $(this).attr('data-cpNum').split(',');

            NetFunnel_Action({action_id:'b2c_cta_event'}, function(ev,ret){
                PromotionCouponDown(arrCpNum)
            })
        });


    }
}