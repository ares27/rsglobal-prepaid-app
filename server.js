const express = require('express');
const app = express();
const soap = require('soap')
const port = process.env.PORT || 3099;

const url = 'http://ws.dev.freepaid.co.za/airtimeplus/?wsdl';
const args = { request: {user: 3817873, pass: 'PasS01'} };



app.use(express.json());
app.use(express.static('public'))

app.get('/api/:name', (req, res) => {
    console.log(req.body);
    res.json({
        statusCode: res.statusCode, 
        message: "Hello " + req.params.name, 
        body: req.body 
    });
    // res.json(req.body);
});


// Fetch Products
app.get('/products', (req, res) => {
    soap.createClientAsync(url).then((client) => {
        return client.fetchProductsAsync(args);
    }).then((result) => {

        // console.log(result)
        // console.log(allProducts);
        const allProducts = result[0].reply.products.item;
        let AllProductsArr = [];

        if(allProducts) {

            allProducts.map(product => {
    
                const obj = {
                    description: product.description['$value'],
                    network: product.network['$value'],
                    sellvalue: product.sellvalue['$value'],
                    costprice: product.costprice['$value']
                };
    
                AllProductsArr.push(obj);
            })
        }

        res.json(AllProductsArr);
    })
    .catch((err) => {
        console.log("Error: ", err)
    })
    
});

// Place Order
app.post('/placeorder', (req, res) => {
    
    const arg = { request: {user: 3817873, pass: 'PasS01', 
                        refno: 123654, network: req.body.network, sellvalue: req.body.sellvalue, count: 1, extra: req.body.phonenumber } };
    
    soap.createClientAsync(url).then((client) => {
        return client.placeOrderAsync(arg);
    }).then((result) => {

        console.log(result);
        const status = result[0].reply.message;
        const message = result[0].reply.message["$value"];
        const orderno = result[0].reply.orderno["$value"];
              
        // res.json({ message: message, result: result });
        res.json({ message: message, orderno: orderno });
    })
    .catch((err) => {
        console.log("Error: ", err)
    })
      
});

// Fetch Order
app.post('/fetchorder', (req, res) => {
    
    const arg = { request: { user: 3817873, pass: 'PasS01', orderno: req.body.orderno } };
    
    soap.createClientAsync(url).then((client) => {
        return client.fetchOrderAsync(arg);
    }).
    then((result) => {

        console.log(result);
        const network = result[0].reply.vouchers.item.network["$value"];
        const sellvalue = result[0].reply.vouchers.item.sellvalue["$value"];
        const pin = result[0].reply.vouchers.item.pin["$value"];
              
        // res.json(result);
        res.json({ network: network, sellvalue: sellvalue, pin: pin });
    })
    .catch((err) => {
        console.log("Error: ", err)
    })
       
});




app.listen(port, () => console.log(`listening on port ${port}...`));
