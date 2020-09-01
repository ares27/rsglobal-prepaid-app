$(document).ready( () => {
    
    /* fetch Balance  */
    $.ajax({
        url : './freepaid.php',
        method: 'POST',
        data:{
            key:'fetchBalance'
        },success: function(response){
          // let res = JSON.parse(response);            
            
        }
    });

    //fetch Products  
    $.ajax({
        url: 'freepaid.php', 
        method: 'POST',
        data:{
            key:'fetchProducts'
        },success: function(response){
           // let res = JSON.parse(response);
            
        }
    });


    //query Order
    $.ajax({
        url: "freepaid.php",
        method: "POST",
        data: {
          key: "queryOrder",
          user: "3817873",
          pass: "PasS01",
          orderno: $('#order-number').val()     //"2020020817330721"       //"2019112115181169"    "2020012819081530"   
        }, success: (response) => {
            let res = JSON.parse(response);
            console.log(res);
            
            // $('#descriptionLbl').text(res.vouchers[0].network+" "+res.vouchers[0].sellvalue);
            // $('#pinLbl').text(res.vouchers[0].pin);
        }
    });


    
 
    
});