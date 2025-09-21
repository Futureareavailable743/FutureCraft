
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});


document.querySelector('.scroll-down-button').addEventListener('click', function(){
    window.scrollTo({ top: document.querySelector('#next-section').offsetTop,
behavior: 'smooth'
    });
});