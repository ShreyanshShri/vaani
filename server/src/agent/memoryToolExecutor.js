import {
	saveMedicalMemory,
	saveMedicationMemory,
	saveSymptomMemory,
	saveFoodMemory,
	saveMeasurementMemory,
	saveAppointmentMemory,
	saveConditionMemory,
	saveLifestyleMemory,
	searchMedicalMemory,
	searchMedicationMemory,
	searchSymptomMemory,
	searchFoodMemory,
	searchMeasurementMemory,
	searchAppointmentMemory,
	getMedicalMemories,
	getMedicationMemory,
	getSymptomMemory,
	getFoodHistoryMemory,
	getMeasurementMemory,
	getAppointmentMemory,
	getConditionMemory,
	getLifestyleMemory,
} from "../tools/memory.js";

import { createAndScheduleReminder } from "../reminders/reminderService.js";

export async function executeMemoryTool(name, args, userId) {
	switch (name) {
		/* =========================
		   SAVE MEMORY
		========================= */

		case "save_medical_memory":
			return await saveMedicalMemory({
				userId,
				...args,
			});

		case "save_medication_memory":
			return await saveMedicationMemory({
				userId,
				...args,
			});

		case "save_symptom_memory":
			return await saveSymptomMemory({
				userId,
				...args,
			});

		case "save_food_memory":
			return await saveFoodMemory({
				userId,
				...args,
			});

		case "save_measurement_memory":
			return await saveMeasurementMemory({
				userId,
				...args,
			});

		case "save_appointment_memory":
			return await saveAppointmentMemory({
				userId,
				...args,
			});

		case "save_condition_memory":
			return await saveConditionMemory({
				userId,
				...args,
			});

		case "save_lifestyle_memory":
			return await saveLifestyleMemory({
				userId,
				...args,
			});

		/* =========================
		   SEARCH MEMORY
		========================= */

		case "search_medical_memory":
			return await searchMedicalMemory({
				userId,
				...args,
			});

		case "search_medication_memory":
			return await searchMedicationMemory({
				userId,
				...args,
			});

		case "search_symptom_memory":
			return await searchSymptomMemory({
				userId,
				...args,
			});

		case "search_food_memory":
			return await searchFoodMemory({
				userId,
				...args,
			});

		case "search_measurement_memory":
			return await searchMeasurementMemory({
				userId,
				...args,
			});

		case "search_appointment_memory":
			return await searchAppointmentMemory({
				userId,
				...args,
			});

		/* =========================
		   GET MEMORY
		========================= */

		case "get_medical_memories":
			return await getMedicalMemories({
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

		case "create_and_schedule_reminder": {
			return await createAndScheduleReminder({
				userId,
				title: args.title,
				message: args.message,
				scheduledFor: args.scheduledFor,
				timezone: args.timezone,
			});
		}

		default:
			throw new Error(`Unknown memory tool: ${name}`);
	}
}
