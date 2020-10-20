'use strict';

const {Contract} = require('fabric-contract-api');

class CertnetContract extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.certification-network.certnet');
	}
	
	/* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Certnet Smart Contract Instantiated');
	}
	
	/**
	 * Create a new student account on the network
	 * @param ctx - The transaction context object
	 * @param studentId - ID to be used for creating a new student account
	 * @param name - Name of the student
	 * @param email - Email ID of the student
	 * @returns
	 */
	async createStudent(ctx, studentId, name, email) {
		// Create a new composite key for the new student account
		const studentKey = ctx.stub.createCompositeKey('org.certification-network.certnet.student', [studentId]);
		
		// Create a student object to be stored in blockchain
		let newStudentObject = {
			studentId: studentId,
			name: name,
			email: email,
			school: ctx.clientIdentity.getID(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		
		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newStudentObject));
		await ctx.stub.putState(studentKey, dataBuffer);
		// Return value of new student account created to user
		return newStudentObject;
	}
	
	/**
	 * Get a student account's details from the blockchain
	 * @param ctx - The transaction context
	 * @param studentId - Student ID for which to fetch details
	 * @returns
	 */
	async getStudent(ctx, studentId) {
		// Create the composite key required to fetch record from blockchain
		const studentKey = ctx.stub.createCompositeKey('org.certification-network.certnet.student', [studentId]);
		
		// Return value of student account from blockchain
		let studentBuffer = await ctx.stub
				.getState(studentKey)
				.catch(err => console.log(err));
		return JSON.parse(studentBuffer.toString());
	}
	
	/**
	 * Issue a certificate to the student after completing the course
	 * @param ctx
	 * @param studentId
	 * @param courseId
	 * @param gradeReceived
	 * @param originalHash
	 * @returns {Object}
	 */
	async issueCertificate(ctx, studentId, courseId, gradeReceived, originalHash) {
		let msgSender = ctx.clientIdentity.getID();
		let certificateKey = ctx.stub.createCompositeKey('org.certification-network.certnet.certificate',[courseId + '-' + studentId]);
		let studentKey = ctx.stub.createCompositeKey('org.certification-network.certnet.student', [studentId]);
		
		// Fetch student with given ID from blockchain
		let student = await ctx.stub
				.getState(studentKey)
				.catch(err => console.log(err));
		
		// Fetch certificate with given ID from blockchain
		let certificate = await ctx.stub
				.getState(certificateKey)
				.catch(err => console.log(err));
		
		// Make sure that student already exists and certificate with given ID does not exist.
		if (student.length === 0 || certificate.length !== 0) {
			throw new Error('Invalid Student ID: ' + studentId + ' or Course ID: ' + courseId + '. Either student does not exist or certificate already exists.');
		} else {
			let certificateObject = {
				studentId: studentId,
				courseId: courseId,
				teacher: msgSender,
				certId: courseId + '-' + studentId,
				originalHash: originalHash,
				grade: gradeReceived,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			// Convert the JSON object to a buffer and send it to blockchain for storage
			let dataBuffer = Buffer.from(JSON.stringify(certificateObject));
			await ctx.stub.putState(certificateKey, dataBuffer);
			// Return value of new certificate issued to student
			return certificateObject;
		}
	}
	
	/**
	 * Verify Certificate 
	 * @param ctx
	 * @param studentId
	 * @param courseId
	 * @param currentHash
	 * @returns {Object}
	 */
	async verifyCertificate(ctx, studentId, courseId, currentHash) {
		let verifier = ctx.clientIdentity.getID();
		let certificateKey = ctx.stub.createCompositeKey('org.certification-network.certnet.certificate', [courseId + '-' + studentId]);
		
		// Fetch certificate with given ID from blockchain
		let certificateBuffer = await ctx.stub
				.getState(certificateKey)
				.catch(err => console.log(err));
		
		// Convert the received certificate buffer to a JSON object
		const certificate = JSON.parse(certificateBuffer.toString());
		
		// Check if original certificate hash matches the current hash provided for certificate
		if (certificate === undefined || certificate.originalHash !== currentHash) {
			// Certificate is not valid, issue event notifying the student application
			let verificationResult = {
				certificate: courseId + '-' + studentId,
				student: studentId,
				verifier: verifier,
				result: 'xxx - INVALID',
				verifiedOn: new Date()
			};
			ctx.stub.setEvent('verifyCertificate', Buffer.from(JSON.stringify(verificationResult)));
			return verificationResult;
		} else {
			// Certificate is valid, issue event notifying the student application
			let verificationResult = {
				certificate: courseId + '-' + studentId,
				student: studentId,
				verifier: verifier,
				result: '*** - VALID',
				verifiedOn: new Date()
			};
			ctx.stub.setEvent('verifyCertificate', Buffer.from(JSON.stringify(verificationResult)));
			return verificationResult;
		}
	}
	
}

module.exports = CertnetContract;
