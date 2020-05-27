const request = require('supertest');
const app = require('../server/index.js');
//Testing basic server endpoints

describe('/list', () => {
  test('It should have a status code of 200', async () => {
    const response = await request(app).get('/product/list');
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response of an object', async () => {
    const response = await request(app).get('/product/list');
    expect(typeof response.body).toEqual('object');
  });
});
