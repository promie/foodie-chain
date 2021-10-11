const fs = require('fs')
const NodeRSA = require('node-rsa')

if( process.argv.length < 4 ) {
    console.log("Please specific <encrypted filename> <output filename>");
    return;
}

// Read private key file
const privateKey = fs.readFileSync("keys/private.pem");

// Create an instance
const key = new NodeRSA( privateKey );

// Read the file and decrypt it
// @ts-ignore
const data = new Buffer(fs.readFileSync(process.argv[2]))
const decrypted = key.decrypt(data);

// Write out the file
// @ts-ignore
fs.writeFileSync(process.argv[3], decrypted, 'utf8');
