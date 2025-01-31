const canvas = document.getElementById('circleCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const downloadButton = document.getElementById('downloadButton');
const inputContainer = document.getElementById("inputContainer");
const addSegmentButton = document.getElementById('addSegmentButton');

function resizeCanvas() {
    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.9;
    canvas.width = width;
    canvas.height = height;

    maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
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
    maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
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
        
        const score = Math.ceil((distance / maxRadius) * 10);
        section.score = Math.min(10, Math.max(1, score));
        
        drawWheel();
    }
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2 + 50, canvas.height / 2);
    
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function updateInputs() {
    inputContainer.innerHTML = "";
    sections.forEach((section, index) => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";

        const sectionLabel = document.createElement("span");
        sectionLabel.textContent = section.name;
        sectionLabel.style.cursor = 'pointer';
        sectionLabel.style.marginRight = "10px";
        sectionLabel.addEventListener('click', () => {
            const newName = prompt("שנה שם סגמנט", section.name);
            if (newName) {
                section.name = newName;
                drawWheel();
            }
        });
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✖";
        deleteButton.style.marginLeft = "5px";
        deleteButton.style.fontSize = "12px";
        deleteButton.style.padding = "0 5px";
        deleteButton.addEventListener("click", () => {
            sections.splice(index, 1);
            updateInputs();
            drawWheel();
        });

        div.appendChild(sectionLabel);
        div.appendChild(deleteButton);
        inputContainer.appendChild(div);
    });
}

function resetScores() {
    sections.forEach(section => section.score = 1);
    updateInputs();
    drawWheel();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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

resizeCanvas();
updateDimensions();
updateInputs();
drawWheel();
