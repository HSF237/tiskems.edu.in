/**
 * TISK EMS Admission Modal Logic
 * Injects the modal HTML and CSS automatically and handles form submission.
 */

(function () {
    // Direct Gmail Redirection Logic inside form submit

    // 1. Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        /* Admission Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.82);
            backdrop-filter: blur(12px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .modal-overlay.active {
            display: flex;
            opacity: 1;
        }

        .modal-container {
            background: white;
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            border-radius: 28px;
            overflow-y: auto;
            position: relative;
            transform: translateY(40px) scale(0.95);
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.4);
            padding: 45px;
            scrollbar-width: thin;
        }

        .modal-overlay.active .modal-container {
            transform: translateY(0) scale(1);
        }

        .modal-close {
            position: absolute;
            top: 25px;
            right: 25px;
            font-size: 1.25rem;
            color: #64748b;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
        }

        .modal-close:hover {
            color: #3b82f6;
            background: #eff6ff;
            transform: rotate(90deg);
            border-color: #3b82f6;
        }

        .modal-header {
            text-align: center;
            margin-bottom: 35px;
        }

        .modal-header h2 {
            font-size: 2.2rem;
            color: #0f172a;
            margin-bottom: 12px;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
        }

        .modal-header p {
            color: #64748b;
            font-size: 1.1rem;
        }

        .admission-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .full-width {
            grid-column: span 2;
        }

        .form-group {
            margin-bottom: 5px;
        }

        .form-label {
            display: block;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .form-label i {
            color: #3b82f6;
            font-size: 0.8rem;
        }

        .form-input {
            width: 100%;
            padding: 14px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 14px;
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: inherit;
            background: #f8fafc;
            color: #0f172a;
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            background: white;
            box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.1);
        }

        select.form-input {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 15px center;
            background-size: 18px;
        }

        textarea.form-input {
            resize: none;
        }

        .submit-btn {
            width: 100%;
            margin-top: 30px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 18px;
            border-radius: 16px;
            font-weight: 800;
            border: none;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-size: 1.15rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }

        .submit-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.45);
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }

        .submit-btn:active {
            transform: translateY(0);
        }

        .submit-btn.loading {
            pointer-events: none;
            opacity: 0.8;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .fa-spin-custom {
            animation: spin 1s linear infinite;
        }

        .success-message {
            display: none;
            text-align: center;
            padding: 50px 20px;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .success-icon-wrapper {
            width: 100px;
            height: 100px;
            background: #dcfce7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            color: #22c55e;
            font-size: 3.5rem;
            animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }

        .success-message h2 {
            font-size: 2.5rem;
            color: #0f172a;
            margin-bottom: 15px;
            font-weight: 800;
        }

        .success-message p {
            color: #64748b;
            font-size: 1.2rem;
            margin-bottom: 35px;
        }

        @media (max-width: 650px) {
            .admission-form-grid {
                grid-template-columns: 1fr;
            }
            .full-width {
                grid-column: span 1;
            }
            .modal-container {
                padding: 40px 24px;
                border-radius: 0;
                width: 100%;
                height: 100%;
                max-height: 100vh;
            }
            .modal-header h2 {
                font-size: 1.8rem;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const modalHTML = `
        <div class="modal-overlay" id="admissionModal">
            <div class="modal-container">
                <div class="modal-close" onclick="closeAdmissionModal()">
                    <i class="fas fa-times"></i>
                </div>

                <div id="admissionFormContent">
                    <div class="modal-header">
                        <h2>Admission Enquiry</h2>
                        <p>Fill out the form below and we'll get back to you shortly.</p>
                    </div>

                    <form id="admissionForm">
                        <div class="admission-form-grid">
                            <div class="form-group">
                                <label class="form-label" for="student_name"><i class="fas fa-user"></i> Student's Full Name</label>
                                <input type="text" class="form-input" id="student_name" name="student_name" required placeholder="e.g. Muhammad Hasan">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="dob"><i class="fas fa-calendar-alt"></i> Date of Birth</label>
                                <input type="date" class="form-input" id="dob" name="dob" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="grade"><i class="fas fa-graduation-cap"></i> Applying for Grade</label>
                                <select class="form-input" id="grade" name="grade" required>
                                    <option value="" disabled selected>Select Grade</option>
                                    <option value="Nursery">Nursery</option>
                                    <option value="LKG">LKG</option>
                                    <option value="UKG">UKG</option>
                                    <option value="Grade 1">Grade 1</option>
                                    <option value="Grade 2">Grade 2</option>
                                    <option value="Grade 3">Grade 3</option>
                                    <option value="Grade 4">Grade 4</option>
                                    <option value="Grade 5">Grade 5</option>
                                    <option value="Grade 6">Grade 6</option>
                                    <option value="Grade 7">Grade 7</option>
                                    <option value="Grade 8">Grade 8</option>
                                    <option value="Grade 9">Grade 9</option>
                                    <option value="Grade 10">Grade 10</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="parent_name"><i class="fas fa-user-friends"></i> Parent/Guardian's Name</label>
                                <input type="text" class="form-input" id="parent_name" name="parent_name" required placeholder="e.g. Sadique">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="email"><i class="fas fa-envelope"></i> Email Address</label>
                                <input type="email" class="form-input" id="email" name="email" required placeholder="e.g. hsfwebdevelopers@gmail.com">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="phone"><i class="fas fa-phone-alt"></i> Phone Number</label>
                                <input type="tel" class="form-input" id="phone" name="phone" required placeholder="e.g. 9496829330">
                            </div>
                            <div class="form-group full-width">
                                <label class="form-label" for="message"><i class="fas fa-comment-dots"></i> Additional Message (Optional)</label>
                                <textarea class="form-input" id="message" name="message" rows="3" placeholder="Enter any additional information or queries here..."></textarea>
                            </div>
                        </div>

                        <button type="submit" class="submit-btn" id="admissionSubmitBtn">
                            SUBMIT ENQUIRY <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>

                <div id="admissionSuccessMessage" class="success-message">
                    <div class="success-icon-wrapper">
                        <i class="fas fa-check"></i>
                    </div>
                    <h2>Application Sent!</h2>
                    <p>Your application has been redirected to Gmail. Please click "Send" in your mail app to finalize the delivery.</p>
                    <button class="submit-btn" onclick="closeAdmissionModal()" style="background: #0f172a; margin-top: 0;">Done</button>
                </div>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);

    // 3. Functions
    window.openAdmissionModal = function () {
        const modal = document.getElementById('admissionModal');
        const formContent = document.getElementById('admissionFormContent');
        const successMessage = document.getElementById('admissionSuccessMessage');

        modal.style.display = 'flex';
        formContent.style.display = 'block';
        successMessage.style.display = 'none';

        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    window.closeAdmissionModal = function () {
        const modal = document.getElementById('admissionModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    };

    // 4. Form Submission
    const form = document.getElementById('admissionForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = document.getElementById('admissionSubmitBtn');
        const originalContent = btn.innerHTML;

        // 1. Start Sending Animation
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin-custom"></i> Processing...';
        btn.disabled = true;

        // 2. Prepare Email Subject and Body
        const studentName = form.student_name.value;
        const className = form.grade.value;
        const parentName = form.parent_name.value;
        const phone = form.phone.value;
        const email = form.email.value || 'N/A';
        const message = form.message.value || 'No message';

        const subject = `Admission Inquiry: ${studentName} (Grade ${className})`;

        const bodyContent = `Hello Principal,

A new admission inquiry was received from the website.

STUDENT DETAILS:
----------------
Name: ${studentName}
Class Applied For: Grade ${className}

PARENT DETAILS:
---------------
Name: ${parentName}
Contact Number: ${phone}
Email Address: ${email}

MESSAGE:
--------
${message}

Thank you.`;

        // 3. Open Gmail Web Interface (Preferred by users)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=tiskems@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
        const backupMailto = `mailto:tiskems@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

        // Try to open Gmail in a new tab
        const gmailWindow = window.open(gmailUrl, '_blank');

        // If Gmail was blocked by a popup blocker, use the current window as a fallback
        if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === 'undefined') {
            window.location.href = backupMailto;
        }

        animateSuccess();

        function animateSuccess() {
            btn.innerHTML = '<i class="fas fa-paper-plane fa-bounce"></i> Delivering...';

            setTimeout(() => {
                const formContent = document.getElementById('admissionFormContent');
                const successMessage = document.getElementById('admissionSuccessMessage');

                formContent.style.transition = 'all 0.5s ease';
                formContent.style.opacity = '0';
                formContent.style.transform = 'translateY(-20px)';

                setTimeout(() => {
                    formContent.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        successMessage.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        successMessage.style.opacity = '1';
                        successMessage.style.transform = 'translateY(0)';

                        btn.classList.remove('loading');
                        btn.innerHTML = originalContent;
                        btn.disabled = false;
                        form.reset();
                    }, 50);
                }, 500);
            }, 1000);
        }
    });

    // Close on escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAdmissionModal();
    });

})();
