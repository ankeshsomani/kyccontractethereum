exports.web3 = function(bankNode) {
    var web3_extended = require('web3_extended');

    if (bankNode == 'Bank1') {
        hostname = 'http://159.203.113.140:8101';

    } else if (bankNode == 'Bank2') {
        hostname = 'http://159.203.113.140:8102';
    }
    var options = {
        host: hostname,
        personal: true,
        admin: true,
        debug: false
    };
    var web3 = web3_extended.create(options);
    return web3;
}
exports.bankNode='Bank1';
exports.primaryPassword = function(bankNode) {
    var password = "";
    if (bankNode == 'Bank1') {
        password = 'MastekTest';

    } else if (bankNode == 'Bank2') {
        password = 'B1';
    }
    return password;
}
exports.constructDisplayCustDetailsOutput = function(web3, ar) {
    var out = "NI Number:-" + web3.toAscii(ar[0]).replace(/\u0000/g, '');
    out = out + "\n" + "Driving License Number:-" + web3.toAscii(ar[1]).replace(/\u0000/g, '');

    out = out + "\n" + "Electricity Bill Number:-" + web3.toAscii(ar[2]).replace(/\u0000/g, '');
    out = out + "\n" + "Address:-" + web3.toAscii(ar[3]).replace(/\u0000/g, '');
    out = out + "\n" + "Phone Number:-" + web3.toDecimal(ar[4].replace(/[0]+$/, ''));;
    out = out + "\n" + "KyC Completed By Customer:-" + ar[5];
    out = out + "\n" + "KyC Completed By Bank:-" + ar[6];
    out = out + "\n" + "Email Address:-" + web3.toAscii(ar[7]).replace(/\u0000/g, '');
    var dt1 = new Date(ar[8] * 1000);
    out = out + "\n" + "Valid Date from:-" + dt1.toUTCString();
    return out;
}
exports.constructBankDetailsForCustomer = function(ar2,web3) {

    var out = "Bank Name:-" + web3.toAscii(ar2[0]).replace(/\u0000/g, '');

    out = out + "\n" + "BIC Code:-" + web3.toAscii(ar2[1]).replace(/\u0000/g, '');
    out = out + "\n" + "BANK ethereum account Address:-" + ar2[2];
    out = out + "\n" + "KYC Completed by bank:-" + ar2[3];
    var dt1 = new Date(ar2[4] * 1000);
    out = out + "\n" + "Accepted Date:-" + dt1.toUTCString();
    return out;

}
exports.miningRequiredMessage = "Mining is required for processing the above transaction";
exports.contractAlreadyExistsMessage = 'Contract already exists for customer.You can not create a new contract for this NI Number';
exports.customerNotFoundMessage = 'No Contract address found for the provided NI Number';
exports.transactionNotMinedMessage = "Transaction is not mined yet.";
exports.transactionMinedMessage = "Transaction is mined.";
exports.bankNotFoundMsg="Bank not found at provided branch code";
exports.nullAddress = '0x0000000000000000000000000000000000000000';

