import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7ebf4); // Light light pink background

//Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

//Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 4.5);
light.position.set(0, 9, 10);
scene.add(light);

// Loaders
const loader = new GLTFLoader();
let model, mixer;
let sessionActive = true;

// Load model
const modelUrl = new URL('../assets/Alice_normal.glb', import.meta.url);

loader.load(
    modelUrl.href,
    function (gltf) {
        model = gltf.scene;
        scene.add(model);

        // Adjust model
        model.scale.set(10, 9, 9.5);
        model.position.set(0, -9.3, -3.7);
        model.rotation.x = 0.25;

        // Move eyebrows and teeth slightly down
        // model.traverse((child) => {
        //     if (child.isMesh) {
        //         console.log(child.name);
                
        //         if (child.name === "Sphere" || child.name === "Sphere_1") {
        //             child.position.z += 0.025; // Bringing eyes down
        //         }
        //         if (child.name === "GEO_Polly_Eyebrows") {
        //             child.position.z += 0.02; // Bringing eye brows down
        //         }
        //         if (child.name === "GEO_Polly_Teeth") {
        //             child.position.z += 0.02; // Move teeth down slightly
        //         }
        //         if (child.name === "GEO_Polly_Hair") {
        //             child.position.z += 0.02; // Move hair down slightly
        //         }
        //     }
        // });

        // Animations
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        animate();
    },
    undefined,
    function (error) {
        console.error("Error loading model:", error);
    });

// Adjusted positions for equal spacing and elevation for Option 1 & 4
const cards = [
    createFloatingCard(-4.2, -0.3, "A"),
    createFloatingCard(-1.4, -0.6, "B"),
    createFloatingCard(1.4, -0.6, "C"),
    createFloatingCard(4.2, -0.3, "D")
];


// Timer Display (Top Right Corner)
const timerDiv = document.createElement("div");
timerDiv.style.position = "absolute";
timerDiv.style.top = "10px";
timerDiv.style.left = "20px";
timerDiv.style.fontSize = "24px";
timerDiv.style.fontWeight = "bold";
timerDiv.style.color = "black";
timerDiv.style.padding = "10px";
timerDiv.style.backgroundColor = "rgba(231, 207, 161, 0.9)"; // Orange background
timerDiv.style.borderRadius = "10px";
timerDiv.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
timerDiv.style.zIndex = "100";
document.body.appendChild(timerDiv);

let startTime, timerInterval;

// Function to start the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timerDiv.innerText = `Time: ${Math.floor((Date.now() - startTime) / 1000)}s`;
    }, 1000);
}

let finalTime = 0;
// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    finalTime = Math.floor((Date.now() - startTime) / 1000);
}

// Pause or Resume Display (Top Left Corner)
const pauseButton = document.createElement("button");
pauseButton.innerText = 'Pause';
pauseButton.style.position = "absolute";
pauseButton.style.top = "10px";
pauseButton.style.right = "20px";
pauseButton.style.fontSize = "24px";
pauseButton.style.fontWeight = "bold";
pauseButton.style.color = "black";
pauseButton.style.padding = "10px";
pauseButton.style.backgroundColor = "rgba(231, 207, 161, 0.9)"; // Orange background
pauseButton.style.borderRadius = "10px";
pauseButton.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
pauseButton.style.zIndex = "100";
document.body.appendChild(pauseButton);

pauseButton.addEventListener("click", function () {
    sessionActive = !sessionActive;
    this.innerText = sessionActive ? "Pause" : "Resume"; // Update button text

    if (!sessionActive) {
        clearInterval(timerInterval); // Stop timer
        speechSynthesis.cancel(); // Stop text-to-speech
    } else {
        timerInterval = setInterval(() => {
            timerDiv.innerText = `Time: ${Math.floor((Date.now() - startTime) / 1000)}s`;
        }, 1000);

        // Restart animation loop if not running
        animate();
        updateQuestion(); // Ensure the questions and options are refreshed
    }
});


let selectedQuestions = [];
let currentQuestionIndex = 0;

function loadQuestions() {
    try {
        // const response = fetch('../assets/Questions.json');
        // if (!response.ok) throw new Error(`Failed to load questions: ${response.status}`);

        const data = require('../assets/Questions.json');
        
        selectedQuestions = data.sort(() => Math.random() - 0.5).slice(0, 10);
        
        startTimer();
        updateQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}


// Create a question container
const questionDiv = document.createElement("div");
questionDiv.style.position = "absolute";
questionDiv.style.top = "45%";
questionDiv.style.left = "50%";
questionDiv.style.transform = "translate(-50%, -50%)";
questionDiv.style.fontSize = "36px";
questionDiv.style.fontWeight = "bold";
questionDiv.style.color = "black";
questionDiv.style.padding = "15px";
questionDiv.style.backgroundColor = "rgba(166, 236, 215, 0.9)"; // Light background for contrast
questionDiv.style.borderRadius = "10px";
questionDiv.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
questionDiv.style.zIndex = "100"; // Ensure it's above other elements
questionDiv.style.textAlign = "center";
document.body.appendChild(questionDiv);

loadQuestions();

// Function to create a floating card
function createFloatingCard(x, y, text) {
    const geometry = new THREE.PlaneGeometry(2, 2.7);
    const material = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });

    const card = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2.7),
        new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide }));
    card.position.set(x, y, 0.5);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 270;
    canvas.height = 512;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#99CCFF"; 

    const radius = 50; // Increased for more rounded corners
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "Bold 32px Arial"; // Smaller text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    card.position.set(x, y, 0.5);
    card.userData.optionText = text; // Store text in card metadata

    const texture = new THREE.CanvasTexture(canvas);
    card.material.map = texture;
    card.material.needsUpdate = true;

    scene.add(card);
    updateCardText(card, text);
    return card;
}

