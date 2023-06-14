const jsonwebtoken = require('jsonwebtoken');

// issuing token
module.exports.issueJWT = (user) => {
	const _id = user._id
	const expiresIn="1d" //expiration period of one day

	const payload = {
		sub: _id,
		iat: Date.now()
	}

	// signing the token
	const signedToken = jsonwebtoken.sign(
		payload,
		process.env.JWT_SECRET,
		{
			expiresIn: expiresIn,
		}
	)

	return {
		token: "Bearer " + signedToken,
		expires: expiresIn
	}

}