const canvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const downloadButton = document.getElementById('downloadButton');
const inputContainer = document.getElementById("inputContainer");
const addSegmentButton = document.getElementById('addSegmentButton');
const editButton = document.getElementById('editButton');

let editingIndex = -1;  // נשתמש בזה כדי לדעת אם אנחנו במצב עריכה של שם סגמנט
let isEditing = false; // מצב עריכה - דיפולטיבי false
let isDragging = false; // משתנה לגלילה
let startX, startY; // משתנים לגרירה

function resizeCanvas() {
    const width = window.innerWidth * 0.9; // גודל הקנבס 90% מהמסך
    const height = window.innerHeight * 0.9; // גובה הקנבס 90% מהמסך
    canvas.width = width;
    canvas.height = height;

    // הגדרת המקסימום לפי הצד הקצר של הקנבס
    maxRadius = Math.min(canvas.width, canvas.height) * 0.38;  // הקטנת הגלגל
    radiusStep = maxRadius / 10;

    drawWheel();
}

const sections = [
    { name: "משפחה וחברים", color: "#B6D8D2", score: 1 },
    { name: "זוגיות", color: "#F1C6D2", score: 1 },
    { name: "תחביבים", color: "#B6C9F4", score: 1 },
    { name: "בריאות פיזית", color: "#B5E3A1", score: 1 },
    { name: "בריאות מנטלית", color: "#F4D1A2", score: 1 },
    { name: "מגורים", color: "#F4A7B8", score: 1 },
    { name: "כסף", color: "#A1D3F3", score: 1 },
    { name: "צמיחה אישית", color: "#F9E2B3", score: 1 },
    { name: "קריירה", color: "#D0E0A5", score: 1 }
];

let maxRadius;
let radiusStep;

function updateDimensions() {
    maxRadius = Math.min(canvas.width, canvas.height) * 0.38;  // הקטנת הגלגל
    radiusStep = maxRadius / 10;
}

function handleClick(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

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

        const sectionLabelRadius = maxRadius + (maxRadius * 0.25);
        const labelAngle = angle + sectionAngle / 2;
        const labelX = Math.cos(labelAngle) * sectionLabelRadius;
        const labelY = Math.sin(labelAngle) * sectionLabelRadius;

        // אם לחצת על טקסט של סגמנט, תאפשר לשנות אותו
        if (Math.abs(clientX - rect.left - labelX) < 50 && Math.abs(clientY - rect.top - labelY) < 20) {
            editingIndex = sectionIndex;
            updateInputs();
        }

        const score = Math.ceil((distance / maxRadius) * 10);
        section.score = Math.min(10, Math.max(1, score));

        drawWheel();
    }
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // תזוזה למרכז הקנבס
    ctx.translate(canvas.width / 2, canvas.height / 2);

    for (let i = 1; i <= 10; i++) {
        const radius = i * radiusStep;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    const sectionAngle = (Math.PI * 2) / sections.length;
    sections.forEach((section, index) => {
        const startAngle = index * sectionAngle - Math.PI / 2;
        const endAngle = startAngle + sectionAngle;
        const scoreRadius = section.score * radiusStep;
    
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, scoreRadius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = section.color;
        ctx.fill();
    
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
    
        const labelRadius = maxRadius + (maxRadius * 0.25);
        const labelAngle = startAngle + sectionAngle / 2;
        const labelX = Math.cos(labelAngle) * labelRadius;
        const labelY = Math.sin(labelAngle) * labelRadius;
    
        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        const fontSize = Math.max(12, canvas.width * 0.018);
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(section.name, 0, 0);
        ctx.restore();
    
        const scoreAngle = startAngle + sectionAngle / 2;
        const scoreRadiusOffset = radiusStep * (section.score - 1);
        const scoreX = Math.cos(scoreAngle) * (scoreRadiusOffset + radiusStep / 2);
        const scoreY = Math.sin(scoreAngle) * (scoreRadiusOffset + radiusStep / 2);
    
        ctx.save();
        ctx.translate(scoreX, scoreY);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = `${Math.max(10, canvas.width * 0.02)}px Arial`;
        ctx.fillText(section.score, 0, 0);
        ctx.restore();
    });

    // Reset translation so that subsequent drawings aren't affected
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function updateInputs() {
    inputContainer.innerHTML = "";

    if (isEditing) {
        sections.forEach((section, index) => {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.alignItems = "center";
            
            const input = document.createElement("input");
            input.type = "text";
            input.value = section.name;
            input.className = "segment-input";
            input.addEventListener("input", (event) => {
                sections[index].name = event.target.value;
                drawWheel();
            });

            if (index === editingIndex) {
                input.focus();
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "✖";
            deleteButton.style.marginLeft = "5px";
            deleteButton.addEventListener("click", () => {
                sections.splice(index, 1);
                updateInputs();
                drawWheel();
            });

            div.appendChild(input);
            div.appendChild(deleteButton);
            inputContainer.appendChild(div);
        });
    }
}

function resetScores() {
    sections.forEach(section => section.score = 1);
    updateInputs();
    drawWheel();
}

// Generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Add new section with random color
addSegmentButton.addEventListener('click', () => {
    const newSection = {
        name: "New Segment",
        color: getRandomColor(),
        score: 1
    };
    sections.push(newSection);
    updateInputs();
    drawWheel();
});

canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', handleClick, { passive: false });
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

window.addEventListener('resize', () => {
    resizeCanvas();
    updateDimensions();
});

resetButton.addEventListener('click', resetScores);
downloadButton.addEventListener('click', () => {
    const link = document.createElement("a");
    link.download = "wheel_of_life.png";
    link.href = canvas.toDataURL();
    link.click();
});

editButton.addEventListener('click', () => {
    isEditing = !isEditing;
    updateInputs();
});

// גרירה לקנבס
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    const dx = x - startX;
    const dy = y - startY;

    canvas.style.transform = `translate(${dx}px, ${dy}px)`;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

resizeCanvas();
updateDimensions();
updateInputs();
drawWheel();
