import { PT_STATE, util as _ } from './modules/bs_common';
import {tooltip} from './isqa';
import {simulatorJs} from './simulator';
import {buyingScriptJs} from './buying_script';

$(document).ready(function(){
    PT_STATE.$PROJECT.on('click', '.pt_btn--benefit', function(){
        const $this = $(this);
        $this.toggleClass('pt_active');
    })
});
