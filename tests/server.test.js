const request = require('supertest');
const app = require('../server/server.js');
//Testing basic server endpoints

describe('/products/list', () => {
  afterAll((done) => {
    app.close(done);
  });

  test('It should have a status code of 200', async () => {
    const response = await request(app).get('/products/list');
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response of an object', async () => {
    const response = await request(app).get('/products/list');
    expect(typeof response.body).toEqual('object');
  });
});

describe('products/:productid/', () => {
  test('It should have a status code of 200', async () => {
    const response = await request(app).get('/products/1');
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response of an object', async () => {
    const response = await request(app).get('/products/1');
    expect(typeof response.body).toEqual('object');
  });
});

describe('products/:productid/styles', () => {
  test('It should have a status code of 200', async () => {
    const response = await request(app).get('/products/1/styles');
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response of an object', async () => {
    const response = await request(app).get('/products/1/styles');
    expect(typeof response.body).toEqual('object');
  });
});
