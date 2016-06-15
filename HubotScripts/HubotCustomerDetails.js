// Description:
//  BlockChain script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//  customer details/details of <NI NUMBER> -returns customer information of customer with provided NI NUMBER
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);


module.exports = function(robot) {
    robot.hear(/(customer details|details) of (.*?)$/i, function(msg) {
        var custContractAddress;
        //var custContractAddress='0xe812ae8801be2dd0001a1b00700c1fdcfb0dc7e8';
        var primary;
        var customerNiNumber = msg.match[2];
      
        var mapperContractAbi = common.mapperContractAbi;
        var mapperContractAddress = common.mapperContractAddress;
        var nullAddress = common.nullAddress;
        var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
        var custNotFoundMsg = common.customerNotFoundMessage;
        var mappercontract = web3.eth.contract(mapperContractAbi).at(mapperContractAddress, function(error, result) {
            if (!error) {
                mappercontract = result;
                mappercontract.getCustomerAccountAddress.call(customerNiNumber, function(error, result) {
                    if (!error) {
                        if (result == nullAddress) {
                            msg.send(custNotFoundMsg);
                        } else {
                            custContractAddress = result;

                            web3.eth.getAccounts(function(error, result) {
                                if (!error) {
                                    var custKycContractAbi = common.kycContractAbi;

                                    primary = result[0]
                                    web3.eth.contract(custKycContractAbi).at(custContractAddress, function(error, result) {
                                        if (!error) {
                                            var kycoperations = result;
                                            web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                                if (!error) {
                                                    kycoperations.getCustomerKycInfo.call({
                                                        from: primary,
                                                        gas: 300000
                                                    }, function(error, result) {
                                                        if (!error) {

                                                            var ar = result;
                                                            var out = common.constructDisplayCustDetailsOutput(web3, ar);

                                                            msg.send(out);
                                                        } else {
                                                            console.error(error);
                                                        }
                                                    });

                                                } else {
                                                    console.error(error);
                                                }
                                            });


                                            // msg.send(result);
                                        } else {
                                            console.error(error);
                                        }
                                    });


                                } else {
                                    console.error(error);
                                }
                            });




                        }
                    } else {
                        console.error(error);
                    }
                })

            } else {
                console.error(error);
            }
        });

    });
}