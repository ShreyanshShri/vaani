import {
	getMedicalEvents,
	getMedications,
	getSymptoms,
	getVitals,
	getPrescriptions,
	getConversations,
} from "../tools/mongodb.js";

import {
	searchMedicalMemory,
	getMedicationMemory,
	getSymptomMemory,
	getFoodHistoryMemory,
	getMeasurementMemory,
	getAppointmentMemory,
	getConditionMemory,
	getLifestyleMemory,
} from "../tools/memory.js";

export async function executeTool(name, args, userId) {
	switch (name) {
		/* =========================
		   MONGODB / STRUCTURED DATA
		========================= */

		case "get_medical_events":
			return await getMedicalEvents({
				userId,
				...args,
			});

		case "get_medications":
			return await getMedications({
				userId,
				...args,
			});

		case "get_symptoms":
			return await getSymptoms({
				userId,
				...args,
			});

		case "get_vitals":
			return await getVitals({
				userId,
				...args,
			});

		case "get_prescriptions":
			return await getPrescriptions({
				userId,
				...args,
			});

		case "get_conversations":
			return await getConversations({
				userId,
				...args,
			});

		/* =========================
		   QDRANT / SEMANTIC MEMORY
		========================= */

		case "search_medical_memory":
			return await searchMedicalMemory({
				userId,
				...args,
			});

		case "get_medication_memory":
			return await getMedicationMemory({
				userId,
				...args,
			});

		case "get_symptom_memory":
			return await getSymptomMemory({
				userId,
				...args,
			});

		case "get_food_history_memory":
			return await getFoodHistoryMemory({
				userId,
				...args,
			});

		case "get_measurement_memory":
			return await getMeasurementMemory({
				userId,
				...args,
			});

		case "get_appointment_memory":
			return await getAppointmentMemory({
				userId,
				...args,
			});

		case "get_condition_memory":
			return await getConditionMemory({
				userId,
				...args,
			});

		case "get_lifestyle_memory":
			return await getLifestyleMemory({
				userId,
				...args,
			});

		default:
			throw new Error(`Unknown tool: ${name}`);
	}
}
