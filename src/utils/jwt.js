import { jwtDecode } from "jwt-decode"; // Correct named import for v4+

export function isTokenExpired(token) {
  if (!token) {
    return true; // No token means expired or not logged in
  }

  try {
    const decodedToken = jwtDecode(token);

    // Get the expiration time (in seconds)
    const expirationTime = decodedToken.exp;

    // Get the current time (in seconds)
    const currentTime = Math.floor(Date.now() / 1000);

    // Compare expiration time with current time
    // Add a little buffer (e.g., 60 seconds) if needed to account for clock skew or network latency
    // const bufferSeconds = 60;
    // return expirationTime < (currentTime + bufferSeconds);

    return expirationTime < currentTime;
  } catch (error) {
    // If decoding fails, the token is likely invalid or malformed
    console.error("Error decoding token:", error);
    return true; // Treat decoding errors as expired/invalid
  }
}
