// agent/memoryTools.js

export const memoryAgentTools = [
	{
		functionDeclarations: [
			{
				name: "save_medical_event",
				description:
					"Save a structured medical event to MongoDB when the user's statement contains a concrete medical event worth preserving.",
				parameters: {
					type: "object",
					properties: {
						type: {
							type: "string",
							description:
								"Medical event type, such as medication, symptom, food, measurement, appointment, or other.",
						},
						data: {
							type: "object",
							description: "Structured information about the event.",
						},
						sourceText: {
							type: "string",
							description:
								"The exact user statement that produced this memory.",
						},
						timestamp: {
							type: "string",
							description: "When the event occurred, if known.",
						},
					},
					required: ["type", "data", "sourceText"],
				},
			},

			{
				name: "update_medical_event",
				description: "Update an existing structured medical event in MongoDB.",
				parameters: {
					type: "object",
					properties: {
						eventId: {
							type: "string",
							description: "The unique ID of the medical event to update.",
						},
						data: {
							type: "object",
							description: "Updated structured information about the event.",
						},
						sourceText: {
							type: "string",
							description:
								"The updated statement or context provided by the user.",
						},
						timestamp: {
							type: "string",
							description: "Updated timestamp for when the event occurred.",
						},
					},
					required: ["eventId"],
				},
			},

			{
				name: "save_medical_memory",

				description:
					"Save meaningful semantic information to Qdrant for future retrieval.",

				parameters: {
					type: "object",

					properties: {
						text: {
							type: "string",
							description: "The meaningful information to preserve.",
						},

						metadata: {
							type: "object",
							description: "Additional structured metadata about the memory.",
						},

						timestamp: {
							type: "string",
							description:
								"When the information was stated or when the relevant event occurred.",
						},
					},

					required: ["text"],
				},
			},

			{
				name: "update_medical_memory",
				description:
					"Update an existing semantic memory point in Qdrant by updating its text, metadata, or both.",
				parameters: {
					type: "object",
					properties: {
						memoryId: {
							type: "string",
							description:
								"The unique ID of the memory point in Qdrant to update.",
						},
						text: {
							type: "string",
							description:
								"Optional new semantic text content to re-embed and preserve.",
						},
						metadata: {
							type: "object",
							description:
								"Optional new or modified metadata object to merge into the memory.",
						},
					},
					required: ["memoryId"],
				},
			},
		],
	},
];
