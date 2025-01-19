const canvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const downloadButton = document.getElementById('downloadButton');

// Make canvas size responsive
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    drawWheel();
}

const sections = [
    { name: "משפחה וחברים", color: "#B666D2", score: 1 },
    { name: "זוגיות", color: "#90C590", score: 1 },
    { name: "תחביבים", color: "#6B8DD6", score: 1 },
    { name: "בריאות פיזית", color: "#4E9E4E", score: 1 },
    { name: "בריאות מנטלית", color: "#F4A460", score: 1 },
    { name: "מגורים", color: "#E47283", score: 1 },
    { name: "כסף", color: "#7EB6DD", score: 1 },
    { name: "צמיחה אישית", color: "#FFD700", score: 1 },
    { name: "קריירה", color: "#32D700", score: 1 }
];

let maxRadius;
let radiusStep;

function updateDimensions() {
    maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    radiusStep = maxRadius / 10;
}

// Handle click/tap events
function handleClick(event) {
    event.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get coordinates based on event type (touch or click)
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    
    const x = (clientX - rect.left) * scaleX - canvas.width / 2;
    const y = (clientY - rect.top) * scaleY - canvas.height / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x) + Math.PI / 2;
    const sectionAngle = (Math.PI * 2) / sections.length;
    
    if (distance <= maxRadius) {
        const sectionIndex = Math.floor(((angle + Math.PI * 2) % (Math.PI * 2)) / sectionAngle);
        const section = sections[sectionIndex];
        
        // Calculate score based on click distance
        const score = Math.ceil((distance / maxRadius) * 10);
        section.score = Math.min(10, Math.max(1, score));
        
        drawWheel();
    }
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Draw concentric circles
    for (let i = 1; i <= 10; i++) {
        const radius = i * radiusStep;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Draw sections
    const sectionAngle = (Math.PI * 2) / sections.length;
    sections.forEach((section, index) => {
        const startAngle = index * sectionAngle - Math.PI / 2; // Adjusting to start at the top
        const endAngle = startAngle + sectionAngle;
        const scoreRadius = section.score * radiusStep;

        // Draw filled section to score
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, scoreRadius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = section.color;
        ctx.fill();
        
        // Draw section outline
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add labels
        const labelRadius = maxRadius + (maxRadius * 0.12); // Position of the label
        const labelAngle = startAngle + sectionAngle / 2;
        const labelX = Math.cos(labelAngle) * labelRadius;
        const labelY = Math.sin(labelAngle) * labelRadius;

        // Draw the label straight (horizontal)
        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        const fontSize = Math.max(12, canvas.width * 0.018);
        ctx.font = `${fontSize}px Arial`;

        // Now we don't rotate the label, so they will all be horizontal
        ctx.fillText(section.name, 0, 0);
        ctx.restore();

        // Add score
        const scoreX = Math.cos(labelAngle) * (scoreRadius - 20);
        const scoreY = Math.sin(labelAngle) * (scoreRadius - 20);
        ctx.font = `bold ${Math.max(12, canvas.width * 0.02)}px Arial`;
        ctx.fillStyle = '#fff';
        if (section.score > 1) {
            ctx.fillText(section.score, scoreX, scoreY);
        }
    });

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawWheelPrev() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Draw concentric circles
    for (let i = 1; i <= 10; i++) {
        const radius = i * radiusStep;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Draw sections
    const sectionAngle = (Math.PI * 2) / sections.length;
    sections.forEach((section, index) => {
        const startAngle = index * sectionAngle - Math.PI / 2;
        const endAngle = startAngle + sectionAngle;
        const scoreRadius = (section.score * radiusStep);

        // Draw filled section to score
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, scoreRadius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = section.color;
        ctx.fill();
        
        // Draw section outline
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add labels
        const labelRadius = maxRadius + (maxRadius * 0.12);
        const labelAngle = startAngle + sectionAngle / 2;
        const labelX = Math.cos(labelAngle) * labelRadius;
        const labelY = Math.sin(labelAngle) * labelRadius;

        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.rotate(labelAngle + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        const fontSize = Math.max(12, canvas.width * 0.018);
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(section.name, 0, 0);
        
        // Add score
        const scoreX = Math.cos(labelAngle) * (scoreRadius - 20);
        const scoreY = Math.sin(labelAngle) * (scoreRadius - 20);
        ctx.restore();
        ctx.font = `bold ${fontSize * 1.2}px Arial`;
        ctx.fillStyle = '#fff';
        if (section.score > 1) {
            ctx.fillText(section.score, scoreX, scoreY);
        }
    });

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function resetScores() {
    sections.forEach(section => section.score = 1);
    drawWheel();
}

// Event listeners
canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', handleClick, { passive: false });

// Remove old touchend listener and add touchmove prevention
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Handle resize
window.addEventListener('resize', () => {
    resizeCanvas();
    updateDimensions();
});

// Add reset button event listener
resetButton.addEventListener('click', resetScores);
resetButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    resetScores();
});

// Add download button event listener
downloadButton.addEventListener('click', downloadImage);
downloadButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    downloadImage();
});

// Initial setup
resizeCanvas();
updateDimensions();
drawWheel(); 

// Add this function to handle download
function downloadImage() {
    // Create a temporary link
    const link = document.createElement('a');
    
    // Set the download name
    const date = new Date().toISOString().slice(0,10);
    link.download = `wheel-of-life-${date}.png`;
    
    // Convert canvas to data URL
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 
