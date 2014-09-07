var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'database.json', autoload: true });
var fs = require('fs');
var Simplify = require('simplify-commerce');
var azure = require('azure-storage');

var SimplifyClient;
var azureTableSvc;

fs.exists('keys/keys.js', function(exists) {
    if (exists) {
        var Keys = require('../keys/keys.js');
        SimplifyClient = Simplify.getClient({
            publicKey: Keys.simplifyKeys.publicKey,
            privateKey: Keys.simplifyKeys.privateKey
        });
        azureTableSvc = azure.createTableService(Keys.azureStorageKeys.accountName,Keys.azureStorageKeys.privateKey);
    } else {
        SimplifyClient = Simplify.getClient({
            publicKey: process.env.simplifyPublicKey,
            privateKey: process.env.simplifyPrivateKey
        });
        azureTableSvc = azure.createTableService(process.env.azureStorageAccountName,process.env.azureStoragePrivateKey);
    }
});

//var Simplify = require('simplify-commerce');
//
//var SimplifyClient = Simplify.getClient({
//    publicKey: Keys.simplifyKeys.publicKey,
//    privateKey: Keys.simplifyKeys.privateKey
//});


//var tableSvc = azure.createTableService();


/* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});

//router.get('/authorize', function(req, res) {
//    res.end(req.params);
//    //res.render('index', { title: 'Express' });
//});

//router.get('/testCharge', function(req, res) {
//    SimplifyClient.payment.create({
//        amount : "1000",
//        token : "f21da65e-f0ab-45cb-b8e6-40b493c3671f",
//        description : "payment description",
//        currency : "USD"
//    }, function(errData, data){
//        if(errData){
//            res.end("Error Message: " + errData.data.error.message);
//            // handle the error
//            //return;
//        } else {
//            res.end("Payment Status: " + data.paymentStatus);
//        }
//    });
//});
//
//router.get('/testCharge/:token', function(req, res) {
//    var token = req.params.token;
//
//    SimplifyClient.payment.create({
//        amount : "1000",
//        token : token,
//        description : "payment description",
//        currency : "USD"
//    }, function(errData, data){
//        if(errData){
//            res.end("Error Message: " + errData.data.error.message);
//            // handle the error
//            //return;
//        } else {
//            res.end("Payment Status: " + data.paymentStatus);
//        }
//    });
//});

router.get('/getChargeToken', function(req, res) {
    SimplifyClient.cardtoken.create({
        card : {
            addressState : "MO",
            expMonth : "11",
            expYear : "19",
            addressCity : "OFallon",
            cvc : "123",
            number : "5105105105105100"
        }
    }, function(errData, data){

        if(errData){
            res.end("Error Message: " + errData.data.error.message);
            // handle the error
            //return;
        } else {
            res.end("Success Response: " + JSON.stringify(data));
        }
    });
});

//router.get('/testDb', function(req, res) {
////    var doc = { hello: 'world', n: 5, today: new Date(), nedbIsAwesome: true, notthere: null, notToBeSaved: undefined  // Will not be saved
////        , fruits: [ 'apple', 'orange', 'pear' ], infos: { name: 'nedb' }
////    };
//
//    var doc = {
//        twitterId: 'ch4ch4',
//        hoursWorked: '10',
//        amountEarned: '10000' //in cents
//    };
//
////    db.insert(doc, function (err, newDoc) {   // Callback is optional
////        // newDoc is the newly inserted document, including its _id
////        // newDoc has no key called notToBeSaved since its value was undefined
////        res.end(JSON.stringify(newDoc));
////    });
//
//
//    var entGen = azure.TableUtilities.entityGenerator;
//    var row = {
//        PartitionKey: entGen.String('users'),
//        RowKey: entGen.String('2'),
//        twitterId: entGen.String('12345'),
//        hoursWorked: entGen.Double(10),
//        amountEarned: entGen.Double(10000)
////        updatedAt: entGen.DateTime(new Date(Date.UTC(2015, 6, 20)))
//    };
//
////    azureTableSvc.createTableIfNotExists('users', function(error, result, response){
////        if(!error){
////            // Table exists or created
////        }
////    });
//
////    azureTableSvc.insertEntity('users',row, function (error, result, response) {
////        if(!error){
////            // Entity inserted
////            res.end(JSON.stringify(result));
////        } else {
////            res.end(JSON.stringify(error));
////        }
////    });
//
////    azureTableSvc.retrieveEntity('users', 'users', '1', function(error, result, response){
////        if(!error){
////            // result contains the entity
////            res.end(JSON.stringify(result));
////        } else {
////            res.end(JSON.stringify(error));
////        }
////    });
//
//    var userData = {
//        PartitionKey: entGen.String('users'),
//        RowKey: entGen.String('3'),
//        data: entGen.String(JSON.stringify({twitterId:10,totalEarned:10000,hoursWorked:100}))
//    };
//    azureTableSvc.insertOrReplaceEntity('users',userData, function (error, result, response) {
//        if(!error){
//            // Entity inserted
//            azureTableSvc.retrieveEntity('users', 'users', '3', function(error, result, response){
//                if(!error){
//                    // result contains the entity
//                    res.end(JSON.stringify(result));
//                } else {
//                    res.end(JSON.stringify(error));
//                }
//            });
//        } else {
//            res.end(JSON.stringify(error));
//        }
//    });
//
//});

router.post('/processPayment', function(req, res) {
    var token = req.body.simplifyToken;
    var twitterId = req.body.twitterId;
    var amount = req.body.amount;

    SimplifyClient.payment.create({
        amount : amount,
        token : token,
        description : "TippyNinja Donation",
        currency : "USD"
    }, function(errData, data){
        if(errData){
            res.end("Error Message: " + errData.data.error.message);
            // handle the error
            //return;
        } else {
//            res.end("Payment Status: " + data.paymentStatus);
            azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
                if(!error){
                    // result contains the entity
//                    res.end(result.data._);
                    var userData = result;
                    var userDataObject = JSON.parse(result.data._);
                    //console.log(JSON.stringify(userDataObject));
//                    userDataObject.totalEarned = parseFloat(userDataObject.totalEarned) + amount;
                    userDataObject.totalEarned = userDataObject.totalEarned + parseFloat(amount);
                    if(userDataObject.payments == null) userDataObject.payments = [];
                    userDataObject.payments.push({time:new Date(),amount:parseFloat(amount)})
                    //console.log(JSON.stringify(userDataObject));
                    userData.data._ = JSON.stringify(userDataObject);

                    azureTableSvc.insertOrReplaceEntity('users',userData, function (error, result, response) {
                        if(!error){
                            // Entity inserted
                            azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
                                if(!error){
                                    // result contains the entity
//                                    res.end(JSON.stringify(result));
                                    res.end(result.data._);
                                } else {
                                    res.end(500,JSON.stringify(error));
                                }
                            });
                        } else {
                            res.end(500,JSON.stringify(error));
                        }
                    });

                } else {
                    //entity not found... new user?
                    var entGen = azure.TableUtilities.entityGenerator;
                    var userData = {
                        PartitionKey: entGen.String('users'),
                        RowKey: entGen.String(twitterId.toString()),
                        data: entGen.String(JSON.stringify({twitterId:twitterId,totalEarned:parseFloat(amount),hoursWorked:0,payments:[]}))
                    };
                    azureTableSvc.insertOrReplaceEntity('users',userData, function (error, result, response) {
                        if(!error){
                            // Entity inserted
                            azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
                                if(!error){
                                    // result contains the entity
//                                    res.end(JSON.stringify(result));
                                    res.end(result.data._);
                                } else {
                                    res.end(500,JSON.stringify(error));
                                }
                            });
                        } else {
                            res.end(500,JSON.stringify(error));
                        }
                    });

                }
            });
        }
    });

//    var doc = {
//        twitterId: 'ch4ch4',
//        hoursWorked: '10',
//        amountEarned: '10000' //in cents
//    };
//
//    db.insert(doc, function (err, newDoc) {   // Callback is optional
//        // newDoc is the newly inserted document, including its _id
//        // newDoc has no key called notToBeSaved since its value was undefined
//        res.end(JSON.stringify(newDoc));
//    });
});

router.get('/getUserInfo/:twitterId', function(req, res) {
    var twitterId = req.params.twitterId;

    azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
        if(!error){
            // result contains the entity
            res.end(result.data._);
        } else {
            res.end(500,JSON.stringify(error));
        }
    });

//    res.end({totalEarned:1000,hoursWorked:10});
});


router.post('/updateHoursWorked', function(req, res) {
    var twitterId = req.body.twitterId;
    var hoursWorked = req.body.hoursWorked;

    azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
        if(!error){
            // result contains the entity
//                    res.end(result.data._);
            var userData = result;
            var userDataObject = JSON.parse(result.data._);
            //console.log(JSON.stringify(userDataObject));
//                    userDataObject.totalEarned = parseFloat(userDataObject.totalEarned) + amount;
            userDataObject.hoursWorked = parseFloat(hoursWorked);
            //console.log(JSON.stringify(userDataObject));
            userData.data._ = JSON.stringify(userDataObject);

            azureTableSvc.insertOrReplaceEntity('users',userData, function (error, result, response) {
                if(!error){
                    // Entity inserted
                    azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
                        if(!error){
                            // result contains the entity
//                                    res.end(JSON.stringify(result));
                            res.end(result.data._);
                        } else {
                            res.end(500,JSON.stringify(error));
                        }
                    });
                } else {
                    res.end(500,JSON.stringify(error));
                }
            });

        } else {
            //entity not found... new user?
            var entGen = azure.TableUtilities.entityGenerator;
            var userData = {
                PartitionKey: entGen.String('users'),
                RowKey: entGen.String(twitterId.toString()),
                data: entGen.String(JSON.stringify({twitterId:twitterId,totalEarned:0,hoursWorked:hoursWorked,payments:[]}))
            };
            azureTableSvc.insertOrReplaceEntity('users',userData, function (error, result, response) {
                if(!error){
                    // Entity inserted
                    azureTableSvc.retrieveEntity('users', 'users', twitterId, function(error, result, response){
                        if(!error){
                            // result contains the entity
//                                    res.end(JSON.stringify(result));
                            res.end(result.data._);
                        } else {
                            res.end(500,JSON.stringify(error));
                        }
                    });
                } else {
                    res.end(500,JSON.stringify(error));
                }
            });

        }
    });
});

module.exports = router;
