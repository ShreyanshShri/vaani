import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

const API_URL = "http://localhost:3000/api/reminders";

function Health() {
	const [reminders, setReminders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchReminders = async () => {
		try {
			setLoading(true);
			setError("");

			const response = await fetch(API_URL);

			if (!response.ok) {
				throw new Error("Failed to fetch reminders");
			}

			const data = await response.json();

			setReminders(data.reminders || []);
		} catch (err) {
			console.error("FETCH REMINDERS ERROR:", err);
			setError("Unable to load reminders.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReminders();
	}, []);

	const upcoming = reminders.filter(
		(reminder) => reminder.status === "scheduled",
	);

	const completed = reminders.filter(
		(reminder) => reminder.status === "completed",
	);

	const today = new Date();

	const todayReminders = upcoming.filter((reminder) => {
		const date = new Date(reminder.scheduledFor);

		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	});

	const formatTime = (dateString) => {
		const date = new Date(dateString);

		return date.toLocaleTimeString("en-IN", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);

		const today = new Date();

		const tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);

		if (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		) {
			return "Today";
		}

		if (
			date.getDate() === tomorrow.getDate() &&
			date.getMonth() === tomorrow.getMonth() &&
			date.getFullYear() === tomorrow.getFullYear()
		) {
			return "Tomorrow";
		}

		return date.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const getReminderType = (reminder) => {
		if (
			reminder.title?.toLowerCase().includes("medicine") ||
			reminder.title?.toLowerCase().includes("medication") ||
			reminder.message?.toLowerCase().includes("take")
		) {
			return "Medication";
		}

		return "Health";
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
					flex: 1,
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
						Reminders
					</h1>

					<p
						style={{
							margin: "7px 0 0",
							color: "#6b7280",
							fontSize: "14px",
						}}
					>
						Upcoming reminders for your health and daily routine.
					</p>
				</div>

				{/* Summary */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "15px",
						marginBottom: "30px",
					}}
				>
					<div
						style={{
							border: "1px solid #f3f4f6",
							borderRadius: "10px",
							padding: "18px",
						}}
					>
						<p
							style={{
								margin: 0,
								fontSize: "12px",
								color: "#9ca3af",
							}}
						>
							Upcoming
						</p>

						<strong
							style={{
								display: "block",
								marginTop: "7px",
								fontSize: "24px",
								color: "#316942",
							}}
						>
							{upcoming.length}
						</strong>

						<span
							style={{
								fontSize: "11px",
								color: "#9ca3af",
							}}
						>
							reminders scheduled
						</span>
					</div>

					<div
						style={{
							border: "1px solid #f3f4f6",
							borderRadius: "10px",
							padding: "18px",
						}}
					>
						<p
							style={{
								margin: 0,
								fontSize: "12px",
								color: "#9ca3af",
							}}
						>
							Today
						</p>

						<strong
							style={{
								display: "block",
								marginTop: "7px",
								fontSize: "24px",
								color: "#374151",
							}}
						>
							{todayReminders.length}
						</strong>

						<span
							style={{
								fontSize: "11px",
								color: "#9ca3af",
							}}
						>
							reminders remaining
						</span>
					</div>

					<div
						style={{
							border: "1px solid #f3f4f6",
							borderRadius: "10px",
							padding: "18px",
						}}
					>
						<p
							style={{
								margin: 0,
								fontSize: "12px",
								color: "#9ca3af",
							}}
						>
							Completed
						</p>

						<strong
							style={{
								display: "block",
								marginTop: "7px",
								fontSize: "24px",
								color: "#374151",
							}}
						>
							{completed.length}
						</strong>

						<span
							style={{
								fontSize: "11px",
								color: "#9ca3af",
							}}
						>
							recently completed
						</span>
					</div>
				</div>

				{/* Upcoming reminders */}
				<section>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "15px",
						}}
					>
						<h2
							style={{
								margin: 0,
								fontSize: "17px",
								fontWeight: 600,
								color: "#1f2937",
							}}
						>
							Upcoming
						</h2>

						<button
							style={{
								border: "1px solid #e5e7eb",
								background: "white",
								borderRadius: "7px",
								padding: "8px 13px",
								color: "#316942",
								fontSize: "12px",
								cursor: "pointer",
							}}
						>
							+ Add Reminder
						</button>
					</div>

					<div
						style={{
							border: "1px solid #f3f4f6",
							borderRadius: "10px",
							overflow: "hidden",
						}}
					>
						{loading ? (
							<div
								style={{
									padding: "30px",
									textAlign: "center",
									color: "#9ca3af",
									fontSize: "13px",
								}}
							>
								Loading reminders...
							</div>
						) : error ? (
							<div
								style={{
									padding: "30px",
									textAlign: "center",
									color: "#9ca3af",
									fontSize: "13px",
								}}
							>
								{error}
							</div>
						) : upcoming.length === 0 ? (
							<div
								style={{
									padding: "30px",
									textAlign: "center",
									color: "#9ca3af",
									fontSize: "13px",
								}}
							>
								No upcoming reminders.
							</div>
						) : (
							upcoming.map((reminder, index) => {
								const type = getReminderType(reminder);

								return (
									<div
										key={reminder._id || reminder.id || index}
										style={{
											display: "flex",
											alignItems: "center",
											padding: "17px 19px",
											borderBottom:
												index !== upcoming.length - 1
													? "1px solid #f3f4f6"
													: "none",
										}}
									>
										{/* Indicator */}
										<div
											style={{
												width: "36px",
												height: "36px",
												borderRadius: "9px",
												background: "#f0fdf4",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												marginRight: "15px",
												color: "#316942",
												fontSize: "15px",
												flexShrink: 0,
											}}
										>
											{type === "Medication"
												? "M"
												: type === "Appointment"
													? "A"
													: "H"}
										</div>

										{/* Details */}
										<div style={{ flex: 1 }}>
											<h3
												style={{
													margin: 0,
													fontSize: "14px",
													fontWeight: 600,
													color: "#374151",
												}}
											>
												{reminder.title}
											</h3>

											<div
												style={{
													display: "flex",
													gap: "10px",
													marginTop: "5px",
												}}
											>
												<span
													style={{
														fontSize: "11px",
														color: "#9ca3af",
													}}
												>
													{type}
												</span>

												<span
													style={{
														fontSize: "11px",
														color: "#d1d5db",
													}}
												>
													•
												</span>

												<span
													style={{
														fontSize: "11px",
														color: "#9ca3af",
													}}
												>
													{formatDate(reminder.scheduledFor)}
												</span>
											</div>
										</div>

										{/* Time */}
										<div
											style={{
												textAlign: "right",
												marginRight: "18px",
											}}
										>
											<div
												style={{
													fontSize: "13px",
													fontWeight: 600,
													color: "#374151",
												}}
											>
												{formatTime(reminder.scheduledFor)}
											</div>

											<div
												style={{
													marginTop: "4px",
													fontSize: "10px",
													color: "#9ca3af",
												}}
											>
												Alarm enabled
											</div>
										</div>

										{/* More button */}
										<button
											style={{
												border: "none",
												background: "transparent",
												color: "#9ca3af",
												fontSize: "18px",
												cursor: "pointer",
												padding: "5px",
											}}
										>
											⋮
										</button>
									</div>
								);
							})
						)}
					</div>
				</section>

				{/* Completed */}
				<section style={{ marginTop: "30px" }}>
					<h2
						style={{
							margin: "0 0 15px",
							fontSize: "17px",
							fontWeight: 600,
							color: "#1f2937",
						}}
					>
						Recently Completed
					</h2>

					<div
						style={{
							border: "1px solid #f3f4f6",
							borderRadius: "10px",
							overflow: "hidden",
						}}
					>
						{completed.length === 0 ? (
							<div
								style={{
									padding: "25px",
									textAlign: "center",
									color: "#9ca3af",
									fontSize: "12px",
								}}
							>
								No completed reminders.
							</div>
						) : (
							completed.map((item, index) => (
								<div
									key={item._id || item.id || index}
									style={{
										display: "flex",
										alignItems: "center",
										padding: "15px 19px",
										borderBottom:
											index !== completed.length - 1
												? "1px solid #f3f4f6"
												: "none",
										opacity: 0.7,
									}}
								>
									<div
										style={{
											width: "28px",
											height: "28px",
											borderRadius: "50%",
											background: "#f0fdf4",
											color: "#316942",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											marginRight: "13px",
											fontSize: "13px",
										}}
									>
										✓
									</div>

									<div style={{ flex: 1 }}>
										<div
											style={{
												fontSize: "13px",
												fontWeight: 600,
												color: "#4b5563",
											}}
										>
											{item.title}
										</div>

										<div
											style={{
												marginTop: "3px",
												fontSize: "11px",
												color: "#9ca3af",
											}}
										>
											{getReminderType(item)}
										</div>
									</div>

									<span
										style={{
											fontSize: "11px",
											color: "#9ca3af",
										}}
									>
										{formatDate(item.scheduledFor)}
									</span>
								</div>
							))
						)}
					</div>
				</section>

				{/* Footer note */}
				<div
					style={{
						marginTop: "30px",
						padding: "14px",
						borderRadius: "8px",
						background: "#f9fafb",
						color: "#9ca3af",
						fontSize: "11px",
						textAlign: "center",
					}}
				>
					Reminders will alert you at their scheduled time.
				</div>
			</div>
		</div>
	);
}

export default Health;
