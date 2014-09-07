var express = require('express');
var router = express.Router();
var Keys = require('../keys/keys.js');
var Simplify = require('simplify-commerce');

var SimplifyClient = Simplify.getClient({
    publicKey: Keys.simplifyKeys.publicKey,
    privateKey: Keys.simplifyKeys.privateKey
});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/authorize', function(req, res) {
    res.end(req.params);
    //res.render('index', { title: 'Express' });
});

router.get('/testCharge', function(req, res) {
    SimplifyClient.payment.create({
        amount : "1000",
        token : "f21da65e-f0ab-45cb-b8e6-40b493c3671f",
        description : "payment description",
        currency : "USD"
    }, function(errData, data){
        if(errData){
            res.end("Error Message: " + errData.data.error.message);
            // handle the error
            //return;
        } else {
            res.end("Payment Status: " + data.paymentStatus);
        }
    });
});

router.get('/testCharge/:token', function(req, res) {
    var token = req.params.token;

    SimplifyClient.payment.create({
        amount : "1000",
        token : token,
        description : "payment description",
        currency : "USD"
    }, function(errData, data){
        if(errData){
            res.end("Error Message: " + errData.data.error.message);
            // handle the error
            //return;
        } else {
            res.end("Payment Status: " + data.paymentStatus);
        }
    });
});

module.exports = router;
