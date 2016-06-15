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
// smart contract address for <TRANSACTION HASH> -returns contract address for the provided transaction hash
var common = require("./commonscript.js");
var web3=common.web3(common.bankNode);

module.exports = function(robot) {
    robot.hear(/(smart contract address) for (.*?)$/i, function(msg){

//var transactionHash='0x8d511895ac4b530411855a85e1d3830d610cba1294dd1e34c923a24928d41c8A';
var transactionHash=msg.match[2];
var primary;

web3.eth.getAccounts(function(error, result) {
		 if (!error) {
			 var passwordPrimaryAccount = common.primaryPassword(common.bankNode);	
			primary=result[0]

			 web3.personal.unlockAccount(primary,passwordPrimaryAccount,function(error, result) {
			  if (!error) {
				web3.eth.getTransactionReceipt(transactionHash,function(error,result){
					console.log(result);
					if (!error) {
						if(!result){
							msg.send("Either Hash is invalid or transaction is not mined yet.");
						}
						else{
							msg.send("contract address is "+result.contractAddress);
						}
					}
					else{
						console.error(error);
					
					}
				})
				 
			  } else {
				console.error(error);
			  }
		});

		}
		else{
			console.error(error);
		}
});
       
 });
}