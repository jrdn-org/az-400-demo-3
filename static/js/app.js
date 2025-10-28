// Interactive JavaScript for the Flask App
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    loadStats();
    loadProjects();
    setupScrollAnimations();
    setupIntersectionObserver();
    initializeJokeSection();
});

// Load statistics from API
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        document.getElementById('totalProjects').querySelector('.stat-number').textContent = stats.total_projects;
        document.getElementById('completedProjects').querySelector('.stat-number').textContent = stats.completed;
        document.getElementById('avgProgress').querySelector('.stat-number').textContent = `${stats.average_progress}%`;

        // Animate stat numbers
        animateNumbers();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load projects from API
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();

        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';

        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });

        // Animate progress bars after cards are created
        setTimeout(() => {
            animateProgressBars();
        }, 500);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Create project card element
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${project.name}</h3>
            <span class="project-status status-${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
        </div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" data-progress="${project.progress}"></div>
            </div>
            <div class="progress-text">${project.progress}% Complete</div>
        </div>
    `;

    return card;
}

// Animate progress bars
function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const progress = fill.dataset.progress;
        fill.style.width = `${progress}%`;
    });
}

// Animate numbers with counting effect
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(number => {
        const target = parseInt(number.textContent.replace('%', ''));
        if (!isNaN(target)) {
            animateNumber(number, 0, target, 1000);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const isPercentage = element.textContent.includes('%');

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * progress);
        element.textContent = isPercentage ? `${current}%` : current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Theme switching functionality
function changeTheme() {
    const body = document.body;
    const currentTheme = body.dataset.theme;

    if (currentTheme === 'light') {
        delete body.dataset.theme;
        showNotification('Switched to dark theme!', 'success');
    } else {
        body.dataset.theme = 'light';
        showNotification('Switched to light theme!', 'success');
    }

    // Add transition effect
    body.style.transition = 'background-color 0.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
}

// Animate progress bars globally
function animateProgress() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        fill.style.animation = 'none';
        fill.offsetHeight; // Trigger reflow
        fill.style.animation = 'shimmer 2s infinite';
    });

    showNotification('Progress bars animated!', 'info');
}

// Create particle effect
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random delay
        particle.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    showNotification('✨ Magic particles created!', 'success');
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for header
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${rate * 0.1}px)`;
        }
    });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe all cards
    document.querySelectorAll('.project-card, .interactive-card').forEach(card => {
        observer.observe(card);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'}-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add click effects to cards
document.addEventListener('click', function(e) {
    if (e.target.closest('.project-card') && !e.target.closest('button')) {
        const card = e.target.closest('.project-card');
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        changeTheme();
    }
    if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        createParticles();
    }
    if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault();
        animateProgress();
    }
    if (e.key === 'j' && e.ctrlKey) {
        e.preventDefault();
        getRandomJoke();
    }
});

// Joke Generator Functionality
let currentJoke = null;
let typingTimeouts = [];

// Initialize joke section
async function initializeJokeSection() {
    try {
        const response = await fetch('/api/joke-categories');
        const data = await response.json();

        const categorySelect = document.getElementById('jokeCategory');
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });

        // Load initial joke
        await getRandomJoke();
    } catch (error) {
        console.error('Error initializing joke section:', error);
    }
}

// Get random joke
async function getRandomJoke() {
    try {
        const categorySelect = document.getElementById('jokeCategory');
        const selectedCategory = categorySelect.value;

        const url = selectedCategory ? `/api/jokes/${selectedCategory}` : '/api/joke';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const joke = await response.json();
        currentJoke = joke;

        // Clear any existing typing timeouts
        typingTimeouts.forEach(timeout => clearTimeout(timeout));
        typingTimeouts = [];

        // Start typing animation
        await typeJoke(joke);

        showNotification('🤣 New joke loaded!', 'success');
    } catch (error) {
        console.error('Error fetching joke:', error);
        showNotification('❌ Failed to load joke', 'error');
    }
}

// Type joke with animation
async function typeJoke(joke) {
    const setupElement = document.getElementById('jokeSetup');
    const punchlineElement = document.getElementById('jokePunchline');
    const categoryElement = document.getElementById('jokeCategoryDisplay');

    // Clear previous content
    setupElement.textContent = '';
    punchlineElement.textContent = '';
    categoryElement.textContent = '';

    // Remove typing classes
    setupElement.classList.remove('typing', 'typing-done');
    punchlineElement.classList.remove('typing', 'typing-done');

    // Type setup
    await typeText(setupElement, joke.setup, 50);

    // Wait a bit before punchline
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type punchline
    await typeText(punchlineElement, joke.punchline, 50);

    // Show category
    categoryElement.textContent = `Category: ${joke.category.charAt(0).toUpperCase() + joke.category.slice(1)}`;

    // Add some fun effects
    setTimeout(() => {
        createJokeParticles();
    }, 500);
}

// Type text character by character
function typeText(element, text, speed) {
    return new Promise(resolve => {
        element.classList.add('typing');
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                const timeout = setTimeout(type, speed);
                typingTimeouts.push(timeout);
            } else {
                element.classList.remove('typing');
                element.classList.add('typing-done');
                resolve();
            }
        }

        type();
    });
}

// Handle joke reactions
function reactToJoke(reaction) {
    if (!currentJoke) return;

    const reactionBtn = event.target.closest('.reaction-btn');
    if (!reactionBtn) return;

    // Add reaction animation
    reactionBtn.classList.add(`reaction-${reaction}`);

    // Remove animation after it completes
    setTimeout(() => {
        reactionBtn.classList.remove(`reaction-${reaction}`);
    }, 600);

    // Show reaction notification
    const messages = {
        laugh: '😂 ROFL! That was hilarious!',
        meh: '😐 Meh... Not my favorite',
        groan: '😩 Facepalm... That hurt!'
    };

    showNotification(messages[reaction], 'info');

    // Create reaction particles
    createReactionParticles(reaction);
}

// Create joke particles when joke loads
function createJokeParticles() {
    const container = document.getElementById('particles-container');
    const emojis = ['😂', '🤣', '😄', '😆', '🤪'];

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.cssText = `
            position: absolute;
            font-size: 24px;
            pointer-events: none;
            z-index: 1000;
            animation: jokeFloat 2s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;

        container.appendChild(particle);

        setTimeout(() => particle.remove(), 2000);
    }
}

// Create reaction particles
function createReactionParticles(reaction) {
    const container = document.getElementById('particles-container');
    const emojis = {
        laugh: ['😂', '🤣', '😄', '😆'],
        meh: ['😐', '😕', '🤔'],
        groan: ['😩', '🤦', '😫', '😖']
    };

    const reactionEmojis = emojis[reaction] || ['✨'];

    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.textContent = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        particle.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: reactionBurst 1.5s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;

        container.appendChild(particle);

        setTimeout(() => particle.remove(), 1500);
    }
}

// Add joke animations to CSS dynamically
const jokeStyle = document.createElement('style');
jokeStyle.textContent = `
    @keyframes jokeFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.2) rotate(180deg);
        }
    }

    @keyframes reactionBurst {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) rotate(360deg) translateY(-30px);
        }
    }
`;
document.head.appendChild(jokeStyle);

// Console message for developers
console.log(`
🚀 Flask App with Interactive UI Loaded!

Keyboard shortcuts:
- Ctrl+T: Toggle theme
- Ctrl+P: Create particles
- Ctrl+A: Animate progress
- Ctrl+J: Get random joke

Enjoy exploring the app!
`);