const truffleAssert = require('truffle-assertions');

const Trace = artifacts.require('Trace');
const Profile = artifacts.require('Profile');
const ProductSC = artifacts.require('ProductSC');
const Document = artifacts.require("Document");

contract('DocSC', (accounts) => {
    const regulator = accounts[0];
    const acc1 = accounts[1];

    let profile;
    let document;

    beforeEach(async () => {
        profile = await Profile.new(regulator, "Regulator", { from: regulator });
        document = await Document.new(profile.address);
        
        await profile.registerAccount(acc1, "Farmer", 1, { from: acc1 });
        await profile.approveAccount(acc1, 1, { from: regulator });
    });
    
    // Contract Build Test
    it('Contract built successful Test)', async () => {
        const result = await document.regulatorAddress();
        assert.equal(result, regulator, 'error');
    });
    
    
    // addDocument() Test
    it('addDocument() successful Test)', async () => {
        let addDoc = await document.addDocument.call(1, "docName", "hashcontent", { from: acc1 });
        await document.addDocument(1, "docName", "hashcontent", { from: acc1 });

        const result = await document.documentsByAccId.call(1,0);
        assert.equal(result.subDocumentId, "1", 'subDocumentId should be equal to 1');
        assert.equal(result.documentName, "docName", 'docName should be equal to input val');
        assert.equal(result.hashContent, "hashcontent", 'hashcontent should be equal to input val');
    });
    
    
});