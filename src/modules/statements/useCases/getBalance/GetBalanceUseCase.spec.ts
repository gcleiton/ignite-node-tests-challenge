import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

const makeFakeUser = () => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
}

const makeFakeBalance = () => {
  return {
    balance: 123,
    statement: []
  }
}

describe('GetBalanceUseCase', () => {
  let statementRepository: IStatementsRepository
  let userRepository: IUsersRepository
  let sut: GetBalanceUseCase

  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository()
    statementRepository.getUserBalance = jest.fn().mockResolvedValue(makeFakeBalance())
    userRepository = new InMemoryUsersRepository()
    userRepository.findById = jest.fn().mockResolvedValue(makeFakeUser())
    sut = new GetBalanceUseCase(statementRepository, userRepository)
  })

  it('should throw GetBalanceError if user not exists', async () => {
    userRepository.findById = jest.fn().mockResolvedValueOnce(undefined)

    const promise = sut.execute({user_id: 'invalid_id'})

    await expect(promise).rejects.toBeInstanceOf(GetBalanceError)
  })

  it('should return balance on success', async () => {
    const balance = await sut.execute({user_id: 'any_id'})

    expect(balance).toEqual(makeFakeBalance())
  })
})
