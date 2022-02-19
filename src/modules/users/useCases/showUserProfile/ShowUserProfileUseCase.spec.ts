import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

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
})
