const knex = require('knex');
const notesService = require('../src/services/notesService');
const { makeNewNote, makeTestNotes } = require('./notes.fixture')
const app = require('../src/app');

describe('App', function(){
	let db = null;
		before('instanciate and set db connection',function(){
				db = knex({
					connection: process.env.TEST_DB_URL,
					client: 'pg'
				});
				app.set('db', db);
		});

		before('removing any previous data in db', ()=> {
				db('notes').truncate();
		});

		afterEach('cleanup',() => db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE'));
		after('destroy db connection', ()=> db.destroy());

		describe('/notes route', function(){
			context('with notes inserted', () => {

				before('insert test notes', ()=> db('notes').insert(makeTestNotes()));
				after('remove test notes', ()=> db('notes').truncate());

				it('GET "/notes" should return all notes', () =>
					supertest(app)
					.get('/notes')
					.expect(200)
					.then((res) => {
						expect(res.body).to.be.an('array');
						expect(res.body[0]).to.eql(makeTestNotes()[0]);
					})
				);
			});
		});

		describe('/folders route', function() {

		});
});
