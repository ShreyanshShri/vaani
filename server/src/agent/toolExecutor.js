import { saveMedicalEvent, getMedicalEvents } from "../tools/medical.js";

import { searchMedicalMemory } from "../tools/memory.js";

export async function executeTool(name, args, userId) {
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

		case "search_medical_memory":
			return await searchMedicalMemory({
				userId,
				...args,
			});

		default:
			throw new Error(`Unknown tool: ${name}`);
	}
}
