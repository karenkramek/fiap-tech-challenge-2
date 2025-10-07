import { act, renderHook, waitFor } from '@testing-library/react';
import { Account } from '../../models/Account';
import { AccountService } from '../../services/AccountService';
import { useAccount } from '../useAccount';

// Mock the AccountService
jest.mock('../../services/AccountService');

const mockAccountService = AccountService as jest.Mocked<typeof AccountService>;

describe('useAccount Hook', () => {
  const mockAccountData = {
    id: 'acc123',
    name: 'John Doe',
    email: 'john@example.com',
    balance: 1000,
    password: 'hashedpassword'
  };

  const mockAccount = new Account(
    mockAccountData.id,
    mockAccountData.name,
    mockAccountData.balance,
    mockAccountData.email,
    mockAccountData.password
  );

  const mockUser = {
    id: 'acc123',
    name: 'John Doe',
    email: 'john@example.com',
    isAuthenticated: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage
    localStorage.clear();

    // Default mock implementations
    mockAccountService.getCurrentUser.mockReturnValue(mockUser);
    mockAccountService.getAccountById.mockResolvedValue(mockAccount);
    mockAccountService.isAuthenticated.mockReturnValue(true);
    mockAccountService.login.mockResolvedValue(mockAccount);
  });

  afterEach(() => {
    // Clean up timers
    jest.clearAllTimers();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAccount());

    expect(result.current.loading).toBe(true);
    expect(result.current.account).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch account data on mount when user is authenticated', async () => {
    const { result } = renderHook(() => useAccount());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockAccountService.getCurrentUser).toHaveBeenCalled();
    expect(mockAccountService.getAccountById).toHaveBeenCalledWith('acc123');
    expect(result.current.account).toEqual(mockAccount);
    expect(result.current.error).toBe(null);
    expect(result.current.currentUser).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should not fetch account when no user is logged in', async () => {
    mockAccountService.getCurrentUser.mockReturnValue(null);
    mockAccountService.isAuthenticated.mockReturnValue(false);

    const { result } = renderHook(() => useAccount());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockAccountService.getAccountById).not.toHaveBeenCalled();
    expect(result.current.account).toBe(null);
    expect(result.current.currentUser).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle errors when fetching account', async () => {
    const error = new Error('Failed to fetch account');
    mockAccountService.getAccountById.mockRejectedValue(error);

    const { result } = renderHook(() => useAccount());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.account).toBe(null);
    expect(result.current.error).toEqual(error);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAccount());

    await act(async () => {
      const account = await result.current.login('john@example.com', 'password123');
      expect(account).toEqual(mockAccount);
    });

    expect(mockAccountService.login).toHaveBeenCalledWith('john@example.com', 'password123');
    expect(result.current.account).toEqual(mockAccount);
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAccount());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.logout();
    });

    expect(mockAccountService.logout).toHaveBeenCalled();
    expect(result.current.account).toBe(null);
    expect(result.current.currentUser).toBe(null);
  });

  it('should refresh account data', async () => {
    const { result } = renderHook(() => useAccount());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the mock to count fresh calls
    mockAccountService.getAccountById.mockClear();

    await act(async () => {
      await result.current.refreshAccount();
    });

    expect(mockAccountService.getAccountById).toHaveBeenCalledWith('acc123');
  });

  it('should handle storage events for user changes', async () => {
    const { result } = renderHook(() => useAccount());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate user change in localStorage
    const newUser = {
      id: 'acc456',
      name: 'Jane Doe',
      email: 'jane@example.com',
      isAuthenticated: true
    };
    mockAccountService.getCurrentUser.mockReturnValue(newUser);

    // Trigger storage event
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'currentUser',
        newValue: JSON.stringify(newUser)
      }));
    });

    await waitFor(() => {
      expect(result.current.currentUser).toEqual(newUser);
    });
  });

  it('should handle login errors', async () => {
    const error = new Error('Invalid credentials');
    mockAccountService.login.mockRejectedValue(error);

    const { result } = renderHook(() => useAccount());

    await expect(
      act(async () => {
        await result.current.login('john@example.com', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid credentials');

    expect(mockAccountService.login).toHaveBeenCalledWith('john@example.com', 'wrongpassword');
  });
});
