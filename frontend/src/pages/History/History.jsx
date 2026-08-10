import Sidebar from "../../components/layout/Sidebar";

function Health() {
	const conversation = {
		date: "Today, 10:15 AM",
		duration: "2 min",
		title: "Paracetamol discussion",
		messages: [
			{
				speaker: "You",
				text: "I have a mild headache. Can I take paracetamol?",
				time: "10:15 AM",
			},
			{
				speaker: "Digital Nurse",
				text: "If you normally take paracetamol safely, it can be used for mild headache. Make sure you follow the dosage on your medicine label and avoid taking other medicines that also contain paracetamol.",
				time: "10:15 AM",
			},
			{
				speaker: "You",
				text: "I took one 500 mg tablet.",
				time: "10:16 AM",
			},
			{
				speaker: "Digital Nurse",
				text: "I've recorded that you took 500 mg of paracetamol today. If the headache gets worse or you develop other concerning symptoms, consider seeking medical advice.",
				time: "10:16 AM",
			},
		],
	};

	return (
		<div
			style={{
				display: "flex",
			}}
		>
			<Sidebar />
			<div
				style={{
					minHeight: "100vh",
					background: "white",
					padding: "32px 40px",
					color: "#1f2937",
					boxSizing: "border-box",
				}}
			>
				{/* Header */}
				<div
					style={{
						paddingBottom: "25px",
						borderBottom: "1px solid #f3f4f6",
						marginBottom: "28px",
					}}
				>
					<h1
						style={{
							margin: 0,
							fontSize: "25px",
							color: "#1f2937",
							fontWeight: 600,
						}}
					>
						History
					</h1>

					<p
						style={{
							margin: "7px 0 0",
							color: "#6b7280",
							fontSize: "14px",
						}}
					>
						Your previous conversations with the digital nurse.
					</p>
				</div>

				{/* History item */}
				<div
					style={{
						border: "1px solid #f3f4f6",
						borderRadius: "11px",
						overflow: "hidden",
					}}
				>
					{/* Conversation header */}
					<div
						style={{
							padding: "18px 20px",
							background: "#fafafa",
							borderBottom: "1px solid #f3f4f6",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div>
							<h2
								style={{
									margin: 0,
									fontSize: "15px",
									fontWeight: 600,
									color: "#374151",
								}}
							>
								{conversation.title}
							</h2>

							<p
								style={{
									margin: "5px 0 0",
									fontSize: "11px",
									color: "#9ca3af",
								}}
							>
								{conversation.date} · {conversation.duration}
							</p>
						</div>

						<span
							style={{
								padding: "5px 9px",
								borderRadius: "5px",
								background: "#f0fdf4",
								color: "#316942",
								fontSize: "11px",
							}}
						>
							Medication
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Health;
