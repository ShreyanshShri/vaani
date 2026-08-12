export const medicationSchema = {
	userId: String,

	name: String,
	dosage: String,
	form: String,
	frequency: String,
	instructions: String,

	startDate: Date,
	endDate: Date,

	prescribedBy: String,
	sourceText: String,

	active: Boolean,

	createdAt: Date,
	updatedAt: Date,
};

export const symptomSchema = {
	userId: String,

	name: String,
	severity: Number,
	description: String,

	startedAt: Date,
	resolvedAt: Date,

	status: String, // active, resolved, recurring

	sourceText: String,

	createdAt: Date,
	updatedAt: Date,
};

export const vitalSchema = {
	userId: String,

	type: String, // temperature, heart_rate, bp, spo2, weight
	value: Number,
	unit: String,

	systolic: Number,
	diastolic: Number,

	timestamp: Date,
	sourceText: String,

	createdAt: Date,
};

export const prescriptionSchema = {
	userId: String,

	doctorName: String,
	hospitalName: String,

	prescriptionDate: Date,

	medications: Array,
	instructions: String,

	documentUrl: String,

	sourceText: String,

	createdAt: Date,
	updatedAt: Date,
};

export const conversationSchema = {
	userId: String,

	sessionId: String,

	messages: Array,

	startedAt: Date,
	endedAt: Date,

	createdAt: Date,
	updatedAt: Date,
};
