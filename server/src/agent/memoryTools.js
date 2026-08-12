export const memoryAgentTools = [
	{
		functionDeclarations: [
			/* =========================
			   SAVE MEMORY
			========================= */

			{
				name: "save_medical_memory",
				description:
					"Save a durable medical memory to semantic memory when the user's statement contains useful medical information worth remembering.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description: "The medical information to remember.",
						},
						category: {
							type: "string",
							description:
								"Memory category: medication, symptom, food, measurement, appointment, condition, lifestyle, or other.",
						},
						metadata: {
							type: "object",
							description:
								"Optional structured metadata associated with the memory.",
						},
						timestamp: {
							type: "string",
							description:
								"Optional timestamp associated with the medical information.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_medication_memory",
				description:
					"Save a durable medication-related memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description: "The medication information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured medication metadata.",
						},
						timestamp: {
							type: "string",
							description:
								"Optional timestamp associated with the medication information.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_symptom_memory",
				description:
					"Save a durable symptom-related memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description: "The symptom information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured symptom metadata.",
						},
						timestamp: {
							type: "string",
							description: "Optional timestamp associated with the symptom.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_food_memory",
				description:
					"Save a durable food or dietary memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description: "The food or dietary information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured food or dietary metadata.",
						},
						timestamp: {
							type: "string",
							description:
								"Optional timestamp associated with the food information.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_measurement_memory",
				description:
					"Save a durable health measurement memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description: "The measurement information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured measurement metadata.",
						},
						timestamp: {
							type: "string",
							description:
								"Optional timestamp associated with the measurement.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_appointment_memory",
				description:
					"Save a durable medical appointment memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description: "The appointment information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured appointment metadata.",
						},
						timestamp: {
							type: "string",
							description:
								"Optional timestamp associated with the appointment.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_condition_memory",
				description:
					"Save a durable medical condition or diagnosis memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description:
								"The condition or diagnosis information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured condition metadata.",
						},
						timestamp: {
							type: "string",
							description: "Optional timestamp associated with the condition.",
						},
					},
					required: ["text"],
				},
			},

			{
				name: "save_lifestyle_memory",
				description:
					"Save a durable lifestyle or health-habit memory to semantic medical memory.",
				parameters: {
					type: "object",
					properties: {
						text: {
							type: "string",
							description:
								"The lifestyle or health-habit information to remember.",
						},
						metadata: {
							type: "object",
							description: "Optional structured lifestyle metadata.",
						},
						timestamp: {
							type: "string",
							description:
								"Optional timestamp associated with the lifestyle information.",
						},
					},
					required: ["text"],
				},
			},

			/* =========================
			   SEARCH MEMORY
			========================= */

			{
				name: "search_medical_memory",
				description:
					"Search the user's semantic medical memory for relevant information.",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "What medical information to search for.",
						},
						category: {
							type: "string",
							description:
								"Optional category filter: medication, symptom, food, measurement, appointment, condition, or lifestyle.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
					required: ["query"],
				},
			},

			{
				name: "search_medication_memory",
				description: "Search the user's semantic medication memories.",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "What medication information to search for.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
					required: ["query"],
				},
			},

			{
				name: "search_symptom_memory",
				description: "Search the user's semantic symptom memories.",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "What symptom information to search for.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
					required: ["query"],
				},
			},

			{
				name: "search_food_memory",
				description: "Search the user's semantic food and dietary memories.",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "What food or dietary information to search for.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
					required: ["query"],
				},
			},

			{
				name: "search_measurement_memory",
				description: "Search the user's semantic health measurement memories.",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "What measurement information to search for.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
					required: ["query"],
				},
			},

			{
				name: "search_appointment_memory",
				description: "Search the user's semantic medical appointment memories.",
				parameters: {
					type: "object",
					properties: {
						query: {
							type: "string",
							description: "What appointment information to search for.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
					required: ["query"],
				},
			},

			/* =========================
			   GET MEMORY
			========================= */

			{
				name: "get_medical_memories",
				description:
					"Get the user's stored semantic medical memories, optionally filtered by category.",
				parameters: {
					type: "object",
					properties: {
						category: {
							type: "string",
							description:
								"Optional category filter: medication, symptom, food, measurement, appointment, condition, or lifestyle.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_medication_memory",
				description: "Get the user's stored medication memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_symptom_memory",
				description: "Get the user's stored symptom memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_food_history_memory",
				description: "Get the user's stored food and dietary memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_measurement_memory",
				description: "Get the user's stored health measurement memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_appointment_memory",
				description: "Get the user's stored medical appointment memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_condition_memory",
				description:
					"Get the user's stored medical condition and diagnosis memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},

			{
				name: "get_lifestyle_memory",
				description:
					"Get the user's stored lifestyle and health-habit memories.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},
				},
			},
		],
	},
];
