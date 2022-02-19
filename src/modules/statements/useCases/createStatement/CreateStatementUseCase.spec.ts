import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

const makeFakeUser = () => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

describe('GetBalanceUseCase', () => {
  let statementRepository: IStatementsRepository
  let userRepository: IUsersRepository
  let sut: CreateStatementUseCase

  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    userRepository.findById = jest.fn().mockResolvedValue(makeFakeUser())
    sut = new CreateStatementUseCase(userRepository, statementRepository)
  })

  it('should throw UserNotFound if user not exists', async () => {
    userRepository.findById = jest.fn().mockResolvedValueOnce(undefined)

    const promise = sut.execute({user_id: 'invalid_id', type: OperationType.DEPOSIT, amount: 10, description: 'any_description'})

    await expect(promise).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

})
