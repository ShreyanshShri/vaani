export const primaryAgentTools = [
	{
		functionDeclarations: [
			{
				name: "save_medical_event",

				description:
					"Save a new medical event for the current user. Use this when the user reports something that should be recorded, such as taking medication, experiencing a symptom, eating something relevant, or completing a medical activity.",

				parameters: {
					type: "object",

					properties: {
						type: {
							type: "string",
							description:
								"The type of medical event, such as medication, symptom, food, measurement, appointment, or other.",
						},

						data: {
							type: "object",
							description: "Structured information about the medical event.",
						},

						sourceText: {
							type: "string",
							description:
								"The original statement from the user that produced this event.",
						},

						timestamp: {
							type: "string",
							description:
								"The time the event occurred, preferably in ISO 8601 format.",
						},
					},

					required: ["type", "data", "sourceText"],
				},
			},

			{
				name: "get_medical_events",

				description:
					"Retrieve structured medical events belonging to the current user.",

				parameters: {
					type: "object",

					properties: {
						type: {
							type: "string",
							description: "Optional type of medical event to retrieve.",
						},

						limit: {
							type: "integer",
							description: "Maximum number of events to return.",
						},
					},
				},
			},

			{
				name: "search_medical_memory",

				description:
					"Search the user's semantic medical memory for previously recorded information relevant to the current conversation.",

				parameters: {
					type: "object",

					properties: {
						query: {
							type: "string",
							description:
								"Natural language description of what should be remembered or found.",
						},

						limit: {
							type: "integer",
							description: "Maximum number of memories to return.",
						},
					},

					required: ["query"],
				},
			},
		],
	},
];
