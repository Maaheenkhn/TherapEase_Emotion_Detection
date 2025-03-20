import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import AliceModel from "../assets/Alice_normal.glb"; // Import the model directly
import questionsData from "../assets/Questions.json";

// Shuffle an array randomly
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Model component to load the GLTF model
const Model = () => {
    const { scene } = useThree();
    const modelRef = useRef();
    const mixerRef = useRef();
  
    useEffect(() => {
      console.log("Loading model...");
  
      const loader = new GLTFLoader();
  
      // Load the model from the public folder
      loader.load(
        AliceModel,
        (gltf) => {
          console.log("Model loaded successfully!");
          
          // Get the loaded model and add it to the scene
          const model = gltf.scene;
          scene.add(model);
  
          // Adjust model properties (similar to your original example)
          model.scale.set(10, 9, 9.5); // Set the scale of the model
          model.position.set(0, -9.3, -3.7); // Set position of the model
          model.rotation.x = 0.25; // Set rotation of the model
  
          // Optional: Traverse the model to adjust specific parts like eyebrows, teeth, etc.
          model.traverse((child) => {
            if (child.isMesh) {
              console.log(child.name);
  
              // Move eyebrows and teeth slightly down
              if (child.name === "Sphere" || child.name === "Sphere_1") {
                child.position.z += 0.025; // Adjust eye position
              }
              if (child.name === "GEO_Polly_Eyebrows") {
                child.position.z += 0.02; // Adjust eyebrow position
              }
              if (child.name === "GEO_Polly_Teeth") {
                child.position.z += 0.02; // Adjust teeth position
              }
              if (child.name === "GEO_Polly_Hair") {
                child.position.z += 0.02; // Adjust hair position
              }
            }
          });
  
          // Create animation mixer
          mixerRef.current = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixerRef.current.clipAction(clip).play(); // Play animations
          });
  
          // Start the animation loop
          animate();
  
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model", error); // Handle any errors
        }
      );
  
      // Cleanup: Remove the model from the scene when the component unmounts
      return () => {
        scene.remove(modelRef.current);
      };
  
    }, [scene]);
  
    // Animation loop to update mixer
    const animate = () => {
      if (mixerRef.current) {
        mixerRef.current.update(0.016); // Update the mixer every frame
      }
      requestAnimationFrame(animate);
    };
  
    return null; // The Model component doesn't render anything directly
  };

const QuizScene = () => {
  // State for question, answers, timer, and user responses
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sessionActive, setSessionActive] = useState(true);
  const [finalTime, setFinalTime] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [timerInterval, setTimerInterval] = useState(null); // To store the timer interval
  const [startTime, setStartTime] = useState(null); // To store the start time

  const timerDiv = useRef();

  useEffect(() => {
    loadRandomQuestion(); // Load the first random question when the component mounts
    startTimer(); // Start the timer
    return () => stopTimer(); // Cleanup timer on unmount
  }, []);

  const loadRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionsData.length);
    const selectedQuestion = questionsData[randomIndex];

    if (!selectedQuestion || !selectedQuestion.Question) {
      console.error("Invalid question data:", selectedQuestion);
      return;
    }

    const answers = [
      selectedQuestion.A,
      selectedQuestion.B,
      selectedQuestion.C,
      selectedQuestion.D,
    ];

    // Shuffle answers to randomize their order
    const shuffledAnswers = shuffleArray(answers);

    setQuestion(selectedQuestion.Question);
    setAnswers(shuffledAnswers);
  };

  const startTimer = () => {
    const time = Date.now();
    setStartTime(time); // Save the start time

    const interval = setInterval(() => {
      if (timerDiv.current) {
        timerDiv.current.innerText = `Time: ${Math.floor((Date.now() - time) / 1000)}s`;
      }
    }, 1000);

    setTimerInterval(interval); // Save the timer interval
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval); // Stop the timer interval
    }
    if (startTime) {
      setFinalTime(Math.floor((Date.now() - startTime) / 1000)); // Calculate and set final time
    }
  };

  const handleAnswerSelect = (answer) => {
    const correctAnswerKey = questionsData["Correct Answer"]; // This will be "A", "B", "C", or "D"
    const correctAnswer = questionsData[correctAnswerKey]; // Get the correct answer text

    setUserResponses([
      ...userResponses,
      { question: question, answer: answer },
    ]);
    setSelectedAnswer(answer);

    setTimeout(() => {
      setSelectedAnswer(null); // Reset selected answer for the next question
      loadRandomQuestion(); // Load next question after delay
    }, 1500);
  };

  const sessionCompletion = () => {
    stopTimer();
    alert("Session Complete. Time Taken: " + finalTime + " seconds");
    alert("Your Responses: " + JSON.stringify(userResponses));
  };

  return (
    <>
      <div
        ref={timerDiv}
        style={{
          position: "absolute",
          top: "10px",
          left: "20px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "black",
          padding: "10px",
          backgroundColor: "rgba(231, 207, 161, 0.9)",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          zIndex: "100",
        }}
      ></div>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1} />
        <Model />
        <OrbitControls enableZoom={false} />
        {question && answers.length > 0 && answers.map((answer, index) => (
          <AnswerCard
            key={index}
            position={[index - 1.5, 1, 0]}
            answer={answer}
            onSelect={handleAnswerSelect}
            selected={selectedAnswer === answer}
          />
        ))}
      </Canvas>

      {sessionActive && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "black",
            padding: "10px",
            backgroundColor: "rgba(231, 207, 161, 0.9)",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            zIndex: "100",
          }}
        >
          <button onClick={sessionCompletion}>End Session</button>
        </div>
      )}
    </>
  );
};

// AnswerCard component for displaying individual answer choices
const AnswerCard = ({ position, answer, onSelect, selected }) => {
  const cardRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    if (selected) {
      materialRef.current.color.set(answer === "Correct" ? "green" : "red");
    } else {
      materialRef.current.color.set("white");
    }
  }, [selected]);

  return (
    <mesh position={position} ref={cardRef} onClick={() => onSelect(answer)}>
      <boxGeometry args={[1.5, 0.5, 0.1]} />
      <meshStandardMaterial ref={materialRef} color="white" />
      <Text position={[0, 0, 0.06]} fontSize={0.2}>
        {answer}
      </Text>
    </mesh>
  );
};

export default QuizScene;
