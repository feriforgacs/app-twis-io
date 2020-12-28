import { getSession } from "next-auth/client";

export default async function AuthCheck(req, res) {
	/**
	 * Only allow requests from authenticated users
	 */
	const session = await getSession({ req });
	if (!session) {
		res.status(401).end();
		return false;
	}
	return true;
}
