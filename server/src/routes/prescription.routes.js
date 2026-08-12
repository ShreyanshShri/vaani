import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { savePrescription } from "../tools/mongodb.js";

const router = express.Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error("Only JPEG, PNG, and WebP images are supported."));
		}

		cb(null, true);
	},
});

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

const prescriptionSchema = {
	type: "object",
	properties: {
		doctorName: {
			type: ["string", "null"],
		},
		hospitalName: {
			type: ["string", "null"],
		},
		prescriptionDate: {
			type: ["string", "null"],
		},
		medications: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: {
						type: "string",
					},
					dosage: {
						type: ["string", "null"],
					},
					form: {
						type: ["string", "null"],
					},
					frequency: {
						type: ["string", "null"],
					},
					instructions: {
						type: ["string", "null"],
					},
					startDate: {
						type: ["string", "null"],
					},
					endDate: {
						type: ["string", "null"],
					},
				},
				required: [
					"name",
					"dosage",
					"form",
					"frequency",
					"instructions",
					"startDate",
					"endDate",
				],
			},
		},
		instructions: {
			type: ["string", "null"],
		},
		sourceText: {
			type: "string",
		},
	},
	required: [
		"doctorName",
		"hospitalName",
		"prescriptionDate",
		"medications",
		"instructions",
		"sourceText",
	],
};

router.post("/upload", upload.single("prescription"), async (req, res) => {
	console.log("Uploading pres");
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Prescription image is required.",
			});
		}

		// const userId = req.user?.id || req.user?._id || req.user?.userId;
		const userId = "test-user-001";

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: "User authentication required.",
			});
		}

		const base64Image = req.file.buffer.toString("base64");

		const response = await ai.models.generateContent({
			model: "gemini-3.1-flash-lite",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `
You are extracting structured medical information from a prescription image.

Carefully read the prescription and extract the information that is actually visible.

Rules:

1. Do not invent or infer information that is not visible.
2. If a field cannot be determined, return null.
3. Extract every medication that can be identified.
4. Preserve medication names as written whenever possible.
5. Extract dosage, form, frequency, and instructions separately.
6. If a date is clearly readable, return it as YYYY-MM-DD.
7. If a handwritten value is ambiguous, do not guess.
8. sourceText must contain the medically relevant text that can be read from the prescription.
9. Do not add medical advice.
10. Do not diagnose anything.
11. Do not create medications that are not present in the image.

Return only the requested JSON structure.
`,
						},
						{
							inlineData: {
								mimeType: req.file.mimetype,
								data: base64Image,
							},
						},
					],
				},
			],
			config: {
				responseMimeType: "application/json",
				responseSchema: prescriptionSchema,
			},
		});

		const extracted = JSON.parse(response.text);

		const saved = await savePrescription({
			userId,

			doctorName: extracted.doctorName,

			hospitalName: extracted.hospitalName,

			prescriptionDate: extracted.prescriptionDate,

			medications: extracted.medications,

			instructions: extracted.instructions,

			documentUrl: null,

			sourceText: extracted.sourceText,
		});

		return res.status(201).json({
			success: true,
			message: "Prescription extracted and saved successfully.",

			prescriptionId: saved.prescriptionId,

			prescription: {
				...extracted,
				_id: saved.prescriptionId,
				userId,
			},
		});
	} catch (error) {
		console.error("PRESCRIPTION UPLOAD ERROR:", error);

		if (error instanceof multer.MulterError) {
			if (error.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({
					success: false,
					message: "Image must be smaller than 10 MB.",
				});
			}
		}

		return res.status(500).json({
			success: false,
			message: "Failed to process prescription.",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
});

export default router;
