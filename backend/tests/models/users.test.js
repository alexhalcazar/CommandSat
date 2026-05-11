import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createUser,
    findByUserId,
    activeSwitch,
    onboardUser,
} from '../../api/models/users.js';

const mockQuery = vi.hoisted(() => vi.fn());

vi.mock('../../db/index.js', () => {
    return {
        pool: {
            query: mockQuery,
        },
    };
});

beforeEach(() => {
    mockQuery.mockReset();
});

describe('createUser', () => {
    it('should insert user and return newly inserted user id', async () => {
        const newUser = { rows: [{ user_id: 1 }] };

        mockQuery.mockResolvedValue(newUser);

        const result = await createUser('alex', 'a@test.com', 'hashed');

        expect(result).toEqual(newUser);
    });
});

describe('findByUserId', () => {
    it('should query user by id', async () => {
        const user = { rows: [{ user_id: 5 }] };

        mockQuery.mockResolvedValue(user);

        const result = await findByUserId(5);

        expect(result).toEqual(user);
    });
});

describe('activeSwitch', () => {
    it('should pass the user id to the query', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        await activeSwitch(1);

        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [1]);
    });
});

describe('onboardUser', () => {
    it('should set has_logged_in to true', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        await onboardUser(1);

        expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [1]);
    });
});
