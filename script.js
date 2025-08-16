// Handle FAQ toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Handle contact form submission (example only)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    if (!fullName || !email || !phone || !whatsapp) {
        alert('Please fill in all fields!');
        return;
    }

    // Example only — send data to server here
    alert(`Thanks ${fullName}, your info has been submitted!`);
    
    // Optional: clear form
    this.reset();
});

// Simulated Live Chat button
function openChat() {
    alert('Opening live chat... (Integrate with Tawk.to, Crisp, etc.)');
}
