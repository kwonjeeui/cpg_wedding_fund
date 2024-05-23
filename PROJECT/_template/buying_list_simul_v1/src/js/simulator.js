import buyingData from "../data/buying_data.json";
import { PT_STATE, util as _ } from './modules/bs_common';

// s: simulator
let isSimulatorSession = true;
let simulatorState = {
    length: 0,
    prdList: {},
    calc: {},
    changesSlide: {
        changes: '',
        gCode: '',
        idx: 0,
    }
};
PT_STATE.simulatorState = simulatorState;
// 혜택 종류 : 0 - key, 1 - 텍스트, 2 - 포인트 종류
const benefit = [
    ['priceB', '즉시할인', '원'],
    ['priceC', '쿠폰할인', '원'],
    ['benefitB', '삼성카드 금액대별 결제일할인', '원'],
    ['benefitA', '금액대별 N-Pay 포인트 쿠폰', 'P'],
    ['benefitZ', '동시구매 N-Pay 포인트 쿠폰', 'P'],
    ['benefitC', '삼성전자 멤버십 포인트', 'P'],
    ['benefitD', '삼성전자 멤버십 포인트 (회수 조건)', 'P'],
    ['over', 'test', 'P']
];
let simulatorSlide = null;

const simulator = {
    htmlDraw() {
        // s: 혜택 html 영역
        let benefitHtml = '';
        benefit.forEach((arr) => {
            benefitHtml += `
                <div class="pt_benefit__item" data-mode-show="${arr[0]}">
                    <p class="pt_desc">- ${arr[1]}</p>
                    <p class="pt_num ${arr[2] === 'P' ? 'en' : ''}"><em class="mono en" data-mode-text="${arr[0]}">0</em>${arr[2]}</p>
                </div>`
        })
        // e: 혜택 html 영역

        return /* html */`
            <div class="pt_simulator__top">
                <button type="button" class="pt_btn pt_btn--toggle m_show">열기</button>
            </div>
            <div class="pt_simulator__content">
                <div class="pt_cart">
                    <div class="pt_cart__empty">
                        <p class="pt_desc pt_desc--empty">제품을 담고 혜택을 확인하세요</p>
                    </div>
                    <div class="swiper-container pt_cart__slide">
                        <ul class="swiper-wrapper pt_cart__list"></ul>
                    </div>
                    <button type="button" class="swiper-button-prev pt_btn pt_btn--slide pt_btn--prev"></button>
                    <button type="button" class="swiper-button-next pt_btn pt_btn--slide pt_btn--next"></button>
                </div>
                <div class="pt_benefit">
                    <div class="pt_benefit__top">
                        <div class="pt_price">
                            <p class="pt_desc">기준가 총 금액</p>
                            <p class="pt_num"><em class="mono en" data-mode-text="priceA">0</em>원</p>
                        </div>
                    </div>
                    <div class="pt_benefit__list">
                        ${benefitHtml}
                    </div>
                    <div class="pt_benefit__bottom">
                        <p class="pt_benefit__total">총 혜택 <em class="mono en" data-mode-text="save">0</em>원</p>
                        <p class="pt_notice">
                            *앱 전용 쿠폰은 삼성닷컴 앱 결제 시에만 적용이 가능하며, <br />
                            적용 시, 아래 결제 예정가와 달라질 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
            <div class="pt_simulator__bottom">
                <p class="pt_btn pt_btn--buy pt_disabled" data-mode-hide="priceA">제품 담기</p>
                <button type="button" class="pt_btn pt_btn--buy" data-role="simulatorBtnBuy" data-mode-show="priceA" style="display:none;">총 <span data-mode-text="count"></span>개ㅣ결제 예정가 <span class="en" data-mode-text="priceTotal"></span>원</button>
            </div>
        `
    },
    slideDraw() {
        try{
            let _html = [];
            let benefitTxt = '';
            let benefitNum = '';

            function slideHtml(item, index) {
                if(item.pD && item.pD !== '-') {
                    benefitTxt = '앱 쿠폰 적용가';
                    benefitNum = item.pD;
                } else if (item.pC && item.pC !== '-') {
                    benefitTxt = '쿠폰 적용가';
                    benefitNum = item.pC;
                } else if (item.pB && item.pB !== '-') {
                    benefitTxt = '혜택가';
                    benefitNum = item.pB;
                }

                _html[index ?? 0] = /* html */ `
                    <li class="swiper-slide pt_prd">
                        <div class="img_box pt_prd__img">
                            <button type="button" class="pt_btn pt_btn--delete" data-sku="${item.sku}" data-pt-simulator-delete="${item.gcd}"></button>
                            <img data-opt-img="thumnail" src="${item.thm}" alt="${item.sku}">
                        </div>
                        <p class="pt_prd__name">${item.pdNm}</p>
                        <ul class="pt_price">
                            <div class="pt_price__box">
                                <p>기준가</p>
                                <p>${item.pA}원</p>
                            </div>
                            <div class="pt_price__box pt_highlight">
                                <p>${benefitTxt}</p>
                                <p>${benefitNum}원</p>
                            </div>
                        </ul>
                    </li>`;
            }
            simulatorSlide.update();
            if(isSimulatorSession) {
                Object.values(simulatorState.prdList).forEach((item, index) => slideHtml(item, index))
                _html.push(/* html */ `
                    <li class="swiper-slide pt_prd pt_prd--none">
                        <div class="img_box pt_prd__img">
                            <img data-opt-img="thumnail" src="../../is/images/buying01/ym_item_none.png" alt="" draggable="false">
                        </div>
                        <p class="blind">상품을 담아보세요</p>
                    </li>`);
                simulatorSlide.appendSlide(_html);
                simulatorSlide.update();
            } else if(simulatorState.changesSlide.changes === 'add') {
                slideHtml(simulatorState.prdList[simulatorState.changesSlide.gCode])
                simulatorSlide.addSlide(simulatorState.length - 1, _html);
                simulatorSlide.update();
            } else if(simulatorState.changesSlide.changes === 'remove') {
                simulatorSlide.removeSlide(simulatorState.changesSlide.idx);
                simulatorSlide.update();
            }

            simulatorSlide.slideTo(simulatorState.length - 1);

        }catch (e) {
            console.warn(e);
        }

    },
    calculate() {
        let calc = simulatorState.calc = {
            count: 0,                // 제품 카운트
            priceTotal: 0,           // 최종 결제가
            priceA: 0,               // 기준가 총 금액
            priceB: 0,               // 혜택가 총 금액
            priceC: 0,               // 쿠폰 적용가 + 앱쿠폰 적용가 총 금액
            benefitA: 0,             // 금액대별 Npay 포인트
            benefitB: 0,             // 삼성카드 결제일할인
            benefitC: 0,             // 멤버십 포인트
            benefitD: 0,             // 멤버십 포인트(회수 조건)
            benefitZ: 0,             // 동시구매 Npay 포인트
            benefitTV: 0,            // 삼성전자 멤버십 포인트
            benefitTotal: 0,         // 페이백 제외 총 결제 금액
            benefitSave: 0,          // (즉시할인, 쿠폰) 제외 할인 혜택
            save: 0,                 // 총 할인 혜택
            over: 0                  // 테스트 용
        };
        const category = new Set();
        const coupon = new Set();

        for(const item of Object.values(simulatorState.prdList)) {
            const pA = _.removeComma(item.pA.trim()); // 기준가
            const pB = _.removeComma(item.pB.trim()); // 혜택가
            const pC = _.removeComma(item.pC.trim()); // 쿠폰적용가
            const pD = _.removeComma(item.pD.trim()); // 앱쿠폰적용가
            const pE = _.removeComma(item.pE.trim()); // 즉시 할인
            const bA = _.removeComma(item.bA.trim()); // 쿠폰 할인
            const bB = _.removeComma(item.bB.trim()); // 앱쿠폰 추가 할인
            const bC = _.removeComma(item.bC.trim()); // 앱 추가 혜택
            const bD = _.removeComma(item.bD.trim()); // 금액대별 Npay 포인트
            const bE = _.removeComma(item.bE.trim()); // 멤버십 포인트
            const bF = _.removeComma(item.bF.trim()); // 금액대별 Npay 포인트
            const bG = _.removeComma(item.bF.trim()); // 멤버십 포인트 (회수 조건)

            // 나중에 동시구매 관련 카테고리 듣고 수정 필요
            // if(item.category !== 'category17' && item.category.trim() !== 'category19') {
            //     category.add(item.category.trim());
            // }

            // 최종 결제가
            if (item.pC && item.pC !== '-') {
                calc.priceTotal += pC;
            } else if (item.pB && item.pB !== '-') {
                calc.priceTotal += pB;
            }

            if(!coupon.has(item.cn.trim()) && !coupon.has(item.apCn.trim())){
                calc.priceC += (pE === '-' ? 0 : pE) + (bB === '-' ? 0 : bB); // 쿠폰 적용가, 앱쿠폰 적용가 총 금액
            }

            if((item.cn && item.cn.trim() !== '-')){
                coupon.add(item.cn.trim());
            }

            if((item.apCn && item.apCn.trim() !== '-')){
                coupon.add(item.apCn.trim());
            }

            calc.priceA += pA; // 총 기준가
            calc.priceB += pA - pB; // 총 혜택가
            calc.benefitC += bC; // 총 멤버십 포인트
            calc.benefitD += bD; // 총 멤버십 포인트(회수 조건)
        }

        // 금액대별 Npay 포인트
        if(calc.priceTotal >= 4000000) {        // 결재가 기준 4백만원 이상
            calc.benefitA = 200000;
        } else if(calc.priceTotal >= 3000000) { // 결재가 기준 3백만원 이상
            calc.benefitA = 150000;
        } else if(calc.priceTotal >= 2000000) { // 결재가 기준 2백만원 이상
            calc.benefitA = 100000;
        } else if(calc.priceTotal >= 1500000) { // 결재가 기준 150만원 이상
            calc.benefitA = 60000;
        } else if(calc.priceTotal >= 1000000) {  // 결재가 기준 백만원 이상
            calc.benefitA = 40000;
        }

        // 동시구매 Npay 포인트
        if(category.size >= 4) {        // 카테고리 갯수가 4개 이상일때
            calc.benefitZ = 200000;
        } else if(category.size >= 3) { // 카테고리 갯수가 3개 이상일때
            calc.benefitZ = 150000;
        } else if(category.size >= 2) { // 카테고리 갯수가 2개 이상일때
            calc.benefitZ = 100000;
        }

        // 삼성카드 금액대별 결제일 할인
        if(calc.priceTotal >= 20000000) {        // 삼성카드 할인 미포함 결제 금액 기준 2천만원 이상
            calc.benefitB = 900000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 15000000) { // 삼성카드 할인 미포함 결제 금액 기준 천5백만원 이상
            calc.benefitB = 700000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 10000000) { // 삼성카드 할인 미포함 결제 금액 기준 천만원 이상
            calc.benefitB = 500000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 7000000) {  // 삼성카드 할인 미포함 결제 금액 기준 7백만원 이상
            calc.benefitB = 380000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 5000000) {  // 삼성카드 할인 미포함 결제 금액 기준 5백만원 이상
            calc.benefitB = 300000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 4000000) {  // 삼성카드 할인 미포함 결제 금액 기준 4백만원 이상
            calc.benefitB = 190000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 3000000) {  // 삼성카드 할인 미포함 결제 금액 기준 3백만원 이상
            calc.benefitB = 130000;
            calc.over = 100000;
        } else if(calc.priceTotal >= 2000000) {  // 삼성카드 할인 미포함 결제 금액 기준 2백만원 이상
            calc.benefitB = 100000;
            calc.over = 0;
        } else if(calc.priceTotal >= 1500000) {  // 삼성카드 할인 미포함 결제 금액 기준 백만원 이상
            calc.benefitB = 60000;
            calc.over = 0;
        } else if(calc.priceTotal >= 1000000) {  // 삼성카드 할인 미포함 결제 금액 기준 백만원 이상
            calc.benefitB = 60000;
            calc.over = 0;
        } else if(calc.priceTotal < 1000000) {  // 삼성카드 할인 미포함 결제 금액 기준 백만원 미만
            calc.over = 0;
        }

        calc.save = calc.priceB + calc.priceC + calc.benefitA + calc.benefitB + calc.benefitC + calc.benefitD + calc.benefitZ + calc.over; // 총 할인 합산
        calc.benefitSave = Math.floor((calc.save - (calc.priceB + calc.priceC)) / 10000); // (즉시할인, 쿠폰) 제외 할인 혜택
        calc.benefitTotal = calc.priceA - calc.save; // 페이백 제외 총 결제 금액
        calc.count = simulatorState.length; // 내가 담은 제품 카운트

    },
    setSlide() {
        simulatorSlide = new Swiper(".pt_cart__slide", {
            slidesPerView: 'auto',
            allowTouchMove: true,
            observer: true,
            observeParents: true,
            threshold: 10,
            preloadImages: false,
            lazy: true,
            navigation: {
                nextEl: ".pt_simulator .pt_btn--next",
                prevEl: ".pt_simulator .pt_btn--prev",
            },
            on: {
                breakpoint: function () {
                    var that = this;
                    setTimeout(function () {
                        that.slideTo(0, 0);
                    }, 150);
                },
                slidesLengthChange: function() {
                    if(simulatorSlide.slides.length < 3) {
                        $('.pt_cart').addClass('pt_cart--empty');
                    } else {
                        $('.pt_cart').removeClass('pt_cart--empty');
                    }
                }
            }
        });
    },
    binding() {
        PT_STATE.$PROJECT.on('click', '[data-buying-btn="btnCart"]', function(e) {
            e.preventDefault();
            const $this = $(this);
            const gCode = $this.attr('data-gcode');

            $this.toggleClass('pt_active')
            if($this.hasClass('pt_active')) {
                simulator.addItem(gCode);
            } else {
                simulator.removeItem(gCode);
            };
            simulator.setSession();
        });
        PT_STATE.$PROJECT.on('click', '[data-pt-simulator-delete]', function(e) {
            e.preventDefault();
            const $this = $(this);
            const gCode = $this.attr('data-pt-simulator-delete');
            simulator.removeItem(gCode);
            simulator.setSession();
            $(`[data-buying-btn="btnCart"][data-gcode="${gCode}"]`).removeClass('pt_active')
        });
        PT_STATE.$PROJECT.on('click', '[data-role="simulatorBtnBuy"]', function (e) {
            e.preventDefault();
            const arrProduct = [];

            simulatorState.prdList.forEach(function(item) {
                arrProduct.push({goodsId: item.gcd, qty: 1});
            });

            if (window.fnBuyDirectByMultiId) {
                fnBuyDirectByMultiId(arrProduct);
            }
        });
    },
    setSession() {
        sessionStorage.setItem('pt_simulator_state_groupbuy', JSON.stringify(simulatorState.prdList));
    },
    getSession() {
        return JSON.parse(sessionStorage.getItem('pt_simulator_state_groupbuy'));
    },
    addItem(gCode) {
        const prdItem = buyingData.result.filter((item) => item.gcd == gCode)[0];
        simulatorState.prdList[gCode] = prdItem;
        simulatorState.changesSlide.changes = 'add';
        simulatorState.changesSlide.gCode = gCode;
        simulatorState.length += 1;
    },
    removeItem(gCode) {
        simulatorState.changesSlide.changes = 'remove';
        simulatorState.changesSlide.gCode = gCode;
        simulatorState.changesSlide.idx = Object.keys(simulatorState.prdList).indexOf(gCode)
        delete simulatorState.prdList[gCode];
        simulatorState.length -= 1;
    },
    dataMode() {
        try{
            // html에서 data-mode-text 속성의 값과 simulatorState.calc의 key와 동일하면 value를 매핑
            $('[data-mode-text]').each(function() {
                const $this = $(this);
                const key = $this.attr('data-mode-text');
                const price = simulatorState.calc[key];

                $this.text(_.addComma(!!price ? price : 0));
            });

            // html에서 data-mode-show 속성의 값과 simulatorState.calc의 key의 값이 0 이상이면 show
            $('[data-mode-show]').each(function() {
                const $this = $(this);
                const key = $this.attr('data-mode-show');

                simulatorState.calc[key] > 0 ? $this.show() : $this.hide();
            });

            // html에서 data-mode-show 속성의 값과 simulatorState.calc의 key의 값이 0 이상이면 hide
            $('[data-mode-hide]').each(function() {
                const $this = $(this);
                const key = $this.attr('data-mode-hide');

                simulatorState.calc[key] > 0 ? $this.hide() : $this.show();
            });
        }catch (e) {
            console.warn(e);
        }
    },
    observer() {
        simulator.calculate();
        simulator.slideDraw();
        simulator.dataMode();
        if(simulatorState.calc.priceA === 0){
            $('[data-simulator] .pt_benefit__item').show();
            $('[data-simulator] .pt_cart__empty').show();
        } else {
            $('[data-simulator] .pt_cart__empty').hide();
        }
    },
    init() {
        $('[data-simulator]').html(simulator.htmlDraw);
        Object.defineProperty(simulatorState, 'length', {
            get() {
                return Object.keys(simulatorState.prdList).length;
            },
            set () {
                simulator.observer();
            }
        })
        simulator.setSlide();
        if(isSimulatorSession && !!simulator.getSession()) {
            const prdList = {};
            Object.values(simulator.getSession()).forEach(prd => {
                const api = {
                    url: stPath + 'xhr/goods/getSaleStatCd',
                    data: { goodsId: prd.gcd.trim() },
                    done: function (data) {
                        if( data.saleStatCd == '12' ) {
                            prdList[prd.gcd] = prd;
                        }
                    }
                }
                if(document.domain.indexOf("samsung.com") > -1) {
                    ajax.call(api);
                } else {
                    prdList[prd.gcd] = prd;
                }
            })
            simulatorState.prdList = prdList;
            window.PT_STATE.simulatorState = simulatorState;
            simulator.observer();
            isSimulatorSession = false;
        }
        simulator.binding();
    },
}

function init() {
    simulator.init()
}

export const simulatorJs = init();
