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
					expect({...res.body[0], modified: new Date(res.body[0].modified)}).to.eql(makeTestNotes()[0]);
					// TODO: check db for persistance
					const dbData = await db('notes').select();
					expect(res.body.map( e=>{ return {...e, modified: new Date(e.modified) }})).to.eql(dbData);
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
					expect({...res.body, modified: new Date(res.body.modified)}).to.eql(makeNewNote());
					// TODO: check db for persistance
					const dbData = await db('notes').select().where({id : res.body.id}).first();
					expect({...res.body, modified: new Date(res.body.modified)}).to.eql(dbData);
				});

				it('GET "/:noteId" should return the correct note', async () =>{
					const noteId = 2;
					const res = await supertest(app)
						.get(`/notes/${noteId}`)
						.expect(200);
					expect(res.body).to.be.an('object');
					expect({...res.body, modified: new Date(res.body.modified)}).to.eql(makeTestNotes()[noteId - 1]);
					// TODO: check db for persistance
					const dbData = await db('notes').select().where({id : noteId}).first();
					expect({...res.body, modified: new Date(res.body.modified)}).to.eql(dbData);
				});

				it('DELETE "/:noteId" with no auth should return 401', async () => {
					await supertest(app)
						.delete('/notes/1')
						.expect(401);
				});

				it('DELETE "/:noteId" returns 204 and no content', async () => {
					const noteId = 1;
					const dbDataBefore = await db('notes').where({id : noteId}).del().returning('*');
					const res = await supertest(app)
						.delete(`/notes/${noteId}`)
						.set('Authorization', `Bearer ${API_TOKEN}`)
						.expect(204);
					expect(res.body).to.be.empty;
					// TODO: check db for persistance
					const dbData = await db('notes').where({id : noteId}).del().returning('*');
					expect(dbDataBefore[0]).to.have.all.keys(['id', 'name', 'content', 'folder_id', 'modified'])
					expect(dbData).to.be.empty;
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
					const dbData = await db('folders').select();
					expect(res.body).to.eql(dbData);
				});

				it('POST "/" should return 401 with no auth', async () => {
					await supertest(app).post('/folders').expect(401);
				});

				it('POST "/" should return the added folder object', async () => {
					const newFolder = makeNewFolder(db);
					const dbDataBefore = await db('folders').select().where({id : newFolder.id});
					const res = await supertest(app)
						.post('/folders')
						.send(newFolder)
						.set('Authorization', `Bearer ${API_TOKEN}`)
						.set('Content-Type', 'application/json')
						.expect(201);
					expect(res.body).to.be.an('object');
					expect(res.body).to.eql(newFolder);
					const dbData = await db('folders').select().where({id : newFolder.id}).first();
					expect(dbDataBefore).to.be.empty;
					expect(res.body).to.eql(dbData);
				});

				context('with extra folders added', () => {
					beforeEach('inserting one test folder', ()=> db('folders').insert(makeNewFolder()))

					it('DELETE "/:folderId" should return 401 with no auth', async () => {
						await supertest(app)
							.delete('/folders/25')
							.expect(401);
					});

					it('DELETE "/:folderId" should return 204', async () => {
						const folderId = 25;
						const dbDataBefore = await db('folders').select().where({id : folderId}).first();
						await supertest(app)
							.delete(`/folders/${folderId}`)
							.set('Content-Type', 'application/json')
							.set('Authorization', `Bearer ${API_TOKEN}`)
							.expect(204);
						const dbData = await db('folders').select().where({id : folderId}).first();
						expect(dbDataBefore).to.have.all.keys(['name', 'id']);
						expect(dbData).not.to.exist;
					});

					it('PATCH "/:folderId" should return 401 with no auth', async () => {
						await supertest(app).patch('/folders/25').expect(401);
					});

					it('PATCH "/:folderId" should return 206 and the updated title', async () => {
						const changedFolder = { id: 25, name: 'some random title'};
						const dbDataBefore = await db('folders').select().where({ id : changedFolder.id }).first();
						const res = await supertest(app)
							.patch(`/folders/${changedFolder.id}`)
							.set('Content-Type', 'application/json')
							.set('Authorization', `Bearer ${API_TOKEN}`)
							.send(changedFolder)
							.expect(206);
						const dbData = await db('folders').select('name').where({ id : changedFolder.id }).first();
						expect(res.body).to.eql(changedFolder.name);
						expect(dbDataBefore).to.have.all.keys(['name', 'id']);
						expect(dbData).to.have.all.keys(['name']);
					});
				});
			});
		});
});
