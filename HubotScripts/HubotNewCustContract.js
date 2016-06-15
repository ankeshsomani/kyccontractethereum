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
// create kyc contract for customer NI <NINUMBER> DL <DLNUMBER> ELECBILLNO <ELECBILLNO>  ADDRESS <ADDRESS> PHONENO <PHONENO> EMAILADDR <EMAILADDR> -creates KYC Contract for customer with provided information.
var common = require("./commonscript.js");
var web3 = common.web3(common.bankNode);

module.exports = function(robot) {
    robot.hear(/(create kyc contract) for (customer) NI (.*?) DL (.*?) ELECBILLNO (.*?) ADDRESS (.*?) PHONENO (.*?) EMAILADDR (.*?)$/i, function(msg) {
        var mapperContractAddress = '0x045f482d67296e8837e19a9b85c60dd533b847b7';
        var primary;

        web3.eth.getAccounts(function(error, result) {
            if (!error) {
                var mapperContractAbi = common.mapperContractAbi;
                var mapperContractAddress = common.mapperContractAddress;
                var nullAddress = common.nullAddress;
                var custNotFoundMsg = common.customerNotFoundMessage;
                var passwordPrimaryAccount = common.primaryPassword(common.bankNode);
                primary = result[0]
                var contractAlreadyExistsMessage = common.contractAlreadyExistsMessage;
                var customerNiNumber = msg.match[3];
                //var customerNiNumber='NI999';
                var mappercontract = web3.eth.contract(mapperContractAbi).at(mapperContractAddress, function(error, result) {
                    if (!error) {
                        mappercontract = result;
                        mappercontract.getCustomerAccountAddress.call(customerNiNumber, function(error, result) {
                            if (!error) {

                                if (result == nullAddress) {
                                    var custKycContractAbi = common.kycContractAbi;
                                    var custKycContractData = common.kycContractData;

                                    web3.personal.unlockAccount(primary, passwordPrimaryAccount, function(error, result) {
                                        if (!error) {
                                            console.log(result + "");
                                            var paramNiNumber = customerNiNumber;
                                            var paramDrivingLicenseNumber = msg.match[4];
                                            var paramElectricityBillNumber = msg.match[5];
                                            var custAddress = msg.match[6];
                                            var phoneNumber = msg.match[7];
                                            var emailAddress = msg.match[8];
                                            ////////////


                                            web3.eth.contract(custKycContractAbi).new(
                                                paramNiNumber,
                                                paramDrivingLicenseNumber,
                                                paramElectricityBillNumber,
                                                custAddress,
                                                phoneNumber,
                                                emailAddress, {
                                                    from: primary,
                                                    data: custKycContractData,
                                                    gas: 3000000
                                                },
                                                function(e, contract) {
                                                    console.log(e, contract);
                                                    if (typeof contract.address !== 'undefined') {
                                                        msg.send('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                                                    } else {
                                                        msg.send("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined.");
                                                    }

                                                });


                                            ////////////////////

                                        } else {
                                            console.error(error);
                                        }

                                    });

                                } else {
                                    //msg.send('Contract already exists for customer.You can not create a new contract for this NI Number');
                                    msg.send(contractAlreadyExistsMessage);
                                }

                            } else {
                                console.error(error);
                            }
                        })

                    } else {
                        console.error(error);
                    }
                });


            } else {
                console.error(error);
            }
        });


    });
}