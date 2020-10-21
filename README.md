- Certification Verification Network
- Organization:
1. IIT - University which will award Certificate to the student after course completion.
2. MHRD - Ministry Of Human Resource Development - Organization which will act as a Regulator on the network
3. Upgrad - Employer, will employ students from Universities after verification of their certificates.

- Flow of the Project:

- Student sign-up process: Once the student signs up for a particular college, it is recorded on the blockchain.

- Certification: After the student completes his degree, he is issued a certificate, which is recorded on the blockchain.

- Verification step: The employer verifies the certificate and checks to see if it has been tampered at any point.

- Audit: The regulator, MHRD, has the ability to view and audit all of the certificates that are issued on the chain. 
         They can also view the different verifications that are done by the employer whenever a student presents his certificate.



- Different Functions in the Smart Contract:

1. * Create a new student account on the network
	 * @param ctx - The transaction context object
	 * @param studentId - ID to be used for creating a new student account
	 * @param name - Name of the student
	 * @param email - Email ID of the student
   
2. * Get a student account's details from the blockchain
	 * @param ctx - The transaction context
	 * @param studentId - Student ID for which to fetch details
	 * @returns
	 */

3. * Issue a certificate to the student after completing the course
	 * @param ctx
	 * @param studentId
	 * @param courseId
	 * @param gradeReceived
	 * @param originalHash
	 * @returns {Object}

4. * Verify Certificate 
	 * @param ctx
	 * @param studentId
	 * @param courseId
	 * @param currentHash
	 * @returns {Object}
   
   
- Front-end Application to Interact with the Certification Network is built using: HTML, CSS and JS:
API's are created using NODE.JS and we are using an Express server.

- Docker is used for Containerization
