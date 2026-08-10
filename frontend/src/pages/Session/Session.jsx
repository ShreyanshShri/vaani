import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, Volume2 } from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";

import "./session.css";

const WS_URL = "ws://localhost:3000";
const RIME_SAMPLE_RATE = 22050;

function Session() {
	const [status, setStatus] = useState("connecting");
	const [isRecording, setIsRecording] = useState(false);
	const [chunksSent, setChunksSent] = useState(0);

	const socketRef = useRef(null);

	const audioContextRef = useRef(null);
	const playbackContextRef = useRef(null);

	const streamRef = useRef(null);
	const sourceRef = useRef(null);
	const processorRef = useRef(null);

	const nextStartTimeRef = useRef(0);

	const chunksSentRef = useRef(0);

	useEffect(() => {
		connect();

		return () => {
			cleanup();
		};
	}, []);

	async function connect() {
		try {
			setStatus("connecting");

			const socket = new WebSocket(WS_URL);

			socket.binaryType = "arraybuffer";

			socketRef.current = socket;

			socket.onopen = async () => {
				console.log("WebSocket connected");

				try {
					await startMicrophone();

					setStatus("listening");
					setIsRecording(true);
				} catch (error) {
					console.error("Microphone error:", error);
					setStatus("error");
				}
			};

			socket.onmessage = (event) => {
				if (event.data instanceof ArrayBuffer) {
					playIncomingPCMChunk(event.data);
				}
			};

			socket.onerror = (error) => {
				console.error("WebSocket error:", error);
				setStatus("error");
			};

			socket.onclose = () => {
				console.log("WebSocket closed");

				setStatus("ended");
				setIsRecording(false);
			};
		} catch (error) {
			console.error(error);
			setStatus("error");
		}
	}

	async function startMicrophone() {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				channelCount: 1,
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
			},
		});

		streamRef.current = stream;

		const audioContext = new AudioContext({
			sampleRate: 16000,
		});

		audioContextRef.current = audioContext;

		await audioContext.resume();

		const source = audioContext.createMediaStreamSource(stream);

		sourceRef.current = source;

		const processor = audioContext.createScriptProcessor(4096, 1, 1);

		processorRef.current = processor;

		processor.onaudioprocess = (event) => {
			const socket = socketRef.current;

			if (!socket || socket.readyState !== WebSocket.OPEN) {
				return;
			}

			const input = event.inputBuffer.getChannelData(0);

			const pcm = new Int16Array(input.length);

			for (let i = 0; i < input.length; i++) {
				const sample = Math.max(-1, Math.min(1, input[i]));

				pcm[i] = sample < 0 ? sample * 32768 : sample * 32767;
			}

			socket.send(pcm.buffer);

			chunksSentRef.current += 1;
			setChunksSent(chunksSentRef.current);
		};

		source.connect(processor);

		const gain = audioContext.createGain();

		gain.gain.value = 0;

		processor.connect(gain);
		gain.connect(audioContext.destination);
	}

	function playIncomingPCMChunk(arrayBuffer) {
		if (!playbackContextRef.current) {
			playbackContextRef.current = new (
				window.AudioContext || window.webkitAudioContext
			)({
				sampleRate: RIME_SAMPLE_RATE,
			});
		}

		const playbackContext = playbackContextRef.current;

		if (playbackContext.state === "suspended") {
			playbackContext.resume();
		}

		setStatus((current) => (current === "listening" ? "speaking" : current));

		const int16Array = new Int16Array(arrayBuffer);

		if (int16Array.length === 0) {
			return;
		}

		const float32Array = new Float32Array(int16Array.length);

		for (let i = 0; i < int16Array.length; i++) {
			float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 32768 : 32767);
		}

		const buffer = playbackContext.createBuffer(
			1,
			float32Array.length,
			RIME_SAMPLE_RATE,
		);

		buffer.getChannelData(0).set(float32Array);

		const bufferSource = playbackContext.createBufferSource();

		bufferSource.buffer = buffer;

		bufferSource.connect(playbackContext.destination);

		const currentTime = playbackContext.currentTime;

		if (nextStartTimeRef.current < currentTime) {
			nextStartTimeRef.current = currentTime;
		}

		bufferSource.start(nextStartTimeRef.current);

		nextStartTimeRef.current += buffer.duration;

		bufferSource.onended = () => {
			const now = playbackContext.currentTime;

			if (nextStartTimeRef.current <= now + 0.05) {
				setStatus((current) =>
					current === "speaking" ? "listening" : current,
				);
			}
		};
	}

	function stopMicrophone() {
		if (processorRef.current) {
			processorRef.current.disconnect();
			processorRef.current = null;
		}

		if (sourceRef.current) {
			sourceRef.current.disconnect();
			sourceRef.current = null;
		}

		if (audioContextRef.current) {
			audioContextRef.current.close();
			audioContextRef.current = null;
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());

			streamRef.current = null;
		}

		setIsRecording(false);
	}

	function cleanup() {
		stopMicrophone();

		if (playbackContextRef.current) {
			playbackContextRef.current.close();
			playbackContextRef.current = null;
		}

		if (socketRef.current) {
			socketRef.current.close();
			socketRef.current = null;
		}

		nextStartTimeRef.current = 0;
	}

	function endSession() {
		cleanup();
		setStatus("ended");
	}

	function toggleRecording() {
		if (isRecording) {
			stopMicrophone();
			setStatus("paused");
			return;
		}

		startMicrophone()
			.then(() => {
				setIsRecording(true);
				setStatus("listening");
			})
			.catch((error) => {
				console.error(error);
				setStatus("error");
			});
	}

	const statusText = {
		connecting: "Connecting to your nurse...",
		listening: "Listening...",
		speaking: "Your nurse is speaking...",
		paused: "Microphone paused",
		ended: "Session ended",
		error: "Something went wrong",
	};

	return (
		<div className="app-layout">
			<Sidebar />

			<main className="session-main">
				<header className="session-header">
					<div>
						<h1>Vaani</h1>

						{/* <p>Your conversation is voice-first.</p> */}
					</div>

					<button className="end-session-button" onClick={endSession}>
						<Phone size={16} />
						End Session
					</button>
				</header>

				<section className="session-content">
					<div className={`session-orb ${status}`}>
						<div className="session-ring ring-one" />
						<div className="session-ring ring-two" />

						<button
							className="session-mic-button"
							onClick={toggleRecording}
							disabled={status === "connecting" || status === "ended"}
						>
							{isRecording ? <Mic size={38} /> : <MicOff size={38} />}
						</button>
					</div>

					<h2>{statusText[status]}</h2>

					<p className="session-subtitle">
						Speak naturally in Hindi, English or Hinglish.
					</p>

					<div className="session-indicator">
						{status === "speaking" ? (
							<>
								<Volume2 size={17} />
								<span>Nurse speaking</span>
							</>
						) : (
							<>
								<Mic size={17} />
								<span>
									{isRecording ? "Microphone active" : "Microphone paused"}
								</span>
							</>
						)}
					</div>

					{/* <div className="session-stats">
						<span>Audio: PCM 16-bit</span>

						<span>{chunksSent} chunks sent</span>
					</div> */}
				</section>

				<footer className="session-footer">
					🔒 Your conversation is private and secure.
				</footer>
			</main>
		</div>
	);
}

export default Session;
