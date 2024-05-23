import { PT_STATE, util as _ } from './modules/bs_common';
import { anchor } from './modules/anchor';
import { tab } from './modules/tab';
import { copy } from './modules/copy';
import { category_tab } from './modules/category_tab';

$(document).ready(function(){
    anchor.load([
        {
            url: 'funding',
            target: '.sec_funding',
            speed: 2000,
            scroll: [100, 100]
        },
        {
            url: 'event',
            target: '.sec_event',
            speed: 2000,
            scroll: [100, 100]
        },
    ]);
    
    // 펀딩 리스트 영역
    const giftBtns = document.querySelectorAll('.gift__btn');
    
    giftBtns.forEach((item) => {
        item.addEventListener("click", () => {
            giftBtns.forEach((e) => {
                e.classList.remove('current');
            })
            item.classList.add('current');
        })
    })

     // 서브 슬라이더
    let SubSwiper = new Swiper('.sub_swiper .swiper-container', {
        slidesPerView: "auto",
    });

     // 메인 슬라이더
    let MainSwiper = new Swiper('.main_swiper .swiper-container', {
        slidesPerView: "auto",
        loop: true,
        on: {
            init: function() {
                const $thumbSwiper = this.$el.closest('.main_swiper').next('.sub_swiper').find('.swiper-container');

                this.params.navigation.nextEl = this.$el.next('.main_nav').find('.swiper-button-next');
                this.params.navigation.prevEl = this.$el.next('.main_nav').find('.swiper-button-prev');
                
                this.thumbs.swiper = $thumbSwiper[0].swiper;
                this.thumbs.init();
            },
            slideChange: function() {
                const $thumbSwiper = this.$el.closest('.main_swiper').next('.sub_swiper').find('.swiper-container');

                $thumbSwiper[0].swiper.slideTo(this.realIndex);
            }
        }
    });

    tab.click([
        {
            el: '[data-role-tab="tab"]',
            target: '.pt_tab__content'
        }
    ]);

    copy.click();
    category_tab.init();
    anchor.load();

    viewportChange(); // fold 해상도 대응
});
