export function createReminderDocument({
	userId,
	title,
	message,
	scheduledFor,
	timezone = "Asia/Kolkata",
}) {
	return {
		userId,
		title,
		message,
		scheduledFor: new Date(scheduledFor),
		timezone,
		status: "scheduled",
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
