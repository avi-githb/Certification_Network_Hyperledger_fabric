'use strict';

/**
 * This is a Node.JS application to fetch a Student Account from network
 * Defaults:
 * StudentID: 0001
 */

const helper = require('./contractHelper');

async function main(studentId) {

	try {
		const certnetContract = await helper.getContractInstance();

		// Create a new student account
		console.log('.....Get Student Account');
		const studentBuffer = await certnetContract.submitTransaction('getStudent', studentId);

		// process response
		console.log('.....Processing Get Student Transaction Response\n\n');
		let existingStudent = JSON.parse(studentBuffer.toString());
		console.log(existingStudent);
		console.log('\n\n.....Get Student Transaction Complete!');
    return existingStudent;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
    throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/* main('200').then(() => {

	console.log('.....API Execution Complete!');

}); */
