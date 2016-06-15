contract MapperContract{
    
    mapping (bytes32 => address) public  customerContracts;
    mapping (uint => bytes32) public  custIndex;
    uint custCount;
    function addCustomer(bytes32 niNumber,address custContract){
      customerContracts[niNumber]=custContract;
      custIndex[custCount]=niNumber;
      custCount++;
    }
    function getAllCustomers() constant
    returns (bytes32[] customers ){
         customers = new bytes32[](custCount);
         for(uint i=0;i<custCount;i++)
        {
           customers[i]=custIndex[i];
        }
    }
    function getCustomerAccountAddress(bytes32 niNumber) returns (address addr){
        addr=customerContracts[niNumber];
    }
    
}