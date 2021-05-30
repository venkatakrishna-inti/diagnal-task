const testFun = require("../src/parser/functions/testFun");

test("correct greeting is generated", async () => {
	expect(await testFun("krishna")).toEqual({
		name: "krishna"
	});
});
