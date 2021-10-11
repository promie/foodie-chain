const truffleAssert = require('truffle-assertions');

const Product = artifacts.require('ProductSC');
const Profile = artifacts.require('Profile');
const Trace = artifacts.require('Trace');

contract('ProductSC', (accounts) => {
    const regulator = accounts[0];
    const farmer = accounts[1];
    const manufacturer = accounts[2];
    const retailer = accounts[3];
    const logistic = accounts[4];
    const consumer = accounts[5];
    const oracle = accounts[6];

    let profile;
    let product;
    let trace;
    let productAId;

    beforeEach(async () => {
        profile = await Profile.new(regulator, "Regulator", { from: regulator });
        trace = await Trace.new(profile.address, { from: regulator });
        product = await Product.new(trace.address, profile.address, { from: regulator });
        await trace.setProductContractAddress( product.address, { from: regulator });

        await profile.registerAccount(farmer, "Farmer", 1, { from: farmer });
        await profile.approveAccount(farmer, 1, { from: regulator });
        await profile.registerAccount(manufacturer, "Manufacturer", 2, { from: manufacturer });
        await profile.approveAccount(manufacturer, 1, { from: regulator });
        await profile.registerAccount(retailer, "Retailer", 3, { from: retailer });
        await profile.approveAccount(retailer, 1, { from: regulator });
        await profile.registerAccount(consumer, "Consumer", 4, { from: consumer });
        await profile.approveAccount(consumer, 1, { from: regulator });
        await profile.registerAccount(logistic, "Logistic", 5, { from: logistic });
        await profile.approveAccount(logistic, 1, { from: regulator });
        await profile.registerAccount(oracle, "Oracle", 6, { from: oracle });
        await profile.approveAccount(oracle, 1, { from: regulator });
        
        productAId = await product.createProduct.call("Potato",123,345,"syd", { from: farmer });
        await product.createProduct("Potato",1210,1230,"syd", { from: farmer });
    });
    
    
    // Test createProduct()
    it('createProduct() successful Test)', async () => {
        const productId = await product.createProduct.call("Tomato",123,345,"syd", { from: farmer });
        await product.createProduct("Tomato",1230,3455,"syd", { from: farmer });

        assert.equal(productId, 2, "ProductID should be equal to 1");
        const result = await product.products.call(2);
        assert.equal(result.productName, "Tomato", 'ProductName should be tomato');
    });
    
    it('createProduct() fail when account role is not farmer )', async () => {
        try {
            const productId = await product.createProduct.call("Product A",123,345,"syd", { from: manufacturer });
            await product.createProduct("Product A",123,345,"syd", { from: manufacturer });
        }
        catch (error){
            assert(error, "Expected an error but did not get one");
        }

    });
    
    
    // Test manuProductInfo()
    it('manuProductInfo() successful Test)', async () => {
        let manu = await product.manuProductInfo.call(1,"Potato Sause", { from: manufacturer });
        await product.manuProductInfo(1,"Potato Sause", { from: manufacturer });

        const result = await product.products.call(1);
        const manu_detail = await product.manu_process.call(1);
        assert.equal(result.statusType.toNumber(), 1, 'Status should be 1 in Manufacturing process');
        assert.equal(result.manufacturerId, manufacturer,"error");
        assert.equal(manu_detail.processType, "Potato Sause", "processType should be in array");
    });
    
    it('manuProductInfo() fail when account role is not manufacturer )', async () => {
        try {
            let manu = await product.manuProductInfo.call(1,"Potato Sause", { from: retailer });
            await product.manuProductInfo(1,"Potato Sause", { from: retailer });
        }
        catch (error){
            assert(error, "Expected an error but did not get one");
        }
    });
    
    // Test retailProductInfo()
    it('retailProductInfo() successful Test)', async () => {
        let retail = await product.retailProductInfo.call(1, { from: retailer });
        await product.retailProductInfo(1, { from: retailer });

        const result = await product.products.call(1);
        const retail_detail = await product.retail_process.call(1);
        assert.equal(result.statusType.toNumber(), 3, 'Status should be 3 in retailing process');
    });
    
    it('retailProductInfo() fail when account role is not retailer )', async () => {
        try {
            let retail = await product.retailProductInfo.call(1, { from: manufacturer });
            await product.retailProductInfo(1, { from: manufacturer });
        }
        catch (error){
            assert(error, "Expected an error but did not get one");
        }
    });
    
    // Test purchasingProductInfo()
    
    it('purchasingProductInfo() fail when datatype is not match )', async () => {
        try {
            let manu = await product.purchasingProductInfo.call(1,"30", { from: consumer });
            await product.purchasingProductInfo(1,"30", { from: consumer });
        }
        catch (error){
            assert(error, "Expected an error but did not get one");
        }
    });
    
    // Test recallProduct()
    it('recallProduct() successful Test for reasonable role.)', async () => {
        const recall = await product.recallProduct(productAId, { from: farmer });

        truffleAssert.eventEmitted(recall, 'RecallProduct', (ev) => {
            return ev.productId == 1;
        });
        
        const result = await product.products.call(1);

        assert.equal(result.statusType.toNumber(), 5, 'Status should be 5 in recalling process');
    });
    
    it('recallProduct() Fail Test for unreasonable role.)', async () => {
        try{
            const recall = await product.recallProduct(productAId, { from: retailer });
            const result = await product.products.call(1);
            assert.equal(result.statusType.toNumber(), 5, 'Status should be 5 in recalling process');
        }
        catch(error){
            assert(error,"error");
            assert(error.message.includes("The address is not farmer,manufacturer, distributor, retailer or consumer"));
        }
    });
    
    
    
});
