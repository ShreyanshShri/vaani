export async function registerPushNotifications() {
	if (!("serviceWorker" in navigator)) {
		throw new Error("Service workers are not supported");
	}

	if (!("PushManager" in window)) {
		throw new Error("Push notifications are not supported");
	}

	const permission = await Notification.requestPermission();

	if (permission !== "granted") {
		throw new Error("Notification permission denied");
	}

	await navigator.serviceWorker.register("/service-worker.js");

	const registration = await navigator.serviceWorker.ready;

	let subscription = await registration.pushManager.getSubscription();

	if (!subscription) {
		subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,

			applicationServerKey: urlBase64ToUint8Array(
				import.meta.env.VITE_VAPID_PUBLIC_KEY,
			),
		});
	}

	const response = await fetch("http://localhost:3000/api/push/subscribe", {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(subscription),
	});

	if (!response.ok) {
		throw new Error("Failed to save push subscription");
	}

	console.log("Push notifications registered");

	return subscription;
}

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);

	return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
