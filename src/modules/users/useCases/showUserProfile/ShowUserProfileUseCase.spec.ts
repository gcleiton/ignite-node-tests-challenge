import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

const mockFakeUser = () => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

describe('ShowUserProfileUseCase', () => {
  let userRepository: IUsersRepository
  let sut: ShowUserProfileUseCase

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    userRepository.findById = jest.fn().mockResolvedValue(mockFakeUser())
    sut = new ShowUserProfileUseCase(userRepository)
  })
  it('should throw ShowUserProfileError if user not exists', async () => {
    userRepository.findById = jest.fn().mockResolvedValueOnce(undefined)

    const promise = sut.execute('invalid_id')

    await expect(promise).rejects.toBeInstanceOf(ShowUserProfileError)
  })

  it('should return correct data on success', async () => {
    const user = await sut.execute('any_id')

    expect(user).toEqual(mockFakeUser())
  })
})
