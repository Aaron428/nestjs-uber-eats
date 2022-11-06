import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

type MockRepositoryType<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const loginUser = {
  email: 'george@163.com',
  password: 'test',
};

const mockUser = {
  id: 1,
  email: 'george@163.com',
  nickname: 'george',
};

const getMockUser = {
  id: 1,
  nickname: 'georgeKing',
  email: 'georgeKing@163.com',
  password: 'lovejiaminya',
  role: 0,
  hashPassword: jest.fn(),
  checkPassword: jest.fn(),
};

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(() => 'mock token'),
  verify: jest.fn(),
};

describe('user service', () => {
  let service: UserService;
  let jwtService: JwtService;
  let userRepository: MockRepositoryType<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('service should be define', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should fail if  user exits', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const res = await service.createAccount(getMockUser);
      expect(res).toMatchObject({ ok: false, error: '邮箱已被使用' });
    });

    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(getMockUser);
      userRepository.save.mockResolvedValue(getMockUser);
      await service.createAccount(getMockUser);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(getMockUser);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(getMockUser);
    });

    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(getMockUser);
      expect(result).toEqual({ ok: false, error: '创建用户失败' });
    });
  });
  describe('userLogin', () => {
    it('should fail if user is not exist', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const res = await service.userLogin(loginUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(res).toMatchObject({ ok: false, error: '用户名或密码错误' });
    });

    it('should fail if password it is wrong', async () => {
      const mockUserData = {
        ...getMockUser,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(mockUserData);
      const res = await service.userLogin(loginUser);
      expect(mockUserData.checkPassword).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ ok: false, error: '用户名或密码错误' });
    });

    it('should return token if password is correct', async () => {
      const mockUserData = {
        ...getMockUser,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(mockUserData);
      await service.userLogin(loginUser);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: expect.any(Number) });
    });
  });
  it.todo('getUserById');
});
