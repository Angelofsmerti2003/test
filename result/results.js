document.addEventListener('DOMContentLoaded', function() {
    const storedSubjects = localStorage.getItem('selectedSubjects');
    const subjectsList = document.getElementById('subjectsList');
    const selectedSubjectsDiv = document.getElementById('selectedSubjects');

    // Map English values to Russian for display
    const subjectNames = {
        maths: 'Математика',
        psychology: 'Психология',
        russian: 'Русский язык',
        physics: 'Физика',
        chemistry: 'Химия',
        english: 'Английский язык',
        biology: 'Биология',
        informatics: 'Информатика'
    };

    if (storedSubjects) {
        const selectedSubjects = JSON.parse(storedSubjects);
        selectedSubjects.forEach(subject => {
            const li = document.createElement('li');
            li.textContent = subjectNames[subject];
            subjectsList.appendChild(li);
        });
    } else {
        subjectsList.innerHTML = '<li>Нет выбранных предметов.</li>';
    }
});