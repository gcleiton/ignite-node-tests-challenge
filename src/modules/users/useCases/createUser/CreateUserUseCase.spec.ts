import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

const mockCreateUserParams = () => {
  return {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

describe('CreateUserUseCase', () => {
  let userRepository: IUsersRepository
  let sut: CreateUserUseCase

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(userRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await sut.execute(mockCreateUserParams())

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with email exists', async () => {
    await sut.execute(mockCreateUserParams())
    const promise = sut.execute(mockCreateUserParams())

    await expect(promise).rejects.toBeInstanceOf(CreateUserError)
  })
});
