'use strict';

$(document).ready(()=>{
    $('.info').hide();
    $('.form-showing').on('click', function(){
        // alert('thanks for clicking. bye');
        $('.info').toggle();
    })
    
})




// $('.btn').on('click', event=>{
//     event.preventDefault();
//     if($('#title').is(':checked')){
//         // alert('thanks');
//         let searchVal= $('.srchbox').val();
//         console.log(searchVal);
//         // location.assign('searches/show')
//     }
//     else if($('#author').is(':checked')){
//         let searchVal= $('.srchbox').val();
//         console.log(searchVal);
//         // location.assign('searches/show')
//     }
// })
