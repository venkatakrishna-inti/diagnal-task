module.exports = async function(req, res, func, args) {
	try {
		let result = await func.apply(null, args);
		return res.status(200).send(result);
	} catch (error) {
		const response = JSON.parse(error.message);
		console.log("executeFunction error", error);
		return res.status(400).send(response);
	}
};
