const request = require('supertest');
const app = require('../server/server.js');
const samples = require('./samples');
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
  const endpoint = '/products/1';
  test('It should have a status code of 200', async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response of an object', async () => {
    const response = await request(app).get(endpoint);
    expect(typeof response.body).toEqual('object');
  });
  test('It should return the correct data', async () => {
    const response = await request(app).get(endpoint);
    expect(response.body).toEqual(samples.product1);
  });
});

describe('products/:productid/styles', () => {
  const endpoint = '/products/1/styles';
  test('It should have a status code of 200', async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response of an object', async () => {
    const response = await request(app).get(endpoint);
    expect(typeof response.body).toEqual('object');
  });
  test('It should return the correct data', async () => {
    const response = await request(app).get(endpoint);
    expect(response.body).toEqual(samples.product1styles);
  });
});

describe('products/:productid/related', () => {
  const endpoint = '/products/1/related';
  test('It should have a status code of 200', async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
  });
  test('It should have a response body of an array', async () => {
    const response = await request(app).get(endpoint);
    expect(Array.isArray(response.body)).toEqual(true);
  });
  test('It should return the correct data', async () => {
    const response = await request(app).get(endpoint);
    expect(response.body).toEqual(samples.product1styles);
  });
});
