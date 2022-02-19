import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

const mockFakeUser = () => {
  return {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

describe('AuthenticateUserUseCase', () => {
  let userRepository: IUsersRepository
  let sut: AuthenticateUserUseCase

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(userRepository)
  })

  it('should throw IncorrectEmailOrPasswordError if user not exists', async () => {
    const promise = sut.execute({email: 'any_email', password: 'any_password'})

    await expect(promise).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should throw IncorrectEmailOrPasswordError if password not match', async () => {
    userRepository.findByEmail = jest.fn().mockResolvedValueOnce(mockFakeUser())

    const promise = sut.execute({email: 'any_email', password: 'invalid_password'})

    await expect(promise).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
