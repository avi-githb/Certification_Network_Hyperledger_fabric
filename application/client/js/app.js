// Import a user's credentials into current wallet which will then be used to send transactions from
let addToWallet = () => {
	const certificatePath = document.getElementById('certificatePath').value;
	const privateKeyPath = document.getElementById('privateKeyPath').value;
	$.post('http://localhost:3000/addToWallet', {
		certificatePath: certificatePath,
		privateKeyPath: privateKeyPath
	})
			.done((result) => {
				console.log(result);
				if (result.status === 'success') {
					$(".loginBox").hide();
					$(".loginStatus").html("<i class='fa fa-user'></i> Welcome, MHRD_ADMIN").show();
					$(".newStudentBox").show();
					$(".login-toast").toast('show');
				} else {
					$(".error-toast").toast('show');
				}
			})
			.fail((xhr, status, error) => {
				$(".error-toast").toast('show');
			});
};

let createStudent = () => {
	const studentId = document.getElementById('studentId').value;
	const name = document.getElementById('studentName').value;
	const email = document.getElementById('studentEmail').value;
	$("#createStudent").hide();
	$(".createStudentSpinner").show();
	$.post('http://localhost:3000/newStudent', {studentId: studentId, name: name, email: email})
			.done((result) => {
				console.log(result);
				if (result.status === 'success') {
					$(".studentTable tbody").append(
							"<tr>" +
							"<td>1</td>" +
							"<td id='studentId'>" + studentId + "</td>" +
							"<td id='studentName'>" + result.student.name + "</td>" +
							"<td id='studentEmail'>" + result.student.email + "</td>" +
							"<td><i class='fa fa-certificate clickable' onclick='issueCertificate()'></i></td>" +
							"</tr>"
					);
					$(".student-toast").toast('show');
					$("#createStudent").show();
					$(".createStudentSpinner").hide();
				} else {
					$(".error-toast").toast('show');
				}
			})
			.fail((xhr, status, error) => {
				$(".error-toast").toast('show');
			});
};

let issueCertificate = () => {
	const studentId = $("#studentId").val();
	const courseId = 'PGDBC';
	const grade = 'A';
	const certHash = 'asdfgh';
	$.post('http://localhost:3000/issueCertificate', {
		studentId: studentId,
		courseId: courseId,
		grade: grade,
		hash: certHash
	})
			.done((result) => {
				console.log(result);
				if (result.status === 'success') {
					$(".certificateTable tbody").append(
							"<tr>" +
							"<td>1</td>" +
							"<td>" + result.certificate.certId + "</td>" +
							"<td>" + result.certificate.grade + "</td>" +
							"<td>" + result.certificate.originalHash + "</td>" +
							"<td><input type='text' class='form-control inputHashField' placeholder='Enter Certificate Hash' id='inputHash' /><button class='btn btn-primary' onclick='verifyCertificate()'>Verify</button></td>" +
							"</tr>"
					);
					$(".certificate-toast").toast('show');
				} else {
					$(".error-toast").toast('show');
				}
			})
			.fail((xhr, status, error) => {
				$(".error-toast").toast('show');
			});
};

let verifyCertificate = () => {
	const studentId = $("#studentId").val();
	const courseId = 'PGDBC';
	const certHash = $("#inputHash").val();
	$.post('http://localhost:3000/verifyCertificate', {
		studentId: studentId,
		courseId: courseId,
		hash: certHash
	})
			.done((result) => {
				console.log(result);
				if (result.status === 'success') {
					$(".verify-toast").toast('show');
					$(".resultModal .modal-body").html(result.verifyResult.result);
					$(".resultModal").modal('show');
				} else {
					$(".error-toast").toast('show');
				}
			})
			.fail((xhr, status, error) => {
				$(".error-toast").toast('show');
			});
};