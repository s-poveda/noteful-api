const knex = require('knex');
const notesService = require('../src/services/notesService');
const { makeNewNote, makeTestNotes } = require('./notes.fixture');
const { makeTestFolders, makeNewFolder } = require('./folders.fixture');
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
					// TODO: check db for persistance
				});

				it('POST "/" with no auth returns 401', async () => {
					const res = await supertest(app).post('/notes').expect(401);
					expect(res.body).to.be.an('object');
					expect(res.body.error).to.be.a('string');
					// TODO: check db for persistance
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
					// TODO: check db for persistance
				});

				it('GET "/:noteId" should return the correct note', async () =>{
					const noteId = 2;
					const res = await supertest(app)
						.get(`/notes/${noteId}`)
						.expect(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.eql(makeTestNotes()[noteId - 1]);
					// TODO: check db for persistance
				});

				it('DELETE "/:noteId" with no auth should return 401', async () => {
					await supertest(app)
						.delete('/notes/1')
						.expect(401);
						// TODO: check db for persistance
				});

				it('DELETE "/:noteId" returns 204 and no content', async () => {
					const res = await supertest(app)
						.delete('/notes/1')
						.set('Authorization', `Bearer ${API_TOKEN}`)
						.expect(204);
					expect(res.body).to.be.empty;
					// TODO: check db for persistance
				});
			});


		});

		describe('/folders route', function() {
			context('with default populated folders', () => {
				beforeEach(()=> db('folders').where({id: 25}).del());
				//due to FK constraint on notes, it is not possible to truncate
				//test folders without compromising test data integrity.
				//ALL OF THESE TEST REQUIRE SEEDING DB BEFORE RUNNIG THEM
				//there has to be a better way of going about this....
				it('GET "/" should return array of all folders', async () => {
					const res = await supertest(app)
						.get('/folders')
						.expect(200);
					expect(res.body).to.be.eql(makeTestFolders(db));
				});

				it('POST "/" should return 401 with no auth', async () => {
					await supertest(app).post('/folders').expect(401);
				});

				it('POST "/" should return the added folder object', async () => {
					const res = await supertest(app)
						.post('/folders')
						.send(makeNewFolder(db))
						.set('Authorization', `Bearer ${API_TOKEN}`)
						.set('Content-Type', 'application/json')
						.expect(201);
					expect(res.body).to.be.an('object');
					expect(res.body).to.eql(makeNewFolder());
				});

				context('with extra folders added', () => {
					beforeEach('inserting one test folder', ()=> db('folders').insert(makeNewFolder()))

					it('DELETE "/:folderId" should return 401 with no auth', async () => {
						await supertest(app)
							.delete('/folders/25')
							.expect(401);
					});

					it('DELETE "/:folderId" should return 204', async () => {
						await supertest(app)
							.delete('/folders/25')
							.set('Content-Type', 'application/json')
							.set('Authorization', `Bearer ${API_TOKEN}`)
							.expect(204);
					});

					it('PATCH "/:folderId" should return 401 with no auth', async () => {
						await supertest(app).patch('/folders/25').expect(401);
					});

					it('PATCH "/:folderId" should return 206 and the updated title', async () => {
						const changedFolder = { id: 25, name: 'some random title'};
						const res = await supertest(app)
							.patch('/folders/25')
							.set('Content-Type', 'application/json')
							.set('Authorization', `Bearer ${API_TOKEN}`)
							.send(changedFolder)
							.expect(206);
						expect(res.body).to.eql(changedFolder.name);
					});
				});
			});
		});
});
