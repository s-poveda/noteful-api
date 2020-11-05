const app = require('../src/app');

describe('App', ()=>{
	it('GET responds 200 at "/"', ()=>{
		return supertest(app)
			.get('/')
			.expect(200);
	});
});
