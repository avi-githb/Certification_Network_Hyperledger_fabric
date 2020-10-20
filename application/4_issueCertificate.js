'use strict';

/**
 * This is a Node.JS application to Issue a Certificate to Student
 */

const helper = require('./contractHelper');

async function main(studentId, courseId, grade, hash) {

	try {
		const certnetContract = await helper.getContractInstance();

		// Create a new student account
		console.log('.....Issue Certificate To Student');
		const certificateBuffer = await certnetContract.submitTransaction('issueCertificate', studentId, courseId, grade, hash);

		// process response
		console.log('.....Processing Issue Certificate Transaction Response \n\n');
		let newCertificate = JSON.parse(certificateBuffer.toString());
		console.log(newCertificate);
		console.log('\n\n.....Issue Certificate Transaction Complete!');
		return newCertificate;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/* main('200', 'PGDBC', 'A', 'asdfgh').then(() => {
	console.log('Certificate created for the student');
}); */

module.exports.execute = main;
