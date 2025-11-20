const request = require('supertest');
const app = require('../app');

jest.mock('../models/Task', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

const Task = require('../models/Task');

describe('Task API endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('returns all tasks', async () => {
      Task.findAll.mockResolvedValue([
        {
          id: '1',
          title: 'Test task',
          description: 'Desc',
          status: 'pending',
          createdAt: new Date(),
        },
      ]);

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Task.findAll).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('id', '1');
    });

    it('handles fetch errors', async () => {
      Task.findAll.mockRejectedValue(new Error('db error'));

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Failed to fetch tasks' });
    });
  });

  describe('POST /api/tasks', () => {
    it('creates a task', async () => {
      const payload = { title: 'New Task', description: 'Desc', status: 'done' };
      Task.create.mockResolvedValue({
        ...payload,
        id: '2',
        createdAt: new Date(),
      });

      const response = await request(app).post('/api/tasks').send(payload);

      expect(response.status).toBe(201);
      expect(Task.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: payload.title })
      );
      expect(response.body).toHaveProperty('id', '2');
    });

    it('validates required title', async () => {
      const response = await request(app).post('/api/tasks').send({ description: 'Missing title' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Title is required' });
      expect(Task.create).not.toHaveBeenCalled();
    });

    it('handles creation errors', async () => {
      Task.create.mockRejectedValue(new Error('db error'));

      const response = await request(app).post('/api/tasks').send({ title: 'fail task' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Failed to create task' });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('updates task status', async () => {
      const mockTask = {
        id: '3',
        title: 'Task',
        description: '',
        status: 'pending',
        createdAt: new Date(),
        save: jest.fn(),
      };
      Task.findByPk.mockResolvedValue(mockTask);

      const response = await request(app)
        .put('/api/tasks/3')
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(mockTask.save).toHaveBeenCalled();
      expect(response.body).toHaveProperty('status', 'completed');
    });

    it('requires status in body', async () => {
      const response = await request(app).put('/api/tasks/3').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Status is required' });
      expect(Task.findByPk).not.toHaveBeenCalled();
    });

    it('returns 404 when task missing', async () => {
      Task.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/tasks/999')
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });

    it('handles update errors', async () => {
      Task.findByPk.mockRejectedValue(new Error('db error'));

      const response = await request(app)
        .put('/api/tasks/3')
        .send({ status: 'completed' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Failed to update task' });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task', async () => {
      Task.destroy.mockResolvedValue(1);

      const response = await request(app).delete('/api/tasks/4');

      expect(response.status).toBe(204);
      expect(Task.destroy).toHaveBeenCalledWith({ where: { id: '4' } });
    });

    it('returns 404 when delete target missing', async () => {
      Task.destroy.mockResolvedValue(0);

      const response = await request(app).delete('/api/tasks/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });

    it('handles deletion errors', async () => {
      Task.destroy.mockRejectedValue(new Error('db error'));

      const response = await request(app).delete('/api/tasks/4');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Failed to delete task' });
    });
  });
});
