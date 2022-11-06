import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

type MockRepositoryType<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockUser = {
  id: 1,
  email: 'george@163.com',
  nickname: 'george',
};

const getMockUser = () => ({
  nickname: 'george',
  email: 'george@163.com',
  password: 'lovejiaminya',
  role: 0,
  hashPassword: jest.fn(),
  checkPassword: jest.fn(),
});

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('user service', () => {
  let service: UserService;
  let userRepository: MockRepositoryType<User>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('service should be define', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should fail if  user exits', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const res = await service.createAccount(getMockUser());
      expect(res).toMatchObject({ ok: false, error: '邮箱已被使用' });
    });
  });
  it.todo('userLogin');
  it.todo('getUserById');
});