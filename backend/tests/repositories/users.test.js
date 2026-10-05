import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userRepository } from '#repositories/users';

const fakePool = {
    query: vi.fn(),
};

const fakeRepository = userRepository(fakePool);

beforeEach(() => {
    vi.resetAllMocks();
});

const mockQuery = (expected) => {
    fakePool.query.mockResolvedValue(expected);
};

describe('createUser', () => {
    it('should insert user and return newly inserted user id', async () => {
        const expected = {
            rows: [
                {
                    username: 'new_user',
                    email: 'myEmail.com',
                    password: 'hashed',
                },
            ],
        };

        mockQuery(expected);

        const result = await fakeRepository.createUser(
            'new_user',
            'myEmail.com',
            'hashed'
        );

        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['new_user', 'myEmail.com', 'hashed']
        );
        expect(result).toEqual(expected.rows[0]);
    });
});

describe('findByUserId', () => {
    it('should query user by id', async () => {
        const expected = {
            rows: [
                {
                    user_id: 5,
                    email: 'a@test.com',
                    username: 'alex',
                    password: 'hashed',
                    is_active: true,
                    created_at: '2026-05-09 15:00:00',
                },
            ],
        };

        mockQuery(expected);

        const result = await fakeRepository.findByUserId(5);

        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM users'),
            [5]
        );
        expect(result).toEqual(expected.rows[0]);
    });
});

describe('activeSwitch', () => {
    it('should use logical negation to set a users active status ', async () => {
        const expected = {
            rows: [{ user_id: 1, username: 'alex', is_active: true }],
        };

        mockQuery(expected);

        const result = await fakeRepository.activeSwitch(1);

        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE users'),
            [1]
        );
        expect(fakePool.query.mock.calls[0][0]).toContain(
            'SET is_active = NOT is_active'
        );
        expect(result).toEqual(expected.rows[0]);
    });
});

describe('findUserByEmail', () => {
    it('should query by user email', async () => {
        const expected = {
            rows: [
                {
                    user_id: 1,
                    email: 'myEmail.com',
                    username: 'alex',
                    password: 'hashed',
                    is_active: true,
                    created_at: '2026-05-09 15:00:00',
                },
            ],
        };

        mockQuery(expected);

        const result = await fakeRepository.findUserByEmail('myEmail.com');

        expect(fakePool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM users'),
            ['myEmail.com']
        );
        expect(result).toEqual(expected.rows[0]);
    });
});
