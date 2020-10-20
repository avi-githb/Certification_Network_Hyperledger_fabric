'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * Defaults:
 *  User Name: MHRD_ADMIN
 *  User Organization: MHRD
 *  User Role: Admin
 *
 */

const fs = require('fs'); // FileSystem Library
const { FileSystemWallet, X509WalletMixin } = require('fabric-network'); // Wallet Library provided by Fabric
const path = require('path'); // Support library to build filesystem paths in NodeJs

const crypto_materials = path.resolve(__dirname, '../network/crypto-config'); // Directory where all Network artifacts are stored

// A wallet is a filesystem path that stores a collection of Identities
const wallet = new FileSystemWallet('./identity/mhrd');

async function main(certificatePath, privateKeyPath) {

	// Main try/catch block
	try {

		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const certificate = fs.readFileSync(certificatePath).toString();
		// IMPORTANT: Change the private key name to the key generated on your computer
		const privatekey = fs.readFileSync(privateKeyPath).toString();

		// Load credentials into wallet
		const identityLabel = 'MHRD_ADMIN';
		const identity = X509WalletMixin.createIdentity('mhrdMSP', certificate, privatekey);

		await wallet.import(identityLabel, identity);

	} catch (error) {
		console.log(`Error adding to wallet. ${error}`);
		console.log(error.stack);
		throw new Error(error);
	}
}

/* main('/home/upgrad/workspace/certification-network/network/crypto-config/peerOrganizations/mhrd.certification-network.com/users/Admin@mhrd.certification-network.com/msp/signcerts/Admin@mhrd.certification-network.com-cert.pem', '/home/upgrad/workspace/certification-network/network/crypto-config/peerOrganizations/mhrd.certification-network.com/users/Admin@mhrd.certification-network.com/msp/keystore/69e13659643b75e6c9e31c682b029db75bcba598eefe63b6dbd214dd1e7e79b6_sk').then(() => {
  console.log('User identity added to wallet.');
}); */

module.exports.execute = main;
