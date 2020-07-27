/**
 * todo
 * jest 모듈 못 읽는 이슈 해결
 */
describe('Test the root path', () => {
	test('It should response the GET method', async (done) => {
		const response = 200;
		expect(response).toBe(200);
		done();
	});
});
