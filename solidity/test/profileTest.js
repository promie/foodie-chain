const truffleAssert = require('truffle-assertions');

const Product = artifacts.require('ProductSC');
const Profile = artifacts.require('Profile');
const Trace = artifacts.require('Trace');

contract('ProfileSC', (accounts) => {
    const regulator = accounts[0];
    const acc1 = accounts[1];
    const acc2 = accounts[2];
    
    const acc3 = accounts[3];
    const acc4 = accounts[4];
    const acc5 = accounts[5];
    const acc6 = accounts[6];
    
    let profile;
    
    beforeEach(async () =>{
        profile = await Profile.new(regulator, "Regulator", { from: regulator });
    });
    
    // regulator role Test
    it('regulator role Test', async () => {
        const result = await profile.accountInfoByAddress.call(regulator);
        assert.equal(result.accountType, 0, "AccountType of regulator role should be 0");
        assert.equal(result.accountName, "Regulator", "accountName of regulator role should be regulator");
        assert.equal(result.accountStatus, 1, "Status of regulator role should be 1");
    });
    
    
    // registerAccount() Test
    it('registerAccount() successful Test', async () => {
        const registerFarmer = await profile.registerAccount.call(acc1,"farmer",1);
        await profile.registerAccount(acc1,"farmer",1);
        
        const result = await profile.accountInfoByAddress.call(acc1);
        assert.equal(result.accountId, 1, 'ProductName should be potato');
        
    });
    
    it('registerAccount() fail Test: Regulator role register limited', async () => {
        try {
            const registerFarmer = await profile.registerAccount.call(acc2,"regulatorTest",0);
            await profile.registerAccount(acc2,"farmer",0);
            const result = await profile.accountInfoByAddress.call(acc2);
        }
        catch (error){
            assert(error,"Expected an error but did not get one");
        }
        
    });
    
    it('registerAccount() fail Test: Repeated account register limited', async () => {
        try {
            const register = await profile.registerAccount.call(acc1,"sameAccount",1);
            await profile.registerAccount(acc1,"sameAccount",1);
            const result = await profile.accountInfoByAddress.call(acc1);
        }
        catch (error){
            assert(error,"Expected an error but did not get one");
        }
        
    });
    
    // approveAccount() Test
    it('approveAccount() successful Test', async () => {
        const approve = await profile.approveAccount.call(acc1,1, {from:regulator});
        await profile.approveAccount(acc1,1);
        
        const result = await profile.accountInfoByAddress.call(acc1);
        assert.equal(result.accountStatus, 1, 'After approve function, the accountstatus should be 1');
        
    });
    
    it('approveAccount() fail Test: Only regulator can approve account', async () => {
        try {
            const approve2 = await profile.approveAccount.call(acc1,0, {from: acc1});
            await profile.approveAccount(acc1,0, {from: acc1});
            const result = await profile.accountInfoByAddress.call(acc1);
        }
        catch (error){
            assert(error,"Expected an error but did not get one");
        }
    });
    

    // isManufacturer() Test
    it('isManufacturer() Test', async () => {
        await profile.registerAccount(acc3, "Manufacturer", 2, { from: acc3 });
        await profile.approveAccount(acc3, 1, { from: regulator });
        
        await profile.isManufacturer.call(acc3);
        const result = await profile.isManufacturer(acc3);
        
        assert.equal(result, 1, 'After approve function, the accountstatus should be 1');
        
    });
    
    // isLogisticOrOracle() Test
    it('isLogisticOrOracle() Test', async () => {
        await profile.registerAccount(acc4, "Oracle", 6, { from: acc4 });
        await profile.approveAccount(acc4, 1, { from: regulator });
        
        await profile.isLogisticOrOracle.call(acc4);
        const result = await profile.isLogisticOrOracle(acc4);
        
        assert.equal(result, 1, 'This account should be a logistic');        
        
    });
    
    // isFarmer() Test
    it('isFarmer() Test', async () => {    
        await profile.registerAccount(acc1, "Oracle", 1, { from: acc1 });
        await profile.approveAccount(acc1, 1, { from: regulator });
        
        await profile.isFarmer.call(acc1);
        const result = await profile.isFarmer(acc1);
        
        assert.equal(result, 1, 'This account should be a farmer');
        
    });
    
    // isRetailer() Test
    it('isRetailer() Test', async () => {
        await profile.registerAccount(acc5, "Retailer", 3, { from: acc5 });
        await profile.approveAccount(acc5, 1, { from: regulator });
        
        await profile.isRetailer.call(acc5);
        const result = await profile.isRetailer(acc5);
        
        assert.equal(result, 1, 'This account should be a retailer');        
    });
    
    // isConsumer() Test
    it('isConsumer() Test', async () => {
        await profile.registerAccount(acc6, "Consumer", 4, { from: acc6 });
        await profile.approveAccount(acc6, 1, { from: regulator });
        
        await profile.isConsumer.call(acc6);
        const result = await profile.isConsumer(acc6);
        
        assert.equal(result, 1, 'This account should be a consumer');
        
    });
    
    
});
    
