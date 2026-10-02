const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Tăng hẳn thời gian chờ lên 120 giây (2 phút) để GitHub Actions có đủ thời gian tải file lõi
jest.setTimeout(120000); 

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      appName: 'jest-ci-test',
    });
  } catch (error) {
    console.error('Lỗi khởi tạo MongoDB Memory Server:', error);
    throw new Error(`Khởi tạo MongoDB thất bại: ${error.message}`);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Product RESTful API CRUD Tests', () => {
  const sampleProduct = {
    pid: 'P001',
    pname: 'Laptop Dell XPS',
    price: 1500,
    quantity: 10
  };

  test('GET /health - Hệ thống phải phản hồi trạng thái UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('POST /api/products - Tạo mới sản phẩm thành công', async () => {
    const res = await request(app)
      .post('/api/products')
      .send(sampleProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pid).toBe(sampleProduct.pid);
  });

  test('GET /api/products - Lấy danh sách sản phẩm', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/products/:pid - Lấy chi tiết sản phẩm theo pid', async () => {
    const res = await request(app).get(`/api/products/${sampleProduct.pid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.pname).toBe(sampleProduct.pname);
  });

  test('PUT /api/products/:pid - Cập nhật giá và số lượng', async () => {
    const res = await request(app)
      .put(`/api/products/${sampleProduct.pid}`)
      .send({ pname: 'Laptop Dell XPS 15', price: 1700, quantity: 8 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(1700);
    expect(res.body.data.quantity).toBe(8);
  });

  test('DELETE /api/products/:pid - Xóa sản phẩm', async () => {
    const res = await request(app).delete(`/api/products/${sampleProduct.pid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});