self.addEventListener("push", (event) => {
	if (!event.data) {
		return;
	}

	const data = event.data.json();

	event.waitUntil(
		self.registration.showNotification(data.title || "Digital Nurse", {
			body: data.message || "",
			icon: "/logo.png",
			badge: "/logo.png",
			data: {
				reminderId: data.reminderId,
				type: data.type,
			},
		}),
	);
});
