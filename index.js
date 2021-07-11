const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
var fs=require('fs')
const app = express() 

var Publishable_Key = 'pk_test_51JBYFMSBOwSN3FvOf0XsXadLpEnxE1oBrR0NcRHrxQ4xgQ3V0iEpZhAPdUsvlT47F4BSFezmbmGyx6pdsH1hZ0Rg00CF3UCiSy'
var Secret_Key = 'sk_test_51JBYFMSBOwSN3FvOq2hxAjInXjSLGAqkawHNiJNCxGtHCEnf7eJo5QPCAzlUDUUjgL2flMfJA8DATOLrWSw1kfae00EFCtuRqF'

const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3000 

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 
app.use(express.static("views"));//all files will be accesible to root

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/', function(req, res){ 
    res.render('Home', { 
    key: Publishable_Key 
    }) 
}) 

app.post('/payment', function(req, res){ 

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Kajal Dhatrak', 
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '110092', 
            city: 'New Delhi', 
            state: 'Delhi', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 

        return stripe.charges.create({ 
            amount: 7000,    // Charing Rs 25 
            description: 'Donation', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        res.render('success', { 
            key: Publishable_Key 
            }) 
  
    }) 
    .catch((err) => { 
        res.send(err)    // If some error occurs 
    }); 
}) 

app.listen(port, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
})