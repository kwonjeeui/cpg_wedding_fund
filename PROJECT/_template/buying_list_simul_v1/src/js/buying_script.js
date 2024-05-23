import buyingData from "../data/buying_data.json";
import { PT_STATE, util as _ } from './modules/bs_common';
import { Buying } from './modules/buying';

let isLocal = false;
try{
    isLocal = !(document.domain.includes("samsung.com"));
} catch (e) {}

function addComma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function htmlDraw(buying, isReload){
    function returnHtml(data) {
        function returnOptHtml(optType) {
            const optArr = data[optType];
            const isColor = optType === 'arrColor';
            let optHtml = '';
            let optBtnHtml = '';
            let optKey = '';
            let btnType = '';

            if(isColor) {
                optKey = 'optCdCo';
                btnType = 'color';
            } else if(optType === 'arrOptA') {
                optKey = 'optCdA';
                btnType = 'optA';
            } else if(optType === 'arrOptB') {
                optKey = 'optCdB';
                btnType = 'optB';
            }

            for (let opt of optArr) {
                const optInfo = opt.split('|');
                let _disabled = '';
                if(!isColor) {
                    data[`${optType}Hide`] && data[`${optType}Hide`].forEach(function(item){
                        if(optInfo[0] === item.split('|')[0]) {
                            _disabled = 'pt_disabled';
                        }
                    });
                }
                optBtnHtml += /* html */`
                    <li class="swiper-slide pt_opt__item ${isColor ? 'pt_opt__item--color' : 'pt_opt__item--btn'} ${_disabled}" data-opt-btn>
                        <input
                            type="radio"
                            name="prd_${data.grp}_${btnType}"
                            id="prd_${data.grp}_${optInfo[0]}"
                            value="${optInfo[0]}"
                            ${isColor
                                ? `data-color-name="${optInfo[1]}"`
                                : ''
                            }
                            ${optInfo[0] === data[optKey]
                                ? 'checked'
                                : ''
                            }
                            autocomplete="off"
                        >
                        <label
                            for="prd_${data.grp}_${optInfo[0]}"
                            ${isColor
                                ? `style="${optInfo[2].indexOf('images.samsung.com') != -1
                                    ? `background-image:url(${optInfo[2]})`
                                    : `background-color: ${optInfo[2]}`};"`
                                : ''
                            }
                            data-omni-type="microsite"
                            data-omni=""
                        >
                            ${!isColor
                                ? optInfo[1]
                                : ''
                            }
                        </label>
                        ${isColor
                            ? `<span class="blind">${optInfo[1]}</span>`
                            : ''
                        }
                    </li>
                `
            }

            optHtml = /* html */`
                <div class="pt_opt__slide">
                    <div class="swiper-container" data-buying-option-slider>
                        <ul class="swiper-wrapper pt_opt__list" data-opt-key="${optKey}">
                            ${optBtnHtml}
                        </ul>
                        <div class="swiper-button-prev pt_btn pt_btn--prev"></div>
                        <div class="swiper-button-next pt_btn pt_btn--next"></div>
                    </div>
                </div>
            `;

            return optHtml;
        }
        const benefitA = data.bA.trim() === '-' ? 0 : Number(data.bA.trim());
        const benefitB = data.bB.trim() === '-' ? 0 : Number(data.bB.trim());
        const benefitC = data.bC.trim() === '-' ? 0 : Number(data.bC.trim());
        const benefitTotal = benefitA + benefitB + benefitC;

        return  /* html */`
            <div class="pt_prd" data-buying-group="${data.grp}">
                <div class="pt_prd__top">
                    ${buying.el === '[data-pt-buying-list="3"]'
                        ? /* html */`
                            <button type="button" class="pt_btn pt_btn--cart" data-omni-type="microsite" data-omni="" data-gcode="${data.gcd}" data-buying-btn="btnCart">
                                <p class="blind">제품 담기</p>
                            </button>
                        `
                        : ''
                    }
                    <p class="" data-no-benefit style="${benefitTotal !== 0 ? 'display:none;' : ''}">혜택이 없당~~~</p>
                    <button type="button" class="pt_highlight pt_btn pt_btn--benefit" style="${benefitTotal === 0 ? 'display:none;' : ''}" data-yes-benefit><strong>최대 <span class="en" data-opt-benefit-sum>${addComma(benefitTotal)}</span>만원</strong> 상당 혜택</button>
                    <ul class="pt_benefit">
                        <li class="pt_benefit__item" data-opt-show="bA!=-" style="${data.bA.trim() === '-' ? 'display:none;': ''}">
                            <p class="pt_benefit__title">N-Pay 포인트 페이백</p>
                            <p class="pt_benefit__desc"><span class="mono en" data-opt-text="bA">${addComma(benefitA)}</span>원</p>
                        </li>
                        <li class="pt_benefit__item" data-opt-show="bB!=-" style="${data.bB.trim() === '-' ? 'display:none;': ''}">
                            <p class="pt_benefit__title">즉시 할인</p>
                            <p class="pt_benefit__desc"><span class="mono en" data-opt-text="bB">${addComma(benefitB)}</span>원</p>
                        </li>
                        <li class="pt_benefit__item" data-opt-show="bC!=-" style="${data.bC.trim() === '-' ? 'display:none;': ''}">
                            <p class="pt_benefit__title">삼성카드 금액대별 결제일할인</p>
                            <p class="pt_benefit__desc"><span class="mono en" data-opt-text="bC">${addComma(benefitC)}</span>원</p>
                        </li>
                    </ul>
                </div>
                <div class="pt_prd__content">
                    <div class="img_box pt_prd__img">
                        <img src="${data.thm}" alt="${data.pdNm}" data-prd-img loading="lazy">
                    </div>
                    <div class="pt_opt">
                        ${!!data.arrColor && data.arrColor.length > 0 ? returnOptHtml('arrColor') : ''}
                        ${!!data.arrOptA && data.arrOptA.length > 0 ? returnOptHtml('arrOptA') : ''}
                        ${!!data.arrOptB && data.arrOptB.length > 0 ? returnOptHtml('arrOptB') : ''}
                    </div>
                    <p class="pt_prd__name" data-opt-text="pdNm">${data.pdNm}</p>
                    <p class="pt_prd__sku" data-opt-text="sku">${data.sku}</p>
                </div>
                <div class="pt_prd__bottom">
                    <ul class="pt_prd__price-box">
                        <li class="pt_prd__price pt_discount">
                            <p class="pt_txt">기준가</p>
                            <p class="pt_txt"><span class="mono en" data-opt-text="pA">${addComma(data.pA.trim())}</span>원</p>
                        </li>
                        <li class="pt_prd__price pt_highlight">
                            <strong class="pt_txt">혜택가</strong>
                            <p class="pt_txt"><span class="mono en" data-opt-text="pB">${addComma(data.pB.trim())}</span>원</p>
                        </li>
                    </ul>
                    <button type="button" class="pt_btn pt_btn--coupon pt_highlight" data-omni-type="microsite" data-omni="" data-role="btnCouponPromo">쿠폰 다운받기</button>
                    <div class="pt_btn-box">
                        ${buying.el === '[data-pt-buying-list="3"]'
                            ? /* html */`<a href="${data.url}" class="pt_btn pt_btn--detail" data-omni-type="microsite" data-omni="" title="${data.sku} 자세히 보기 페이지 새 창으로 열림" target="_blank" data-role="btnLink">자세히보기</a>`
                            : ''
                        }
                        ${buying.el !== '[data-pt-buying-list="3"]'
                            ? /* html */`<a href="${data.url}" class="pt_btn pt_btn--large pt_btn--buy" title="${data.sku} 자세히 보기 페이지 새 창으로 열림" target="_blank" data-role="btnLink" data-omni-type="microsite" data-omni="">구매하기</a>`
                            : /* html */`<button type="button" class="pt_btn pt_btn--buy" data-omni-type="microsite" data-omni="">구매하기</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    }

    const listDefault = buying.params.parsedData.listPaging;
    let _html = '';
    listDefault.forEach(prd => {
        _html += returnHtml(prd);
    });

    const $el = buying.$el;
    if(isReload){
        $el.html(_html);
    } else {
        $el.append(_html);
    }

    // // 솔드아웃 체크
    // for (let item of listDefault) {
    //     callApi.soldoutCheck(item);
    // }

    // 스와이퍼
    setOptionSwiper();
}

function setOptionSwiper() {
    $('[data-buying-option-slider]').each(function() {
        if ($(this).hasClass('swiper-container-initialized')) return;

        const optSwiper = new Swiper(this, {
            allowTouchMove: true,
            slidesPerView: 'auto',
            watchOverflow : true, // 다음슬라이드가 없을때 pager, button 숨김 여부 설정
            threshold: 10,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function() {
                    const $el = $(this.$el);

                    // 다음슬라이드가 있는지 없는지 체크 ("true"면 다음 슬라이드가 없는상태)
                    if(this.isLocked == true){
                        // 다음슬라이드가 없으면 클래스(slide_lockd) 추가
                        $el.closest('.swiper-container').addClass('slide_lockd');
                    }else{
                        $el.closest('.swiper-container').removeClass('slide_lockd');
                    }
                }
            }
        });

    });
}

const updateData = function($el, selected, omni) {
    if(!selected) return;

    const $targetGroup = $el.find(`[data-buying-group="${selected.grp}"]`)

    // 혜택 관련
    const benefitA = selected.bA.trim() === '-' ? 0 : Number(selected.bA.trim());
    const benefitB = selected.bB.trim() === '-' ? 0 : Number(selected.bB.trim());
    const benefitC = selected.bC.trim() === '-' ? 0 : Number(selected.bC.trim());
    const benefitTotal = benefitA + benefitB + benefitC;

    $targetGroup.find('.pt_btn--benefit').removeClass('pt_active');
    if(benefitTotal === 0) {
        $targetGroup.find('[data-no-benefit]').show();
        $targetGroup.find('[data-yes-benefit]').hide();
    } else {
        $targetGroup.find('[data-no-benefit]').hide();
        $targetGroup.find('[data-yes-benefit]').show();
        $targetGroup.find('[data-opt-benefit-sum]').text(addComma(benefitTotal));
    }

    // 제품 썸네일
    const $prdImg = $targetGroup.find('[data-prd-img]');
    if(!!$prdImg.length && selected.gcd){
        $prdImg.attr('src', selected.thm);
        $prdImg.attr('alt', selected.pdNm);
    }
    // 쿠폰 다운받기 버튼
    const $btnCoupon = $targetGroup.find('[data-role="btnCouponPromo"]');
    if(!!$btnCoupon.length && selected.gcd){
        $btnCoupon.attr('data-cpNum', selected.cn);
        $btnCoupon.attr('title', `${selected.pdNm} 쿠폰 다운받기`);
        if(!!omni) $btnCoupon.attr('data-omni', `${omni.coupon}${selected.cn}`);
    }
    // 더 알아보기 버튼
    const $btnLink = $targetGroup.find('[data-role="btnLink"]');
    if(!!$btnLink.length && selected.gcd){
        $btnLink.attr('href', selected.url);
        $btnLink.attr('title', `${selected.sku} 자세히 보기 페이지 새 창으로 열림`);
        $btnLink.attr('data-sku', selected.sku);
        if(!!omni) $btnLink.attr('data-omni', `${omni.link}${selected.sku}`);
    }
    // 담기 버튼
    const $btnCart = $targetGroup.find('[data-buying-btn="btnCart"]');
    if(!!$btnCart.length && selected.gcd){
        $btnCart.attr('data-gcode', selected.gcd);
    }
}

function checkCart(arr){
    const prdList = window.PT_STATE.simulatorState.prdList
    arr.forEach(prd => {
        const $btnCheck = $(`[data-buying-group="${prd.grp}"] [data-buying-btn="btnCart"]`);
        if(!$btnCheck.hasClass('pt_soldout')) {
            if(prdList[$btnCheck.attr('data-gcode')]) {
                $btnCheck.addClass('pt_active');
            } else {
                $btnCheck.removeClass('pt_active');
            }
        }
    })
}

function init() {
    const prdBuying1 = new Buying('[data-pt-buying-list="1"]', {
        type: 'list', // single(default), multi, list
        pdList: buyingData.result.filter(prd => prd.catA.trim() === 'O'),
        category: { // list 전용 옵션
            use: true,
            defaults: 'all', // ex) all, category1, category2
        },
        paging: { // multi, list 전용 옵션
            use: true,
            pcIncrease: 9,
            moIncrease: 4,
        },
        on: {
            init(buying) {
                htmlDraw(buying);
                checkCart(buying.params.parsedData.listPaging);
            },
            clickBtnCate(buying, $this) {
                htmlDraw(buying, true);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
                $this.closest('li').addClass('pt_active').siblings().removeClass('pt_active');

                // let menuOffset = $secProduct.find('.pt_category').offset().top;
                // if ($(window).scrollTop() >= menuOffset) {
                //     $('html,body').stop().animate({scrollTop: menuOffset}, 500);
                // }
            },
            clickBtnMore(buying){
                htmlDraw(buying);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
            },
            productChangeEnd(buying) {
                const selected = buying.state.selected;
                const omni = {
                    link: 'sec:event:forearth:goto_',
                    coupon: 'sec:event:forearth:goto_coupon_',
                }
                updateData(buying.$el, selected, omni);
                checkCart([selected])
            },
        }
    })
    const prdBuying2 = new Buying('[data-pt-buying-list="2"]', {
        type: 'list', // single(default), multi, list
        pdList: buyingData.result.filter(prd => prd.catB.trim() === 'O'),
        category: { // list 전용 옵션
            use: true,
            defaults: 'all', // ex) all, category1, category2
        },
        paging: { // multi, list 전용 옵션
            use: true,
            pcIncrease: 9,
            moIncrease: 4,
        },
        on: {
            init(buying) {
                htmlDraw(buying);
                checkCart(buying.params.parsedData.listPaging);
            },
            clickBtnCate(buying, $this) {
                htmlDraw(buying, true);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
                $this.closest('li').addClass('pt_active').siblings().removeClass('pt_active');

                // let menuOffset = $secProduct.find('.pt_category').offset().top;
                // if ($(window).scrollTop() >= menuOffset) {
                //     $('html,body').stop().animate({scrollTop: menuOffset}, 500);
                // }
            },
            clickBtnMore(buying){
                htmlDraw(buying);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
            },
            productChangeEnd(buying) {
                const selected = buying.state.selected;
                const omni = {
                    link: 'sec:event:forearth:goto_',
                    coupon: 'sec:event:forearth:goto_coupon_',
                }
                updateData(buying.$el, selected, omni);
                checkCart([selected])
            },
        }
    })
    const prdBuying3 = new Buying('[data-pt-buying-list="3"]', {
        type: 'list', // single(default), multi, list
        pdList: buyingData.result.filter(prd => prd.catC.trim() === 'O'),
        category: { // list 전용 옵션
            use: true,
            defaults: 'all', // ex) all, category1, category2
        },
        paging: { // multi, list 전용 옵션
            use: true,
            pcIncrease: 9,
            moIncrease: 4,
        },
        on: {
            init(buying) {
                htmlDraw(buying);
                checkCart(buying.params.parsedData.listPaging);
            },
            clickBtnCate(buying, $this) {
                htmlDraw(buying, true);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
                $this.closest('li').addClass('pt_active').siblings().removeClass('pt_active');

                // let menuOffset = $secProduct.find('.pt_category').offset().top;
                // if ($(window).scrollTop() >= menuOffset) {
                //     $('html,body').stop().animate({scrollTop: menuOffset}, 500);
                // }
            },
            clickBtnMore(buying){
                htmlDraw(buying);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
            },
            productChangeEnd(buying) {
                const selected = buying.state.selected;
                const omni = {
                    link: 'sec:event:forearth:goto_',
                    coupon: 'sec:event:forearth:goto_coupon_',
                }
                updateData(buying.$el, selected, omni);
                checkCart([selected])
            },
        }
    })
    const prdBuying4 = new Buying('[data-pt-buying-list="4"]', {
        type: 'list', // single(default), multi, list
        pdList: buyingData.result.filter(prd => {
            if(prd.catDNm.trim() !== '-'){
                prd.cat = prd.catD;
                return prd;
            }
        }),
        category: { // list 전용 옵션
            use: true,
            defaults: 'all', // ex) all, category1, category2
        },
        paging: { // multi, list 전용 옵션
            use: true,
            pcIncrease: 9,
            moIncrease: 4,
        },
        on: {
            init(buying) {
                htmlDraw(buying);
                checkCart(buying.params.parsedData.listPaging);
            },
            clickBtnCate(buying, $this) {
                htmlDraw(buying, true);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
                $this.closest('li').addClass('pt_active').siblings().removeClass('pt_active');

                // let menuOffset = $secProduct.find('.pt_category').offset().top;
                // if ($(window).scrollTop() >= menuOffset) {
                //     $('html,body').stop().animate({scrollTop: menuOffset}, 500);
                // }
            },
            clickBtnMore(buying){
                htmlDraw(buying);
                buying.update();
                checkCart(buying.params.parsedData.listPaging)
            },
            productChangeEnd(buying) {
                const selected = buying.state.selected;
                const omni = {
                    link: 'sec:event:forearth:goto_',
                    coupon: 'sec:event:forearth:goto_coupon_',
                }
                updateData(buying.$el, selected, omni);
                checkCart([selected])
            },
        }
    })
}

export const buyingScriptJs = init();
