import webpush from "web-push";

webpush.setVapidDetails(
	"mailto:shreyanshshrivastva@gmail.com",
	"BD2NeW7Nwqshn75L_nw8M4XArlOlgwtt9-Alx9s1oxav_15rFhDZXg3xE5Ql3QzwAUwQG4TD8dPKRcQIwrRx96s",
	"Q_tbzA3gd4Hk-V3Y6IS82qZ2S-Gj5zfeNNTlAofGAvU",
);

export async function sendPushNotification(subscription, payload) {
	return webpush.sendNotification(subscription, JSON.stringify(payload));
}
