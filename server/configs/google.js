import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const googleClient = new OAuth2Client({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
    redirectUri: "postmessage"
});