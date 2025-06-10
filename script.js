const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXVDUMU_GwEs3lMgYoF-oIt8Xv0a86nEvCU72m1WQ/dev';

document.addEventListener('DOMContentLoaded', function () {
    const yesRadio = document.getElementById('study_russia_yes');
    const noRadio = document.getElementById('study_russia_no');
    const subjectFormWrapper = document.getElementById('subject-form-wrapper');
    const mainForm = document.getElementById('mainForm');
    const subjectsError = document.getElementById('subjectsError');

    function toggleSubjectForm() {
        if (yesRadio.checked) {
            subjectFormWrapper.style.display = 'block';
        } else {
            subjectFormWrapper.style.display = 'none';
        }
    }

    yesRadio.addEventListener('change', toggleSubjectForm);
    noRadio.addEventListener('change', toggleSubjectForm);

    mainForm.addEventListener('submit', function (e) {
        e.preventDefault();
        subjectsError.classList.add('hidden');
        const formErrorBar = document.getElementById('formErrorBar');
        formErrorBar.style.display = 'none';

        // Validate all required fields
        let valid = true;
        mainForm.querySelectorAll('input[required][type="text"], input[required][type="number"]').forEach(input => {
            if (!input.value.trim()) valid = false;
        });
        ['talim_turi', 'rus_daraja', 'ingliz_daraja', 'study_russia'].forEach(name => {
            const radios = mainForm.querySelectorAll(`input[name="${name}"]`);
            if (![...radios].some(r => r.checked)) valid = false;
        });

        if (yesRadio.checked) {
            const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(checkbox => checkbox.value);
            if (selectedSubjects.length === 0) {
                subjectsError.classList.remove('hidden');
                subjectsError.textContent = 'Пожалуйста, выберите хотя бы один предмет.';
                return;
            }
            if (selectedSubjects.length > 3) {
                subjectsError.classList.remove('hidden');
                subjectsError.textContent = 'Пожалуйста, выберите не более 3 предметов.';
                return;
            }
        }

        if (!valid) {
            formErrorBar.style.display = 'block';
            formErrorBar.textContent = "Iltimos, barcha majburiy maydonlarni to'ldiring!";
            return;
        }
        formErrorBar.style.display = 'none';

        // Collect all answers in order
        const answers = [];
        answers.push(document.getElementById('familiya').value.trim()); // 1
        answers.push(document.getElementById('ism').value.trim()); // 2
        answers.push(document.getElementById('telefon').value.trim()); // 3
        answers.push(document.getElementById('uy_telefon').value.trim()); // 4
        answers.push(document.getElementById('yonalish').value.trim()); // 5
        answers.push(document.getElementById('joy').value.trim()); // 6
        // Ta'lim turi
        const talimTuri = mainForm.querySelector('input[name="talim_turi"]:checked');
        answers.push(talimTuri ? talimTuri.nextElementSibling.textContent.trim() : ''); // 7
        // Nima uchun Rossiyada o'qishni xohlaysiz?
        answers.push(document.getElementById('why_study').value.trim()); // 8
        // Nima uchun Top universitetda o'qishni xohlaysiz?
        answers.push(document.getElementById('why_study_top').value.trim()); // 9
        // Kelajakda lavozim
        answers.push(document.getElementById('lavozim').value.trim()); // 10
        // Rus tili
        const rusDaraja = mainForm.querySelector('input[name="rus_daraja"]:checked');
        answers.push(rusDaraja ? rusDaraja.nextElementSibling.textContent.trim() : ''); // 11
        // Ingliz tili
        const inglizDaraja = mainForm.querySelector('input[name="ingliz_daraja"]:checked');
        answers.push(inglizDaraja ? inglizDaraja.nextElementSibling.textContent.trim() : ''); // 12
        // Sertifikat
        answers.push(document.getElementById('sertifikat').value.trim()); // 13
        // Rossiya universiteti
        const studyRussia = mainForm.querySelector('input[name="study_russia"]:checked');
        answers.push(studyRussia ? studyRussia.nextElementSibling.textContent.trim() : ''); // 14
        // Subjects (if any)
        let subjectsString = '';
        if (yesRadio.checked) {
            const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
            subjectsString = selectedSubjects.join(', ');
        }
        answers.push(subjectsString); // 15

        // Store as '1)answer 2)answer ...'
        const answersString = answers.map((ans, idx) => `${idx + 1})${ans}`).join(' ');
        localStorage.setItem('formAnswers', answersString);

        // Save all form data as an object to localStorage
        const mainFormData = {
            familiya: document.getElementById('familiya').value.trim(),
            ism: document.getElementById('ism').value.trim(),
            telefon: document.getElementById('telefon').value.trim(),
            uy_telefon: document.getElementById('uy_telefon').value.trim(),
            yonalish: document.getElementById('yonalish').value.trim(),
            joy: document.getElementById('joy').value.trim(),
            talim_turi: (mainForm.querySelector('input[name="talim_turi"]:checked') || {}).value || '',
            why_study: document.getElementById('why_study').value.trim(),
            why_study_top: document.getElementById('why_study_top').value.trim(),
            lavozim: document.getElementById('lavozim').value.trim(),
            rus_daraja: (mainForm.querySelector('input[name="rus_daraja"]:checked') || {}).value || '',
            ingliz_daraja: (mainForm.querySelector('input[name="ingliz_daraja"]:checked') || {}).value || '',
            sertifikat: document.getElementById('sertifikat').value.trim(),
            study_russia: (mainForm.querySelector('input[name="study_russia"]:checked') || {}).value || '',
            subjects: yesRadio.checked ? Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(cb => cb.value) : []
        };
        localStorage.setItem('mainFormData', JSON.stringify(mainFormData));

        // Send data to Google Form
        const formURL = 'YOUR_GOOGLE_FORM_URL'; // Replace with your actual Google Form URL

        // Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Create a form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = formURL;
        form.target = 'hidden_iframe';

        // Add all form fields
        const fields = {
            familiya: mainFormData.familiya,
            ism: mainFormData.ism,
            telefon: mainFormData.telefon,
            uy_telefon: mainFormData.uy_telefon,
            yonalish: mainFormData.yonalish,
            joy: mainFormData.joy,
            talim_turi: mainFormData.talim_turi,
            why_study: mainFormData.why_study,
            why_study_top: mainFormData.why_study_top,
            lavozim: mainFormData.lavozim,
            rus_daraja: mainFormData.rus_daraja,
            ingliz_daraja: mainFormData.ingliz_daraja,
            sertifikat: mainFormData.sertifikat,
            study_russia: mainFormData.study_russia,
            subjects: mainFormData.subjects
        };

        // Add each field to the form
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = `entry.${key}`; // Replace with your actual field ID
            input.value = fields[key];
            form.appendChild(input);
        });

        // Add form submission handler
        form.addEventListener('submit', function () {
            formErrorBar.style.display = 'none';
            // Store subjects if needed
            if (yesRadio.checked) {
                const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(checkbox => checkbox.value);
                localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
                window.location.href = 'result/results.html';
            }
        });

        // Store form data in localStorage
        localStorage.setItem('mainFormData', JSON.stringify(mainFormData));
        
        // Store subjects if needed
        if (yesRadio.checked) {
            const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(checkbox => checkbox.value);
            localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
            window.location.href = 'result/results.html';
        } else {
            localStorage.removeItem('selectedSubjects');
            window.location.href = 'thankyou.html';
        }
    });
});

// End of file to ensure proper closure


