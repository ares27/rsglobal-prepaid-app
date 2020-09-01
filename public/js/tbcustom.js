const btn = $("#buy-airtime-btn");
const networkSelectOption = document.querySelector('#network');
const productsSelectOption = document.querySelector('#products');

$(document).ready(() => {
    
    $('.capture-number-row').hide();
    $('.capture-number-recharge').hide();
    $('.capture-number-order').hide();
    $('#capture-number-next').hide();
    $('#confirm-order-next').hide();
    $('#searchOrderModal').hide();
    $('#successModal').hide();    
    $('#proceed-order-next').hide();




    //capture order type
    $('#capture-order-type').click( () => {
      
        //localStorage.clear();
        localStorage.removeItem("ordertype");
        localStorage.setItem("ordertype", $("#capture-order-type-sel").val())

        $('.capture-order-type').fadeOut();
        $('#capture-order-type').fadeOut();

        setTimeout( ()  => {     
            
            //if pinless order
            if(localStorage.getItem("ordertype")=="pinless"){
                // $('.capture-number-row').fadeIn();
                // $('#capture-number-next').fadeIn();
                alert("No PINLESS order accepted yet."); 
            }
            
            //if pinned order
            if(localStorage.getItem("ordertype")=="pinned"){
                // console.log("pinned order...")

                $('.capture-number-row').fadeIn();
                $('#capture-number-next').fadeIn(); 
            }
        
        }, 1000);

    })


    // Capture Number 
    $('#capture-number-next').click(function() {
        const phoneNumber = document.querySelector('#phone-number');
        console.log(phoneNumber.value);
        
        // localStorage.clear();
        localStorage.removeItem("number");
        localStorage.setItem('number', phoneNumber.value);

        $('#phone-number-x').val(localStorage.getItem("number"));
        

        $(".capture-number-row").fadeOut();
        $('#capture-number-next').fadeOut();

        setTimeout( ()  => {     
            
            $('.capture-number-recharge').fadeIn();
            $('#confirm-order-next').fadeIn();

        }, 2000);
    })

    


    $('#confirm-order-next').click(() => {

        const voucher = $("#products option:selected").html();
        const pricing = productsSelectOption.value.split(" ");
        console.log("===pricing===", pricing);

        localStorage.setItem('voucher', voucher);
        localStorage.setItem('network', pricing[0]);
        localStorage.setItem('sellvalue', pricing[1]);

        $('#con-number').val(localStorage.getItem("number"));
        $('#con-voucher').val(localStorage.getItem("voucher"));
        $('#con-price').val(localStorage.getItem("sellvalue"));


        $(".capture-number-recharge").fadeOut();
        $('#confirm-order-next').fadeOut();

        setTimeout( ()  => {     
            
            $('.capture-number-order').fadeIn();
            $('#proceed-order-next').fadeIn();

        }, 1000);
        
    })



    $('#proceed-order-next').click(async () => {
        
        $('#exampleModal').fadeOut();
        const obj = {
            phonenumber: localStorage.getItem('number'),
            network: localStorage.getItem('network'),
            sellvalue: localStorage.getItem('sellvalue')
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
            // , body: JSON.stringify(obj)
        }
        // console.log(options);
        options.body = JSON.stringify(obj);

        const res = await fetch('/placeorder', options); 
        const res_data = await res.json();              
        console.log(res_data);

        if(res_data.message==="success") {
            
            const order = {
                orderno: res_data.orderno 
            }

            options.body = JSON.stringify(order);
            
            const fetchOrderRes = await fetch('/fetchorder', options);
            const response_data = await fetchOrderRes.json();
            console.log("fetching order...");
            console.log(response_data);

            $('#successModal').modal(); 


            $('#success-recharge-number').text(localStorage.getItem("number"));
            $('#success-recharge-voucher').text(localStorage.getItem('voucher'));
            $('#success-recharge-pin').text(response_data.pin);

        }

        
    });
    
});







async function networkChange() {
    
    console.log("===Network Change===");
    console.log(networkSelectOption.value);

    productsSelectOption.innerHTML = "<option value=''>Select Voucher</option>";

    try {
                
        const res = await fetch('/products'); 
        const res_data = await res.json();              
        console.log(res_data);
        

        res_data.forEach(val => { 
            if(networkSelectOption.value === val.network || networkSelectOption.value.replace("p-", "") === val.network) {
                console.log(val.description + " " + val.network + " " + val.sellvalue);
                
                const optionEl = document.createElement('option');
                optionEl.text = val.description+" R"+val.sellvalue;
                // optionEl.value = val.sellvalue;
                optionEl.value = val.network+" "+val.sellvalue;
               
                productsSelectOption.add(optionEl);


                // Set Pricing
                localStorage.setItem('sellvalue', val.sellvalue);



            }
        });


        
    } catch (ex) {
        console.log("error: ", ex);
    }
}

async function voucherChange() {
    
    console.log("===Voucher Change===");
    console.log(productsSelectOption.name);
    console.log(productsSelectOption.value);

}









































//recharge request
    /*
    $('#confirm-order-next').click(function(){
        $(".capture-number-recharge").fadeOut();
        $('#confirm-order-next').fadeOut();
        
        //localStorage.setItem("network", $('#network').val());
        //localStorage.setItem("network", "vodacom");

        localStorage.setItem("voucher", $('#products').val());
        localStorage.setItem("count", $('#count').val());


        
        $('#con-number').val(localStorage.getItem("number"));
        $('#con-network').val(localStorage.getItem("network"));
        $('#con-voucher').val(localStorage.getItem("voucher"));
        $('#con-quantity').val(localStorage.getItem("count"));

        $('#con-price').val(localStorage.getItem("totprice"));
        $('#con-total-amount').val($('#con-quantity').val()*localStorage.getItem("totprice"));


        setTimeout( ()  => {     
            
            $('.capture-number-order').fadeIn();
            $('#proceed-order-next').fadeIn();

        }, 2000);
    })
    */









    /*
    
    // Place Order
    $('#proceed-order-next').click(()=>{

        $('#exampleModal').fadeOut();
        
        $('#con-total-amount').val(($('#con-price').val())*($('#con-quantity').val()));

        $.ajax({
            url: "freepaid.php",
            method: "POST",
            data: {
              key: "placeOrder",
              user: "3817873",
              pass: "PasS01",
              refno: 12341123,
              network: localStorage.getItem("network"),
              sellvalue: $('#con-total-amount').val(),  //localStorage.getItem("totprice"),
              count: localStorage.getItem("count"),
              extra: localStorage.getItem("number")
            }, success: (response) => {
                let res = JSON.parse(response);
                
                localStorage.setItem("orderno", res.orderno)
                console.log(res);

            }
        });

        setTimeout(()=>{
            
            $('#successModal').modal();  

            
            $.ajax({
                url: "freepaid.php",
                method: "POST",
                data: {
                  key: "fetchOrder",
                  user: "3817873",
                  pass: "PasS01",
                  orderno: localStorage.getItem("orderno")     
                }, success: (response) => {
                    let res = JSON.parse(response);
                    console.log(res);
                    
                    let voucher = res.vouchers;

                    console.log(voucher[0].pin);
                    console.log(localStorage.getItem("number"));

                    console.log("yay!");
                    $('#success-recharge-number').text(localStorage.getItem("number"));
                    $('#success-recharge-voucher').text(res.orderno);
                    $('#success-recharge-pin').text(voucher[0].pin);
                }
            });

               



        }, 1500)
    })

    */