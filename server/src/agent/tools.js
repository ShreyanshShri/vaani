export const primaryAgentTools = [
	{
		functionDeclarations: [
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