exports.mapperContractAbi = [{
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }],
    "name": "custIndex",
    "outputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "niNumber",
        "type": "bytes32"
    }, {
        "name": "custContract",
        "type": "address"
    }],
    "name": "addCustomer",
    "outputs": [],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "niNumber",
        "type": "bytes32"
    }],
    "name": "getCustomerAccountAddress",
    "outputs": [{
        "name": "addr",
        "type": "address"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getAllCustomers",
    "outputs": [{
        "name": "customers",
        "type": "bytes32[]"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "name": "customerContracts",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "type": "function"
}];

exports.mapperContractAddress = '0x045f482d67296e8837e19a9b85c60dd533b847b7';
exports.kycContractAbi = [{
    "constant": false,
    "inputs": [],
    "name": "checkKycDone",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "paramAddress",
        "type": "bytes32"
    }],
    "name": "changeAddress",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "bicCode",
        "type": "bytes32"
    }],
    "name": "getKycStatusOfCustomerForBank",
    "outputs": [{
        "name": "bankName",
        "type": "bytes32"
    }, {
        "name": "bicCode1",
        "type": "bytes32"
    }, {
        "name": "bankAddr",
        "type": "address"
    }, {
        "name": "kycCompletedByBank",
        "type": "bool"
    }, {
        "name": "acceptedDate",
        "type": "uint256"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "bicCode",
        "type": "bytes32"
    }, {
        "name": "bankName",
        "type": "bytes32"
    }],
    "name": "kycCompletedByBank",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "status",
        "type": "bool"
    }],
    "name": "updateKycStatusForAllBanks",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }],
    "name": "banksIndex",
    "outputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "name": "banksParticipated",
    "outputs": [{
        "name": "bankName",
        "type": "bytes32"
    }, {
        "name": "acceptedDate",
        "type": "uint256"
    }, {
        "name": "bicCode",
        "type": "bytes32"
    }, {
        "name": "bankAddress",
        "type": "address"
    }, {
        "name": "kycCompletedByBank",
        "type": "bool"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getAllBanksAssociatedWithCustomer",
    "outputs": [{
        "name": "banks",
        "type": "bytes32[]"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "getCustomerKycInfo",
    "outputs": [{
        "name": "paramNiNumber",
        "type": "bytes32"
    }, {
        "name": "paramDrivingLicenseNumber",
        "type": "bytes32"
    }, {
        "name": "paramElectricityBillNumber",
        "type": "bytes32"
    }, {
        "name": "custAddress",
        "type": "bytes32"
    }, {
        "name": "phoneNumber",
        "type": "bytes32"
    }, {
        "name": "kycCompletedByCustomer",
        "type": "bool"
    }, {
        "name": "kycCompletedByBank",
        "type": "bool"
    }, {
        "name": "emailAddress",
        "type": "bytes32"
    }, {
        "name": "validDateFrom",
        "type": "uint256"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "kycCompletedByCustomer",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "paramPhoneNumber",
        "type": "bytes32"
    }],
    "name": "changePhoneNumber",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}, {
    "inputs": [{
        "name": "paramNiNumber",
        "type": "bytes32"
    }, {
        "name": "paramDrivingLicenseNumber",
        "type": "bytes32"
    }, {
        "name": "paramElectricityBillNumber",
        "type": "bytes32"
    }, {
        "name": "custAddress",
        "type": "bytes32"
    }, {
        "name": "phoneNumber",
        "type": "bytes32"
    }, {
        "name": "emailAddress",
        "type": "bytes32"
    }],
    "type": "constructor"
}];
exports.kycContractData = '606060405260405160c080610a8f833981016040528080519060200190919080519060200190919080519060200190919080519060200190919080519060200190919080519060200190919050505b856000600050600001600050819055508460006000506002016000508190555083600060005060030160005081905550826000600050600701600050819055506000600060005060010160006101000a81548160ff021916908302179055506000600060005060050160006101000a81548160ff0219169083021790555081600060005060060160005081905550806000600050600801600050819055505b50505050505061098e806101016000396000f3606060405236156100ab576000357c0100000000000000000000000000000000000000000000000000000000900480630dfeb718146100ad578063155b4869146100d257806317394ab614610100578063250fc60414610168578063377b1c871461019f5780634a33c651146101cd5780638b68fb9e146101fd578063bf48112014610265578063c6a61c0f146102bc578063ddfb7d2714610333578063ecebe92514610358576100ab565b005b6100ba6004805050610386565b60405180821515815260200191505060405180910390f35b6100e860048080359060200190919050506103cc565b60405180821515815260200191505060405180910390f35b6101166004808035906020019091905050610435565b6040518086600019168152602001856000191681526020018473ffffffffffffffffffffffffffffffffffffffff16815260200183151581526020018281526020019550505050505060405180910390f35b61018760048080359060200190919080359060200190919050506104ce565b60405180821515815260200191505060405180910390f35b6101b5600480803590602001909190505061068c565b60405180821515815260200191505060405180910390f35b6101e3600480803590602001909190505061070d565b604051808260001916815260200191505060405180910390f35b6102136004808035906020019091905050610728565b6040518086600019168152602001858152602001846000191681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182151581526020019550505050505060405180910390f35b6102726004805050610797565b60405180806020018281038252838181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019250505060405180910390f35b6102c96004805050610836565b604051808a600019168152602001896000191681526020018860001916815260200187600019168152602001866000191681526020018515158152602001841515815260200183600019168152602001828152602001995050505050505050505060405180910390f35b61034060048050506108f8565b60405180821515815260200191505060405180910390f35b61036e6004808035906020019091905050610925565b60405180821515815260200191505060405180910390f35b60006000600060005060050160009054906101000a900460ff1680156103be5750600060005060010160009054906101000a900460ff165b90508091506103c8565b5090565b6000816000600050600701600050819055506103e8600061068c565b506000600060005060050160006101000a81548160ff021916908302179055506000600060005060010160006101000a81548160ff0219169083021790555060019050610430565b919050565b600060006000600060006000600960005060008860001916815260200190815260200160002060005090508060000160005054955085508060020160005054945084508060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16935083508060030160149054906101000a900460ff16925082508060010160005054915081505b5091939590929450565b60006000600060011515600060005060010160009054906101000a900460ff161515141561067a578460001916600960005060008760001916815260200190815260200160002060005060020160005054600019161415610574576009600050600086600019168152602001908152602001600020600050915060018260030160146101000a81548160ff0219169083021790555042826001016000508190555061063e565b6009600050600086600019168152602001908152602001600020600050905084816002016000508190555083816000016000508190555060018160030160146101000a81548160ff02191690830217905550428160010160005081905550338160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508060020160005054600a6000506000600b60005054815260200190815260200160002060005081905550600b6000818150548092919060010191905055505b6001600060005060050160006101000a81548160ff02191690830217905550426000600050600401600050819055506001925061068456610683565b60009250610684565b5b505092915050565b600060006000600091505b600b600050548210156107055760096000506000600a600050600085815260200190815260200160002060005054600019168152602001908152602001600020600050905060008160030160146101000a81548160ff021916908302179055505b8180600101925050610697565b5b5050919050565b600a6000506020528060005260406000206000915090505481565b60096000506020528060005260406000206000915090508060000160005054908060010160005054908060020160005054908060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060030160149054906101000a900460ff16905085565b60206040519081016040528060008152602001506000600b600050546040518059106107c05750595b908082528060200260200182016040525091508150600090505b600b6000505481101561083157600a600050600082815260200190815260200160002060005054828281518110156100025790602001906020020190600019169081815260200150505b80806001019150506107da565b5b5090565b6000600060006000600060006000600060006000600050600001600050549850885060006000506002016000505497508750600060005060070160005054955085506000600050600301600050549650865060006000506006016000505494508450600060005060010160009054906101000a900460ff1693508350600060005060050160009054906101000a900460ff169250825060006000506008016000505491508150600060005060040160005054905080505b909192939495969798565b60006001600060005060010160006101000a81548160ff0219169083021790555060019050610922565b90565b600081600060005060060160005081905550610941600061068c565b506000600060005060050160006101000a81548160ff021916908302179055506000600060005060010160006101000a81548160ff0219169083021790555060019050610989565b91905056';
exports.bankContractAbi = [{
    "constant": false,
    "inputs": [{
        "name": "bicCode",
        "type": "bytes32"
    }, {
        "name": "bankAddress",
        "type": "address"
    }, {
        "name": "bankName",
        "type": "bytes32"
    }],
    "name": "addBank",
    "outputs": [],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "name": "banks",
    "outputs": [{
        "name": "bankName",
        "type": "bytes32"
    }, {
        "name": "bankAddress",
        "type": "address"
    }, {
        "name": "bicCode",
        "type": "bytes32"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "bicCode",
        "type": "bytes32"
    }],
    "name": "getBankAccountAddress",
    "outputs": [{
        "name": "addr",
        "type": "address"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "bicCode1",
        "type": "bytes32"
    }],
    "name": "getBankInfo",
    "outputs": [{
        "name": "bankName",
        "type": "bytes32"
    }, {
        "name": "bicCode",
        "type": "bytes32"
    }, {
        "name": "bankAddress",
        "type": "address"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getAllBanks",
    "outputs": [{
        "name": "banks",
        "type": "bytes32[]"
    }],
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }],
    "name": "bankIndex",
    "outputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "bicCode1",
        "type": "bytes32"
    }],
    "name": "removeBank",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "type": "function"
}];
exports.bankContractAddress = '0x7dc531d8c93c6a2541561ae544dda3f4afe1b46d';