const truffleAssert = require('truffle-assertions');

const Product = artifacts.require('ProductSC');
const Profile = artifacts.require('Profile');
const Trace = artifacts.require('Trace');

contract('ProductSC', (accounts) => {
    // The accounts
    const regulator = accounts[0];
    const creator = accounts[1];
    const farmer = accounts[2];
    const manufacturer = accounts[3];
    const retailer = accounts[4];
    const logistic = accounts[5];
    const consumer = accounts[6];
    const oracle = accounts[7];

    // The contract and product
    let profile;
    let product;
    let trace;
    let productAId;

    beforeEach(async () => {
        // Create contracts
        profile = await Profile.new(regulator, "Regulator", { from: regulator });
        trace = await Trace.new(profile.address, { from: regulator });
        product = await Product.new(trace.address, profile.address, { from: regulator });

        await trace.setProductContractAddress( product.address, { from: regulator });
        

        // Set up the accounts
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


        // Create a product.
        productAId = await product.createProduct.call("Product A", 1, 2, "Location", { from: farmer });
        await product.createProduct("Product A", 1, 2, "Location", { from: farmer });
    });

    it('should not have 5 as default status', async () => {
        const result = await product.products.call(productAId.toNumber(), {from: farmer});

        assert.notEqual(result.statusType.toNumber(), 5, "status is 5 for a new product");
    });

    it('should set status to 6 when recall the product', async () => {
        let recall = await product.recallProduct(productAId.toNumber(), { from: farmer });

        truffleAssert.eventEmitted(recall, 'RecallProduct', (ev) => {
            return ev.productId == productAId.toNumber();
        });

        const result = await product.products.call(productAId.toNumber(), {from: farmer});

        assert.equal(result.statusType.toNumber(), 5, 'Status should be 5 after the recall');
    });
});
