import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  LogCanExecFailed,
  LogExecReverted,
  LogExecSuccess,
  LogExecutorAssignedExecutor,
  LogExecutorBalanceWithdrawn,
  LogExecutorStaked,
  LogExecutorSuccessShareSet,
  LogExecutorUnstaked,
  LogFundsProvided,
  LogFundsUnprovided,
  LogGelatoGasPriceOracleSet,
  LogGelatoMaxGasSet,
  LogInternalGasRequirementSet,
  LogMinExecutorStakeSet,
  LogOracleRequestDataSet,
  LogProviderAssignedExecutor,
  LogProviderModuleAdded,
  LogProviderModuleRemoved,
  LogSysAdminFundsWithdrawn,
  LogSysAdminSuccessShareSet,
  LogTaskCancelled,
  LogTaskSpecGasPriceCeilSet,
  LogTaskSpecProvided,
  LogTaskSpecUnprovided,
  LogTaskSubmitted,
  OwnershipTransferred
} from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleLogCanExecFailed(event: LogCanExecFailed): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.executor = event.params.executor
  entity.taskReceiptId = event.params.taskReceiptId

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.EXEC_TX_OVERHEAD(...)
  // - contract.NO_CEIL(...)
  // - contract.canExec(...)
  // - contract.canSubmitTask(...)
  // - contract.currentTaskReceiptId(...)
  // - contract.executionWrapper(...)
  // - contract.executorByProvider(...)
  // - contract.executorProvidersCount(...)
  // - contract.executorStake(...)
  // - contract.executorSuccessFee(...)
  // - contract.executorSuccessShare(...)
  // - contract.gelatoGasPriceOracle(...)
  // - contract.gelatoMaxGas(...)
  // - contract.hashTaskReceipt(...)
  // - contract.hashTaskSpec(...)
  // - contract.internalGasRequirement(...)
  // - contract.isExecutorAssigned(...)
  // - contract.isExecutorMinStaked(...)
  // - contract.isModuleProvided(...)
  // - contract.isOwner(...)
  // - contract.isProviderLiquid(...)
  // - contract.isTaskProvided(...)
  // - contract.isTaskSpecProvided(...)
  // - contract.minExecProviderFunds(...)
  // - contract.minExecutorStake(...)
  // - contract.oracleRequestData(...)
  // - contract.owner(...)
  // - contract.providerCanExec(...)
  // - contract.providerFunds(...)
  // - contract.providerModuleChecks(...)
  // - contract.providerModules(...)
  // - contract.sysAdminFunds(...)
  // - contract.sysAdminSuccessFee(...)
  // - contract.sysAdminSuccessShare(...)
  // - contract.taskReceiptHash(...)
  // - contract.taskSpecGasPriceCeil(...)
  // - contract.totalSuccessShare(...)
  // - contract.unprovideFunds(...)
  // - contract.withdrawExcessExecutorStake(...)
  // - contract.withdrawSysAdminFunds(...)
}

export function handleLogExecReverted(event: LogExecReverted): void {}

export function handleLogExecSuccess(event: LogExecSuccess): void {}

export function handleLogExecutorAssignedExecutor(
  event: LogExecutorAssignedExecutor
): void {}

export function handleLogExecutorBalanceWithdrawn(
  event: LogExecutorBalanceWithdrawn
): void {}

export function handleLogExecutorStaked(event: LogExecutorStaked): void {}

export function handleLogExecutorSuccessShareSet(
  event: LogExecutorSuccessShareSet
): void {}

export function handleLogExecutorUnstaked(event: LogExecutorUnstaked): void {}

export function handleLogFundsProvided(event: LogFundsProvided): void {}

export function handleLogFundsUnprovided(event: LogFundsUnprovided): void {}

export function handleLogGelatoGasPriceOracleSet(
  event: LogGelatoGasPriceOracleSet
): void {}

export function handleLogGelatoMaxGasSet(event: LogGelatoMaxGasSet): void {}

export function handleLogInternalGasRequirementSet(
  event: LogInternalGasRequirementSet
): void {}

export function handleLogMinExecutorStakeSet(
  event: LogMinExecutorStakeSet
): void {}

export function handleLogOracleRequestDataSet(
  event: LogOracleRequestDataSet
): void {}

export function handleLogProviderAssignedExecutor(
  event: LogProviderAssignedExecutor
): void {}

export function handleLogProviderModuleAdded(
  event: LogProviderModuleAdded
): void {}

export function handleLogProviderModuleRemoved(
  event: LogProviderModuleRemoved
): void {}

export function handleLogSysAdminFundsWithdrawn(
  event: LogSysAdminFundsWithdrawn
): void {}

export function handleLogSysAdminSuccessShareSet(
  event: LogSysAdminSuccessShareSet
): void {}

export function handleLogTaskCancelled(event: LogTaskCancelled): void {}

export function handleLogTaskSpecGasPriceCeilSet(
  event: LogTaskSpecGasPriceCeilSet
): void {}

export function handleLogTaskSpecProvided(event: LogTaskSpecProvided): void {}

export function handleLogTaskSpecUnprovided(
  event: LogTaskSpecUnprovided
): void {}

export function handleLogTaskSubmitted(event: LogTaskSubmitted): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
