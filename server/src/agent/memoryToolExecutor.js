// agent/memoryToolExecutor.js

import {
	saveMedicalEvent,
	getMedicalEvents,
	updateMedicalEvent,
} from "../tools/medical.js";

import {
	saveMedicalMemory,
	searchMedicalMemory,
	updateMedicalMemory,
} from "../tools/memory.js";

export async function executeMemoryTool(name, args, userId) {
	switch (name) {
		case "save_medical_event":
			return await saveMedicalEvent({
				userId,
				...args,
			});

		case "get_medical_events":
			return await getMedicalEvents({
				userId,
				...args,
			});

		case "update_medical_event":
			return await updateMedicalEvent({
				userId,
				...args,
			});

		case "save_medical_memory":
			return await saveMedicalMemory({
				userId,
				...args,
			});

		case "search_medical_memory":
			return await searchMedicalMemory({
				userId,
				...args,
			});

		case "update_medical_memory":
			return await updateMedicalMemory({
				userId,
				...args,
			});

		default:
			throw new Error(`Unknown memory tool: ${name}`);
	}
}