//Flipping Cards after each Question
function flipCards(callback) {
    let flippedCount = 0;

    cards.forEach((card, index) => {
        const targetRotation = card.rotation.y + Math.PI; // Flip 360° instead of 180°

        if (typeof gsap !== "undefined") {
            gsap.to(card.rotation, {
                y: targetRotation,
                duration: 1.2, // Slightly longer duration since it's two flips
                ease: "power2.inOut",
                onComplete: () => {
                    flippedCount++;
                    updateCardText(card, `Question ${index + 1}`);
                    if (flippedCount === cards.length && callback) callback();
                },
            });
        } else {
            let currentTime = 0;
            const duration = 1200;
            const initialRotation = card.rotation.y;

            function animateFlip(timestamp) {
                if (!currentTime) currentTime = timestamp;
                const progress = (timestamp - currentTime) / duration;

                if (progress < 1) {
                    card.rotation.y = initialRotation + progress * Math.PI; // Full 360° flip
                    requestAnimationFrame(animateFlip);
                } else {
                    card.rotation.y = targetRotation;
                    flippedCount++;
                    updateCardText(card, `Question ${index + 1}`);
                    if (flippedCount === cards.length && callback) callback();
                }
            }
            requestAnimationFrame(animateFlip);
        }
    });
}


// Function to update card text
function updateCardText(card, text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 270;
    canvas.height = 512;

    const radius = 50;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw rounded rectangle background
    ctx.fillStyle = "#99CCFF";
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.arc(canvas.width - radius, radius, radius, -Math.PI / 2, 0, false);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.arc(canvas.width - radius, canvas.height - radius, radius, 0, Math.PI / 2, false);
    ctx.lineTo(radius, canvas.height);
    ctx.arc(radius, canvas.height - radius, radius, Math.PI / 2, Math.PI, false);
    ctx.lineTo(0, radius);
    ctx.arc(radius, radius, radius, Math.PI, -Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();

    // Draw text
    ctx.fillStyle = "black";
    ctx.font = "Bold 32px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);

    // Force correct UV mapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1; // Flip horizontally
    texture.needsUpdate = true;

    // Apply texture
    card.material.map = texture;
    card.material.needsUpdate = true;

    // Flip text when needed
    if (card.rotation.y % (Math.PI * 2) !== 0) {
        card.scale.x = 1; // Fix mirroring issue
    } else {
        card.scale.x = -1; // Normal state
    }
}

// Smooth floating animation
function animateFloating() {
    const time = Date.now() * 0.003;
    const floatOffset = Math.sin(time) * 0.003; // Subtle movement
    cards.forEach(card => {
        card.position.y += floatOffset;
    });
}


function updateQuestion() {
    if (!sessionActive || currentQuestionIndex >= selectedQuestions.length) return;

    const questionData = selectedQuestions[currentQuestionIndex];
    if (!questionData || !questionData["Question"]) {
        console.error("Invalid question data:", questionData);
        return;
    }

    questionDiv.innerText = questionData["Question"];

    const options = [questionData.A, questionData.B, questionData.C, questionData.D];

    flipCards(() => {
        cards.forEach((card, i) => updateCardText(card, options[i] || ""));
    });
}

let userResponses = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
    if (!sessionActive) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards);

    if (intersects.length > 0) {
        const selectedCard = intersects[0].object;
        const selectedOption = selectedCard.userData.optionText || "No Answer"; // Retrieve stored option text

        // Save user's response
        userResponses.push({
            question: selectedQuestions[currentQuestionIndex]["Question"],
            answer: selectedOption
        });

        console.log(`Saved Response - Q${currentQuestionIndex + 1}: ${selectedOption}`); // Debugging

        currentQuestionIndex++;
        if (currentQuestionIndex < selectedQuestions.length) {
            updateQuestion();
        } else {
            stopTimer();
            showSessionCompletionOverlay();
            console.log("User Responses:", userResponses); // Debugging output
        }
    }
});


function showSessionCompletionOverlay() {
    sessionActive = false;
    // Hide UI elements
    questionDiv.style.display = "none";
    timerDiv.style.display = "none";
    pauseButton.style.display = "none";
    const overlay = document.createElement("div");
    // const overlay = document.getElementById("session-completion-overlay");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Dark gray transparency
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.fontSize = "30px";
    overlay.style.fontWeight = "bold";
    overlay.style.color = "white";
    overlay.style.padding = "20px";

    let resultText = `✨ Session Completed ✨\n\nTime Taken: ${finalTime}s\n\n`;
    userResponses.forEach((resp, index) => {
        resultText += `Q${index + 1}: ${resp.question}\nAns: ${resp.answer}\n`;
    });

    overlay.innerText = resultText;
    overlay.style.display = "block";
    document.body.appendChild(overlay);
}

// Animation loop
function animate() {
    if (sessionActive){
        requestAnimationFrame(animate);
        if (mixer) mixer.update(0.016);
        animateFloating();
        renderer.render(scene, camera);
    }
    else{
        return;
    }
}
animate();

function startNewSession() {
    sessionActive = true;
    startTimer();
    currentQuestionIndex = 0;
    userResponses = [];
    updateQuestion();
    animate(); // Restart animation

    // Show UI elements again
    document.getElementById("question-container").style.display = "block";
    document.getElementById("timer").style.display = "block";
    document.getElementById("pause-btn").style.display = "block";

    // Hide session completion overlay
    document.getElementById("session-completion-overlay").style.display = "none";
}



// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});