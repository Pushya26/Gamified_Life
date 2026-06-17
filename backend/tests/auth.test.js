import request from 'supertest'
import app from '../src/app.js'
import prisma from '../src/prisma.js'

const TEST_EMAIL = 'test_hunter@example.com'
const TEST_PASSWORD = 'Test1234!'
const TEST_USERNAME = 'testhunter'

describe('Auth flow', () => {
  afterAll(async () => {
    // cleanup created test user
    await prisma.hunter.deleteMany({ where: { name: TEST_USERNAME } })
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } })
    await prisma.$disconnect()
  })

  test('register -> login -> me', async () => {
    // register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD, username: TEST_USERNAME })
      .expect(201)

    expect(registerRes.body.token).toBeDefined()
    expect(registerRes.body.hunter).toBeDefined()

    // login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })
      .expect(200)

    expect(loginRes.body.token).toBeDefined()

    const token = loginRes.body.token

    // me
    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(200)
    expect(meRes.body.user).toBeDefined()
    expect(meRes.body.hunter).toBeDefined()
    expect(meRes.body.user.email).toBe(TEST_EMAIL)
  })
})
