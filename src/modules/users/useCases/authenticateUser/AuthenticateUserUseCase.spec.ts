import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

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
})
