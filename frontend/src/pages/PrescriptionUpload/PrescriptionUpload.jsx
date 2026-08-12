import { useRef, useState } from "react";
import api from "../../services/api";

function PrescriptionUpload() {
	const fileInputRef = useRef(null);

	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState(null);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files?.[0];

		if (!selectedFile) {
			return;
		}

		setError("");
		setResult(null);

		if (!selectedFile.type.startsWith("image/")) {
			setError("Please select an image file.");
			return;
		}

		if (selectedFile.size > 10 * 1024 * 1024) {
			setError("Image must be smaller than 10 MB.");
			return;
		}

		setFile(selectedFile);

		const objectUrl = URL.createObjectURL(selectedFile);

		setPreview(objectUrl);
	};

	const handleUpload = async () => {
		if (!file) {
			setError("Please select a prescription image first.");
			return;
		}

		try {
			setLoading(true);
			setError("");
			setResult(null);

			const formData = new FormData();

			formData.append("prescription", file);

			const response = await api.post("/prescriptions/upload", formData);

			setResult(response.data);
		} catch (err) {
			console.error("Prescription upload failed:", err);

			setError(
				err.response?.data?.message || "Failed to process prescription.",
			);
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		if (preview) {
			URL.revokeObjectURL(preview);
		}

		setFile(null);
		setPreview(null);
		setResult(null);
		setError("");

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div
			style={{
				maxWidth: "800px",
				margin: "0 auto",
				padding: "32px",
			}}
		>
			<h1>Upload Prescription</h1>

			<p>
				Upload a prescription image to extract and save the medical information.
			</p>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				onChange={handleFileChange}
				style={{
					display: "none",
				}}
			/>

			{!preview && (
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					style={{
						width: "100%",
						padding: "40px",
						border: "2px dashed #ccc",
						borderRadius: "12px",
						background: "#fafafa",
						cursor: "pointer",
						fontSize: "16px",
					}}
				>
					Select Prescription Image
				</button>
			)}

			{preview && (
				<div>
					<div
						style={{
							marginTop: "24px",
							marginBottom: "20px",
							border: "1px solid #ddd",
							borderRadius: "12px",
							overflow: "hidden",
						}}
					>
						<img
							src={preview}
							alt="Prescription"
							style={{
								width: "100%",
								maxHeight: "600px",
								objectFit: "contain",
								display: "block",
								background: "#f5f5f5",
							}}
						/>
					</div>

					<div
						style={{
							display: "flex",
							gap: "12px",
						}}
					>
						<button
							type="button"
							onClick={handleUpload}
							disabled={loading}
							style={{
								flex: 1,
								padding: "14px",
								border: "none",
								borderRadius: "8px",
								background: "#111",
								color: "white",
								cursor: loading ? "not-allowed" : "pointer",
							}}
						>
							{loading ? "Extracting..." : "Extract & Save"}
						</button>

						<button
							type="button"
							onClick={reset}
							disabled={loading}
							style={{
								padding: "14px 20px",
								border: "1px solid #ddd",
								borderRadius: "8px",
								background: "white",
								cursor: loading ? "not-allowed" : "pointer",
							}}
						>
							Remove
						</button>
					</div>
				</div>
			)}

			{error && (
				<div
					style={{
						marginTop: "20px",
						padding: "14px",
						borderRadius: "8px",
						background: "#fff0f0",
						color: "#c00",
					}}
				>
					{error}
				</div>
			)}

			{loading && (
				<div
					style={{
						marginTop: "20px",
						padding: "20px",
						borderRadius: "8px",
						background: "#f5f5f5",
					}}
				>
					Reading prescription...
				</div>
			)}

			{result?.prescription && (
				<div
					style={{
						marginTop: "30px",
						padding: "24px",
						border: "1px solid #ddd",
						borderRadius: "12px",
					}}
				>
					<h2>Prescription Saved</h2>

					{result.prescription.doctorName && (
						<p>
							<strong>Doctor:</strong> {result.prescription.doctorName}
						</p>
					)}

					{result.prescription.hospitalName && (
						<p>
							<strong>Hospital:</strong> {result.prescription.hospitalName}
						</p>
					)}

					{result.prescription.prescriptionDate && (
						<p>
							<strong>Date:</strong> {result.prescription.prescriptionDate}
						</p>
					)}

					<h3>Medications</h3>

					{result.prescription.medications?.length ? (
						result.prescription.medications.map((medication, index) => (
							<div
								key={index}
								style={{
									padding: "16px",
									marginBottom: "12px",
									border: "1px solid #eee",
									borderRadius: "8px",
								}}
							>
								<strong>{medication.name}</strong>

								{medication.dosage && <p>Dosage: {medication.dosage}</p>}

								{medication.form && <p>Form: {medication.form}</p>}

								{medication.frequency && (
									<p>Frequency: {medication.frequency}</p>
								)}

								{medication.instructions && (
									<p>Instructions: {medication.instructions}</p>
								)}
							</div>
						))
					) : (
						<p>No medications could be identified.</p>
					)}

					{result.prescription.instructions && (
						<>
							<h3>Instructions</h3>
							<p>{result.prescription.instructions}</p>
						</>
					)}

					<small
						style={{
							color: "#777",
						}}
					>
						ID: {result.prescriptionId}
					</small>
				</div>
			)}
		</div>
	);
}

export default PrescriptionUpload;
