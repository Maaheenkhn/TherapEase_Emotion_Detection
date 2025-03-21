import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import questionsData from "../assets/Questions.json"; // Ensure the file path is correct
import Easing from '@tweenjs/tween.js';
import TWEEN from '@tweenjs/tween.js';

const ThreeScene = ({sessionId}) => {
    const API_URL = "http://localhost:5000"; // Change to your Flask server URL

    // Function to submit answer
    const submitAnswer = async (session_id, question, selected_answer) => {
        console.log("Submitting answer..."); // Debug: Function is called
        console.log("Session ID:", session_id); // Debug: Log session ID
        console.log("Question:", question); // Debug: Log the question
        console.log("Selected Answer:", selected_answer); // Debug: Log the selected answer

        try {
            // Make the POST request
            const response = await fetch("http://localhost:5000/submit-response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id,
                    question,
                    response: selected_answer,
                }),
            });


            // Debug: Check the response status
            console.log("Response Status:", response.status);
            
            // Check if the response was successful
            if (!response.ok) {
                console.error("Failed to submit answer. Status:", response.status); // Log the error status
            } else {
                console.log("Answer submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting answer:", error); // Log error if fetch fails
        }
    };


    const mountRef = useRef(null);
    const [timer, setTimer] = useState(0);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sessionCompleted, setSessionCompleted] = useState(false); // Track session completion
    const [userAnswers, setUserAnswers] = useState([]); // Track user's answers
    const mixerRef = useRef(null); // Use ref to persist animation mixer
    const raycasterRef = useRef(new THREE.Raycaster()); // Raycaster reference
    const mouseRef = useRef(new THREE.Vector2()); // Mouse position reference

    useEffect(() => {
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
            console.error("Error: Questions data is empty or not an array!");
            return;
        }

        // Shuffle and select 10 questions
        const shuffledQuestions = [...questionsData]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10)
            .map((q) => ({
                question: q.Question,
                options: [q.A, q.B, q.C, q.D],
                correctAnswer: q['Correct Answer'], // Assuming correct answer is stored in 'CorrectAnswer'
            }));

        setSelectedQuestions(shuffledQuestions);
        console.log('Questions', shuffledQuestions);
    }, []);

    useEffect(() => {
        let interval;
        
        if (sessionStarted && !sessionCompleted) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval); // Stop timer when session ends
        }
    
        return () => clearInterval(interval); // Cleanup on unmount
    }, [sessionStarted, sessionCompleted]);
    
    useEffect(() => {
        if (selectedQuestions.length > 0) {
            setSessionStarted(true); // Start the timer when questions load
        }
    }, [selectedQuestions]);
    
    

    const currentQuestion = selectedQuestions[currentQuestionIndex]?.question || "Loading...";
    const currentOptions = selectedQuestions[currentQuestionIndex]?.options || ["Loading...", "Loading...", "Loading...", "Loading..."];
    const correctAnswer = selectedQuestions[currentQuestionIndex]?.correctAnswer || "Loading...";

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7ebf4);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1, 5);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        // Load 3D Model
        const loader = new GLTFLoader();
        const modelUrl = new URL("../assets/Alice_normal.glb", import.meta.url);
        loader.load(modelUrl.href, (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            model.scale.set(10, 9, 9.5);
            model.position.set(0, -9.3, -3.7);
            model.rotation.x = 0.25;

            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.play();
            });
            mixerRef.current = mixer;
        });

        const createFloatingCard = (x, y, text) => {
            const geometry = new THREE.PlaneGeometry(2, 2.7);
            const material = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
            const card = new THREE.Mesh(geometry, material);
            card.position.set(x, y, 0.5);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 270;
            canvas.height = 512;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#99CCFF";
            const radius = 50;
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
            ctx.font = "Bold 32px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            card.material.map = texture;
            card.material.needsUpdate = true;

            scene.add(card);
            return card;
        };

        const cards = [
            createFloatingCard(-4.2, -0.3, currentOptions[0]),
            createFloatingCard(-1.4, -0.6, currentOptions[1]),
            createFloatingCard(1.4, -0.6, currentOptions[2]),
            createFloatingCard(4.2, -0.3, currentOptions[3]),
        ];

        const initialCardPositions = cards.map((card) => card.position.y);

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            TWEEN.update();
            const time = clock.getElapsedTime();
            cards.forEach((card, index) => {
                card.position.y = initialCardPositions[index] + Math.sin(time * 2) * 0.2;
            });
            

            if (mixerRef.current) mixerRef.current.update(clock.getDelta());
            renderer.render(scene, camera);
        };
        animate();

        // Raycast to detect mouse clicks on cards
        const onMouseClick = (event) => {
            // Normalize mouse coordinates
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Set the raycaster from the camera and the mouse position
            raycasterRef.current.setFromCamera(mouseRef.current, camera);

            // Raycast to find intersections with the cards
            const intersects = raycasterRef.current.intersectObjects(cards);
            if (intersects.length > 0) {
                const clickedCard = intersects[0].object;
                const selectedOptionIndex = cards.indexOf(clickedCard);
                const selectedAnswer = currentOptions[selectedOptionIndex];

                // Log the question, selected answer, and the correct answer
                console.log("Question:", currentQuestion);
                console.log("Selected Answer:", selectedAnswer);
                console.log("Correct Answer:", correctAnswer);

                // Submit answer to Flask API
                submitAnswer(sessionId, currentQuestion, selectedAnswer);

                // Animate the flip (horizontal)
                const targetRotation = clickedCard.rotation.y + Math.PI; // Flip by 180 degrees
                new TWEEN.Tween(clickedCard.rotation) // Use TWEEN.Tween instead
                    .to({ y: targetRotation }, 500)
                    .easing(TWEEN.Easing.Quadratic.Out) // Use TWEEN.Easing correctly
                    .start();


                // Move to the next question after the flip
                if (currentQuestionIndex < 9) {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Increment only until the 10th question
                    // Save the user's selected answer to the state
                    setUserAnswers((prevAnswers) => [
                        ...prevAnswers,
                        { question: currentQuestion, answer: selectedAnswer, correctAnswer },
                    ]);
                } else {
                    setSessionCompleted(true); // Mark the session as completed
                }
            }
        };

        // Add event listener for mouse click
        window.addEventListener("click", onMouseClick);

        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
            if (mixerRef.current) mixerRef.current.stopAllAction();
            window.removeEventListener("click", onMouseClick); // Remove event listener on cleanup
        };
    }, [currentOptions, selectedQuestions, currentQuestionIndex]);

    useEffect(() => {
        if (sessionCompleted) {
            console.log("Finalizing session...");
            fetch("http://localhost:5000/finalize-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            })
            .then(response => response.json())
            .then(data => console.log("Session finalized:", data))
            .catch(error => console.error("Error finalizing session:", error));
        }

    }, [sessionCompleted]);

    return (
        <div ref={mountRef}>
            {/* Timer UI (Top Left Corner) */}
        <div
            style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "black",
                backgroundColor: "rgba(238, 212, 157, 0.8)",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 100,
            }}
        >
            Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>

        {/* Session Completed Message */}
            {sessionCompleted && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        fontSize: "48px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 200,
                    }}
                >
                    ✨ Session Completed ✨

                    {/* <p>Total Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p> */}
                </div>
            )}

            {selectedQuestions.length > 0 && !sessionCompleted && (
                <div
                    style={{
                        position: "absolute",
                        top: "44%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "black",
                        padding: "15px",
                        backgroundColor: "rgba(166, 236, 215, 0.9)",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                        zIndex: 100,
                        textAlign: "center",
                    }}
                >
                    {currentQuestion}
                </div>
            )}
        </div>
    );
};

export default ThreeScene;