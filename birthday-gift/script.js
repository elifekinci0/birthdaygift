
const startBtn = document.getElementById("startBtn");
const openBtn = document.getElementById("openBtn");
const restartBtn = document.getElementById("restartBtn");

const intro = document.getElementById("intro");
const heartSection = document.getElementById("heartSection");
const messageSection = document.getElementById("messageSection");

const heart = document.getElementById("heart");

const loveText = "Я ТЕБЯ ЛЮБЛЮ";

let heartCreated = false;
let heartTimer;

// Gerçek kalp eğrisinin noktalarını oluştur
function getHeartPoints() {
    const points = [];

    for (let i = 0; i <= 500; i++) {
        const t = (i / 500) * Math.PI * 2;

        const x = 16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        points.push({ x, y });
    }

    return points;
}

// Kalp eğrisinin yatay satırlarla kesiştiği yerleri bul
function getRowIntervals(points, y) {
    const intersections = [];

    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];

        if ((a.y <= y && b.y > y) ||
            (b.y <= y && a.y > y)) {

            const ratio = (y - a.y) / (b.y - a.y);

            const x = a.x + ratio * (b.x - a.x);

            intersections.push(x);
        }
    }

    intersections.sort((a, b) => a - b);

    const intervals = [];

    for (let i = 0; i + 1 < intersections.length; i += 2) {
        intervals.push([
            intersections[i],
            intersections[i + 1]
        ]);
    }

    return intervals;
}

// Kalbi yazılarla doldur
function createHeart() {
    heart.innerHTML = "";

    const points = getHeartPoints();

    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const width = heart.clientWidth;
    const height = heart.clientHeight;

    const scale = Math.min(
        (width - 20) / 34,
        (height - 20) / (maxY - minY)
    );

    const centerX = width / 2;
    const centerY = height / 2;

    // Yazı genişliğini ölç
    const measure = document.createElement("span");
    measure.className = "heart-word";
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.opacity = "1";
    measure.textContent = loveText;

    heart.appendChild(measure);

    const wordWidth = measure.getBoundingClientRect().width;
    measure.remove();

    const gap = 9;
    const wordStep = wordWidth + gap;

    let rowIndex = 0;

    // Kalbin içini yukarıdan aşağıya doldur
    for (let y = maxY - 0.8; y >= minY + 0.8; y -= 1.8) {

        const intervals = getRowIntervals(points, y);

        for (const [left, right] of intervals) {

            const leftPx = centerX + left * scale;
            const rightPx = centerX + right * scale;

            const rowWidth = rightPx - leftPx;

            const count = Math.floor(
                (rowWidth + gap) / wordStep
            );

            if (count < 1) continue;

            const totalWidth = count * wordWidth
                + (count - 1) * gap;

            const firstX =
                (leftPx + rightPx) / 2 - totalWidth / 2;

            for (let i = 0; i < count; i++) {

                const word = document.createElement("span");

                word.className = "heart-word";
                word.textContent = loveText;

                const x = firstX
                    + i * wordStep
                    + wordWidth / 2;

                const screenY =
                    centerY - (y * scale);

                word.style.left = `${x}px`;
                word.style.top = `${screenY}px`;

                word.style.transitionDelay =
                    `${Math.min(rowIndex * 120, 3500)}ms`;

                heart.appendChild(word);
            }
        }

        rowIndex++;
    }

    heartCreated = true;

    requestAnimationFrame(() => {
        heart.classList.add("formed");
    });

    heartTimer = setTimeout(() => {
        openBtn.hidden = false;
    }, 5000);
}

// İlk ekrandan kalbe geç
startBtn.addEventListener("click", () => {
    intro.hidden = true;
    heartSection.hidden = false;

    openBtn.hidden = true;

    createHeart();
});

// Son mesaja geç
openBtn.addEventListener("click", () => {
    if (!heartCreated) return;

    clearTimeout(heartTimer);

    heartSection.hidden = true;
    messageSection.hidden = false;
});

// Başa dön
restartBtn.addEventListener("click", () => {
    clearTimeout(heartTimer);

    messageSection.hidden = true;
    heartSection.hidden = true;
    intro.hidden = false;

    heart.innerHTML = "";
    heart.classList.remove("formed");

    openBtn.hidden = true;
    heartCreated = false;
});
