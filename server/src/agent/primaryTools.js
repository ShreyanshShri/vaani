export const primaryAgentTools = [
	{
		functionDeclarations: [
			/* =========================
			   MONGODB / STRUCTURED DATA
			========================= */

			{
				name: "get_medical_events",
				description: "Get the user's recorded medical events.",
				parameters: {
					type: "object",
					properties: {
						type: {
							type: "string",
							description: "Optional event type filter.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
				},
			},

			{
				name: "get_medications",
				description: "Get the user's recorded medications.",
				parameters: {
					type: "object",
					properties: {
						active: {
							type: "boolean",
							description: "Optional active/inactive filter.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
				},
			},

			{
				name: "get_symptoms",
				description: "Get the user's recorded symptoms.",
				parameters: {
					type: "object",
					properties: {
						status: {
							type: "string",
							description: "Optional symptom status filter.",
						},
						name: {
							type: "string",
							description: "Optional symptom name filter.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
				},
			},

			{
				name: "get_vitals",
				description: "Get the user's recorded vital measurements.",
				parameters: {
					type: "object",
					properties: {
						type: {
							type: "string",
							description: "Optional vital type filter.",
						},
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
				},
			},

			{
				name: "get_prescriptions",
				description: "Get the user's recorded prescriptions.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of results.",
						},
					},
				},
			},

			{
				name: "get_conversations",
				description: "Get the user's previous conversation history.",
				parameters: {
					type: "object",
					properties: {
						limit: {
							type: "integer",
							description: "Maximum number of conversations to return.",
						},
					},
				},
			},

			/* =========================
			   QDRANT / SEMANTIC MEMORY
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
							description: "What medical information to find.",
						},
						category: {
							type: "string",
							description:
								"Optional memory category such as medication, symptom, food, measurement, appointment, condition, or lifestyle.",
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
				name: "get_medication_memory",
				description:
					"Get the user's stored medication memories from semantic medical memory.",
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
				description:
					"Get the user's stored symptom memories from semantic medical memory.",
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
				description:
					"Get the user's stored food and dietary memories from semantic medical memory.",
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
				description:
					"Get the user's stored health measurement memories from semantic medical memory.",
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
				description:
					"Get the user's stored medical appointment memories from semantic medical memory.",
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
					"Get the user's stored medical condition and diagnosis memories from semantic medical memory.",
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
					"Get the user's stored lifestyle and health-habit memories from semantic medical memory.",
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
