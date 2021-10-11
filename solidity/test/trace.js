const truffleAssert = require('truffle-assertions');

const Trace = artifacts.require('Trace');
const Profile = artifacts.require('Profile');
const ProductSC = artifacts.require('ProductSC');

contract('Trace', (accounts) => {
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
        product = await ProductSC.new(trace.address, profile.address, { from: regulator });

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


        // Crate a product.
        productAId = await product.createProduct.call("Product A", 1, 2, "Location", { from: farmer });
        await product.createProduct("Product A", 1, 2, "Location", { from: farmer });

        // Set it as manufactured.
        product.manuProductInfo(productAId.toNumber(), "Process Type", {from: manufacturer } );
    });

    it('should accept log from logistic', async () => {
        var sendResult = await product.sendProduct(productAId.toNumber(), retailer, logistic, "test", { from: manufacturer });

        // truffleAssert.prettyPrintEmittedEvents( sendResult );

        var logResult = await trace.logLocation(productAId.toNumber(), 9, -1, -2, { from: logistic });

        truffleAssert.eventEmitted(logResult, "ProductLocation", function(ev) {
            return ev.productId == productAId.toNumber() &&
                ev.timestamp == 9 &&
                ev.latitude == -1 &&
                ev.longitude == -2;
        });

        var lastLocation = await trace.tracks.call(productAId.toNumber());

        assert.equal(lastLocation.trackingNumber, "test");
        assert.equal(lastLocation.latitude.toNumber(), -1);
        assert.equal(lastLocation.longitude.toNumber(), -2);
        assert.equal(lastLocation.isRequestingForLocation, false);
    });

    it('should accept log from oracle', async () => {
        var sendResult = await product.sendProduct(productAId.toNumber(), retailer, oracle, "test2", { from: manufacturer });

        // truffleAssert.prettyPrintEmittedEvents( sendResult );

        var logResult = await trace.logLocation(productAId.toNumber(), 10, 1, 2, { from: oracle });

        truffleAssert.eventEmitted(logResult, "ProductLocation", function(ev) {
            return ev.productId == productAId.toNumber() &&
                ev.timestamp == 10 &&
                ev.latitude == 1 &&
                ev.longitude == 2;
        });

        var lastLocation = await trace.tracks.call(productAId.toNumber());

        assert.equal(lastLocation.trackingNumber, "test2");
        assert.equal(lastLocation.latitude.toNumber(), 1);
        assert.equal(lastLocation.longitude.toNumber(), 2);
        assert.equal(lastLocation.isRequestingForLocation, false);
    });

    it('should not accept log from incorrect account', async () => {
        try {
            var sendResult = await product.sendProduct(productAId.toNumber(), retailer, logistic, "test3", { from: manufacturer });

            var logResult = await trace.logLocation(productAId.toNumber(), 11, 11, 12, { from: manufacturer });

            truffleAssert.eventNotEmitted(logResult, "ProductLocation", function(ev) {
                return ev.productId == productAId.toNumber() &&
                    ev.timestamp == 11 &&
                    ev.latitude == 11 &&
                    ev.longitude == 12;
            });

            assert(false, "An exception should occurred");
        } catch (error) {
            assert(error, "Expect an error");
            assert(error.message.includes("Incorrect logistic account"), "Expected error message to contains 'Incorrect logistic account'. Got " + error.message);
        }
    });

    it('should be able to request for location', async () => {
        var sendResult = await product.sendProduct(productAId.toNumber(), retailer, oracle, "test4", { from: manufacturer });

        var requestResult = await trace.requestForLocation.call(productAId.toNumber());
        assert.equal(requestResult, true);

        await trace.requestForLocation(productAId.toNumber());

        requestResult = await trace.requestForLocation.call(productAId.toNumber());

        assert.equal(requestResult, false);
    });

    it('should not be able to request for location for unadded product', async () => {
        requestResult = await trace.requestForLocation.call(999);

        assert.equal(requestResult, false);
    });
    
    it('should not be able to send product from another product contract', async () => {
        let product2 = await ProductSC.new(trace.address, profile.address, { from: regulator });

        // Crate a product.
        let productAId = await product2.createProduct.call("Product A", 1, 2, "Location", { from: farmer });
        await product2.createProduct("Product A", 1, 2, "Location", { from: farmer });

        // Set it as manufactured.
        product2.manuProductInfo(productAId.toNumber(), "Process Type", {from: manufacturer } );

        try {
            var sendResult = await product2.sendProduct(productAId.toNumber(), retailer, oracle, "test2", { from: manufacturer });

            assert(false, "An exception should occurred");
        } catch (error) {
            assert(error, "Expect an error");
            assert(error.message.includes("Incorrect product contract"), "Expected error message to contains 'Incorrect product contract'. Got " + error.message);
        }
    });

    it('should not accept tracking with empty trackingNumber', async () => {
        // Crate another product.
        let productBId = await product.createProduct.call("Product B", 1, 2, "Location", { from: farmer });
        await product.createProduct("Product B", 1, 2, "Location", { from: farmer });

        // Set it as manufactured.
        product.manuProductInfo(productBId.toNumber(), "Process Type", {from: manufacturer } );

        try {
            var sendResult = await product.sendProduct(productBId.toNumber(), retailer, oracle, "", { from: manufacturer });

            assert(false, "An exception should occurred");
        } catch (error) {
            assert(error, "Expect an error");
            assert(error.message.includes("trackingNumber is required"), "Expected error message to contains 'trackingNumber is required'. Got " + error.message);
        }
    });

    it('should be able to desctruct by the regulator', async () => {
        try {
            var result = await trace.destroyContract({from: regulator});
        } catch (error) {
            assert(false, "An exception shouldn't occurred");
        }


        // Crate another product.
        let productBId = await product.createProduct.call("Product B", 1, 2, "Location", { from: farmer });
        await product.createProduct("Product B", 1, 2, "Location", { from: farmer });

        // Set it as manufactured.
        product.manuProductInfo(productBId.toNumber(), "Process Type", {from: manufacturer } );

        try {
            var sendResult = await product.sendProduct(productBId.toNumber(), retailer, oracle, "", { from: manufacturer });
        } catch (error) {
            assert(error, "Expect an error");
            assert(error.message.includes("revert"), "Expected error message to contains 'revert'. Got " + error.message);
        }
    });
});
