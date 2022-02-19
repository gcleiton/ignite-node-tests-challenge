import bcryptjs from 'bcryptjs'

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

jest.mock('bcryptjs')

const mockFakeUser = () => {
  return {
    id: 'any_id',
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
    userRepository.findByEmail = jest.fn().mockResolvedValue(mockFakeUser())
    bcryptjs.compare = jest.fn().mockResolvedValue(true)

    sut = new AuthenticateUserUseCase(userRepository)
  })

  it('should throw IncorrectEmailOrPasswordError if user not exists', async () => {
    userRepository.findByEmail = jest.fn().mockResolvedValue(undefined)
    const promise = sut.execute({email: 'any_email', password: 'any_password'})

    await expect(promise).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should throw IncorrectEmailOrPasswordError if password not match', async () => {
    bcryptjs.compare = jest.fn().mockResolvedValue(false)

    const promise = sut.execute({email: 'any_email', password: 'invalid_password'})

    await expect(promise).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should be able to authenticate an user', async () => {
    const result = await sut.execute({email: 'any_email', password: 'any_password'})

    expect(result.user).toEqual({
      id: mockFakeUser().id,
      name: mockFakeUser().name,
      email: mockFakeUser().email,
    })
    expect(result.token).toBeDefined()
  })
})
