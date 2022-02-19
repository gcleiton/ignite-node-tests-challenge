import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

const makeFakeUser = () => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

const makeFakeStatement = () => {
  return {
    id: 'any_id',
    user_id: 'any_user_id',
    user: 'any_user',
    description: 'any_description',
    amount: 'any_amount',
    type: 'any_type'
  }
}

describe('GetBalanceUseCase', () => {
  let statementRepository: IStatementsRepository
  let userRepository: IUsersRepository
  let sut: GetStatementOperationUseCase

  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository()
    statementRepository.findStatementOperation = jest.fn().mockResolvedValue(makeFakeStatement())
    userRepository = new InMemoryUsersRepository()
    userRepository.findById = jest.fn().mockResolvedValue(makeFakeUser())
    sut = new GetStatementOperationUseCase(userRepository, statementRepository)
  })

  it('should throw UserNotFound if user not exists', async () => {
    userRepository.findById = jest.fn().mockResolvedValueOnce(undefined)

    const promise = sut.execute({user_id: 'invalid_user_id', statement_id: 'any_statement_id'})

    await expect(promise).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should throw StatementNotFound if statement not exists', async () => {
    statementRepository.findStatementOperation = jest.fn().mockResolvedValueOnce(undefined)

    const promise = sut.execute({user_id: 'any_user_id', statement_id: 'invalid_statement_id'})

    await expect(promise).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
