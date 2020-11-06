const knex = require('knex');
const notesService = require('../src/services/notesService');
const { makeNewNote, makeTestNotes } = require('./notes.fixture')
const app = require('../src/app');

const { TEST_DB_URL, API_TOKEN } = process.env;

describe('App', function(){
	let db = null;
		before('instanciate and set db connection',function(){
				db = knex({
					connection: TEST_DB_URL,
					client: 'pg'
				});
				app.set('db', db);
		});

		before('removing any previous data in db', ()=> {
				db('notes').truncate();
		});

		afterEach('cleanup',() => db.raw('TRUNCATE notes RESTART IDENTITY CASCADE'));
		after('destroy db connection', ()=> db.destroy());

		describe('/notes route', function(){
			context('with notes inserted', () => {

				beforeEach('insert test notes', ()=> db('notes').insert(makeTestNotes()));
				afterEach('remove test notes', ()=> db('notes').truncate());

				it('GET "/" should return all notes', async () =>{
					const res = await supertest(app).get('/notes').expect(200);
					expect(res.body).to.be.an('array');
					expect(res.body[0]).to.eql(makeTestNotes()[0]);
				});

				it('POST "/" with no auth returns 401', async () => {
					const res = await supertest(app).post('/notes').expect(401);
					expect(res.body).to.be.an('object');
					expect(res.body.error).to.be.a('string');
				});

				it('POST "/" should return 201 and the added object', async () => {
					const res = await supertest(app)
						.post('/notes')
						.set('Authorization', `Bearer ${API_TOKEN}`)
						.set('Content-Type', 'application/json')
						.send(makeNewNote())
						.expect(201);
					expect(res.body).to.be.an('object');
					expect(res.body).to.eql(makeNewNote());
				});
			});


		});

		describe('/folders route', function() {

		});
});
