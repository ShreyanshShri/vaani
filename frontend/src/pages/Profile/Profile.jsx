import { registerPushNotifications } from "../../notifications/pushNotifications";

function Settings() {
	async function enableNotifications() {
		try {
			await registerPushNotifications();
			alert("Notifications enabled");
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	}

	return <button onClick={enableNotifications}>Enable Notifications</button>;
}

export default Settings;
