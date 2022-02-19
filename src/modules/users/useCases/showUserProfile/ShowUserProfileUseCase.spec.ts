import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

const mockUser = () => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email'
  }
}

describe('ShowUserProfileUseCase', () => {
  let userRepository: IUsersRepository
  let sut: ShowUserProfileUseCase

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new ShowUserProfileUseCase(userRepository)
  })
  it('should throw ShowUserProfileError if user not exists', async () => {
    const promise = sut.execute('invalid_id')

    await expect(promise).rejects.toBeInstanceOf(ShowUserProfileError)
  })

  it('should return correct data on success', async () => {
    userRepository.findById = jest.fn().mockResolvedValueOnce(mockUser())

    const user = await sut.execute('any_id')

    expect(user).toEqual(mockUser())
  })
})
