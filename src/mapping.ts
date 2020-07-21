import { BigInt, Address } from "@graphprotocol/graph-ts";
import { log } from "@graphprotocol/graph-ts";

/**

class Tuple extends Array<Value> {}


  class Block {
    hash: Bytes
    parentHash: Bytes
    unclesHash: Bytes
    author: Address
    stateRoot: Bytes
    transactionsRoot: Bytes
    receiptsRoot: Bytes
    number: BigInt
    gasUsed: BigInt
    gasLimit: BigInt
    timestamp: BigInt
    difficulty: BigInt
    totalDifficulty: BigInt
    size: BigInt | null
  }
  class Transaction {
    hash: Bytes
    index: BigInt
    from: Address
    to: Address | null
    value: BigInt
    gasUsed: BigInt
    gasPrice: BigInt
    input: Bytes
  }

  class Call {
    to: Address
    from: Address
    block: Block
    transaction: Transaction
    inputValues: Array<EventParam>
    outputValues: Array<EventParam>
  }

  class Event {
    address: Address
    logIndex: BigInt
    transactionLogIndex: BigInt
    logType: string | null
    block: Block
    transaction: Transaction
    parameters: Array<EventParam>
  }


  class EventParam {
    name: string
    value: Value
  }
  */

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
  OwnershipTransferred,
  LogTaskSubmittedTaskReceiptTasksActionsStruct,
  LogTaskSubmittedTaskReceiptTasksConditionsStruct,
  SubmitTaskCall,
} from "../generated/Contract/Contract";
import {
  User,
  TaskReceiptWrapper,
  TaskReceipt,
  TaskCycle,
  Task,
  Provider,
  Condition,
  Action,
  Executor,
} from "../generated/schema";

function getOperation(operation: i32): string {
  switch (operation) {
    // Call
    case 0:
      return "0";
    case 1:
      // Delegatecall
      return "1";
    default:
      throw new Error("Operation incorrect");
  }
}

function getDataFlow(dataFlow: i32): string {
  switch (dataFlow) {
    // None
    case 0:
      return "0";
    // In
    case 1:
      return "1";
    // Out
    case 2:
      return "2";
    // InAndOut
    case 3:
      return "3";
    default:
      throw new Error("DataFlow incorrect");
  }
}

function getAction(
  eventAction: LogTaskSubmittedTaskReceiptTasksActionsStruct
): Action | null {
  let action = new Action(eventAction.addr.toHex());
  action.addr = eventAction.addr;
  action.data = eventAction.data;
  action.dataFlow = getDataFlow(eventAction.dataFlow);
  action.operation = getOperation(eventAction.operation);
  action.termsOkCheck = eventAction.termsOkCheck;
  action.value = eventAction.value;

  return action;
}

function getCondition(
  eventAction: LogTaskSubmittedTaskReceiptTasksConditionsStruct
): Condition | null {
  let condition = new Condition(eventAction.inst.toHex());
  condition.save();

  condition.inst = eventAction.inst;
  condition.data = eventAction.data;

  return condition;
}

// Task Submitted
export function handleLogTaskSubmitted(event: LogTaskSubmitted): void {
  // setting Id of taskreceipt
  let user = User.load(event.params.taskReceipt.userProxy.toHex());
  if (user == null) {
    user = new User(event.params.taskReceipt.userProxy.toHex());
    user.address = event.params.taskReceipt.userProxy;
    user.signUpDate = BigInt.fromI32(10);
    user.save();
  }

  // let taskReceipt = new TaskReceipt(event.params.taskReceiptId.toHex());
  // taskReceipt.userProxy = user.address;
  // // New Provider
  // let provider = Provider.load(event.params.taskReceipt.provider.addr.toHex());
  // if (provider == null) {
  //   provider = new Provider(event.params.taskReceipt.provider.addr.toHex());
  //   // Entity fields can be set using simple assignments
  //   provider.taskCount = BigInt.fromI32(0);
  // }
  // provider.addr = event.params.taskReceipt.provider.addr;
  // provider.module = event.params.taskReceipt.provider.module;
  // provider.taskCount = provider.taskCount.plus(BigInt.fromI32(1));
  // provider.save();
  // taskReceipt.provider = provider.id;
  // // Index
  // taskReceipt.index = event.params.taskReceipt.index;
  // // Iterate over all tasks
  // let taskArray = new Array<string>();
  // let eventTaskArray = event.params.taskReceipt.tasks;
  // let tasksNum = eventTaskArray.length;
  // for (let i = 0; i < tasksNum; ++i) {
  //   let task = new Task(event.params.taskReceiptId.toHex());
  //   taskArray.push(task.id);
  //   if (eventTaskArray[i] != null) {
  //     let eventTask = eventTaskArray[i];
  //     // Fetch the Actions
  //     let actions = eventTask.actions;
  //     let actionsLength = eventTask.actions.length;
  //     let actionArray = new Array<string>();
  //     for (let j = 0; j < actionsLength; ++j) {
  //       if (actions[i] != null) {
  //         let eventAction = actions[i];
  //         let action = getAction(eventAction) as Action;
  //         actionArray.push(action.id);
  //       }
  //     }
  //     task.actions = actionArray;
  //     // Fetch Conditions
  //     let conditions = eventTask.conditions;
  //     let conditionLength = eventTask.conditions.length;
  //     let conditionArray = new Array<string>();
  //     for (let j = 0; j < conditionLength; ++j) {
  //       if (conditions[i] != null) {
  //         let eventCondition = conditions[i];
  //         let condition = getCondition(eventCondition) as Condition;
  //         conditionArray.push(condition.id);
  //       }
  //     }
  //     // Add selfProviderGasLimit && selfProviderGasPriceCeil
  //     task.selfProviderGasLimit = eventTask.selfProviderGasLimit;
  //     task.selfProviderGasPriceCeil = eventTask.selfProviderGasPriceCeil;
  //   }
  // }
  // // Add tasks to TaskReceipt
  // taskReceipt.tasks = taskArray;
  // // Add the remaining fields
  // taskReceipt.expiryDate = event.params.taskReceipt.expiryDate;
  // taskReceipt.cycleId = event.params.taskReceipt.cycleId;
  // taskReceipt.submissionsLeft = event.params.taskReceipt.submissionsLeft;
  // taskReceipt.save();

  // // Add taskReceipt to Task Cycle
  // let taskCycle = TaskCycle.load(taskReceipt.cycleId.toHex());
  // if (taskCycle == null) {
  //   taskCycle = new TaskCycle(taskReceipt.cycleId.toHex());
  // }
  // taskCycle.tasksReceipts.push(taskReceipt.id);
  // taskCycle.save();

  // // // ==== Create TaskReceiptWrapper === \\
  // let taskReceiptWrapper = new TaskReceiptWrapper(
  //   event.params.taskReceiptId.toHex()
  // );
  // taskReceiptWrapper.user = user.id;
  // taskReceiptWrapper.taskReceipt = taskReceipt.id;
  // taskReceiptWrapper.taskReceipt = taskReceipt.id;
  // taskReceiptWrapper.submissionHash = event.transaction.hash;
  // taskReceiptWrapper.status = "awaitingExec";
  // taskReceiptWrapper.submissionDate = event.block.timestamp;

  // // Assigned Executor
  // let gelatoCore = Contract.bind(event.address);
  // let executor = gelatoCore.executorByProvider(
  //   Address.fromString(provider.addr.toString())
  // );
  // taskReceiptWrapper.selectedExecutor = executor;

  // taskReceiptWrapper.selfProvided =
  //   provider.addr == user.address ? true : false;

  // taskReceiptWrapper.save();
}

export function handleLogCanExecFailed(event: LogCanExecFailed): void {
  // const id = event.transaction.from.toHex();
  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex());
  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex());
  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0);
  // }
  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1);
  // // Entity fields can be set based on event parameters
  // entity.executor = event.params.executor;
  // entity.taskReceiptId = event.params.taskReceiptId;
  // // Entities can be written to the store with `.save()`
  // entity.save();
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

export function handleLogExecReverted(event: LogExecReverted): void {
  log.debug("HandleLogExecReverted {}", [
    event.params.taskReceiptId.toString(),
  ]);
  let taskReceiptWrapper = TaskReceiptWrapper.load(
    event.params.taskReceiptId.toHex()
  );
  if (taskReceiptWrapper != null) {
    taskReceiptWrapper.status = "execReverted";
    taskReceiptWrapper.save();
  }
}

export function handleLogExecSuccess(event: LogExecSuccess): void {
  let taskReceiptWrapper = TaskReceiptWrapper.load(
    event.params.taskReceiptId.toHex()
  );
  if (taskReceiptWrapper != null) {
    taskReceiptWrapper.status = "execSuccess";
    taskReceiptWrapper.save();
  }
}

export function handleLogExecutorAssignedExecutor(
  event: LogExecutorAssignedExecutor
): void {}

export function handleLogExecutorBalanceWithdrawn(
  event: LogExecutorBalanceWithdrawn
): void {}

export function handleLogExecutorStaked(event: LogExecutorStaked): void {
  let executor = Executor.load(event.params.executor.toHex());
  if (executor == null) {
    executor = new Executor(event.params.executor.toHex());
  }
  executor.save();
}

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

export function handleLogTaskCancelled(event: LogTaskCancelled): void {
  let taskReceiptWrapper = TaskReceiptWrapper.load(
    event.params.taskReceiptId.toHex()
  );

  if (taskReceiptWrapper != null) {
    taskReceiptWrapper.status = "cancelled";
    taskReceiptWrapper.save();
  }
}

export function handleLogTaskSpecGasPriceCeilSet(
  event: LogTaskSpecGasPriceCeilSet
): void {}

export function handleLogTaskSpecProvided(event: LogTaskSpecProvided): void {}

export function handleLogTaskSpecUnprovided(
  event: LogTaskSpecUnprovided
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

// export function handleSubmitTask(call: SubmitTaskCall): void {
//   let eventTaskReceipt = call.inputs._task.

//   let user = User.load(event.params.taskReceipt.userProxy.toHex());
//   if (user == null) {
//     user = new User(event.params.taskReceipt.userProxy.toHex());
//     user.address = event.params.taskReceipt.userProxy;
//     user.signUpDate = BigInt.fromI32(10);
//     user.save();
//   }

//   let taskReceipt = new TaskReceipt(event.params.taskReceiptId.toHex());
//   taskReceipt.userProxy = user.address;
//   // New Provider
//   let provider = Provider.load(event.params.taskReceipt.provider.addr.toHex());
//   if (provider == null) {
//     provider = new Provider(event.params.taskReceipt.provider.addr.toHex());
//     // Entity fields can be set using simple assignments
//     provider.taskCount = BigInt.fromI32(0);
//   }
//   provider.addr = event.params.taskReceipt.provider.addr;
//   provider.module = event.params.taskReceipt.provider.module;
//   provider.taskCount = provider.taskCount.plus(BigInt.fromI32(1));
//   provider.save();
//   taskReceipt.provider = provider.id;
//   // Index
//   taskReceipt.index = event.params.taskReceipt.index;
//   // Iterate over all tasks
//   let taskArray = new Array<string>();
//   let eventTaskArray = event.params.taskReceipt.tasks;
//   let tasksNum = eventTaskArray.length;
//   for (let i = 0; i < tasksNum; ++i) {
//     let task = new Task(event.params.taskReceiptId.toHex());
//     taskArray.push(task.id);
//     if (eventTaskArray[i] != null) {
//       let eventTask = eventTaskArray[i];
//       // Fetch the Actions
//       let actions = eventTask.actions;
//       let actionsLength = eventTask.actions.length;
//       let actionArray = new Array<string>();
//       for (let j = 0; j < actionsLength; ++j) {
//         if (actions[i] != null) {
//           let eventAction = actions[i];
//           let action = getAction(eventAction) as Action;
//           actionArray.push(action.id);
//         }
//       }
//       task.actions = actionArray;
//       // Fetch Conditions
//       let conditions = eventTask.conditions;
//       let conditionLength = eventTask.conditions.length;
//       let conditionArray = new Array<string>();
//       for (let j = 0; j < conditionLength; ++j) {
//         if (conditions[i] != null) {
//           let eventCondition = conditions[i];
//           let condition = getCondition(eventCondition) as Condition;
//           conditionArray.push(condition.id);
//         }
//       }
//       // Add selfProviderGasLimit && selfProviderGasPriceCeil
//       task.selfProviderGasLimit = eventTask.selfProviderGasLimit;
//       task.selfProviderGasPriceCeil = eventTask.selfProviderGasPriceCeil;
//     }
//   }
//   // Add tasks to TaskReceipt
//   taskReceipt.tasks = taskArray;
//   // Add the remaining fields
//   taskReceipt.expiryDate = event.params.taskReceipt.expiryDate;
//   taskReceipt.cycleId = event.params.taskReceipt.cycleId;
//   taskReceipt.submissionsLeft = event.params.taskReceipt.submissionsLeft;
//   taskReceipt.save();

//   // Add taskReceipt to Task Cycle
//   let taskCycle = TaskCycle.load(taskReceipt.cycleId.toHex());
//   if (taskCycle == null) {
//     taskCycle = new TaskCycle(taskReceipt.cycleId.toHex());
//   }
//   taskCycle.tasksReceipts.push(taskReceipt.id);
//   taskCycle.save();

//   // // ==== Create TaskReceiptWrapper === \\
//   let taskReceiptWrapper = new TaskReceiptWrapper(
//     event.params.taskReceiptId.toHex()
//   );
//   taskReceiptWrapper.user = user.id;
//   taskReceiptWrapper.taskReceipt = taskReceipt.id;
//   taskReceiptWrapper.taskReceipt = taskReceipt.id;
//   taskReceiptWrapper.submissionHash = event.transaction.hash;
//   taskReceiptWrapper.status = "awaitingExec";
//   taskReceiptWrapper.submissionDate = event.block.timestamp;

//   // Assigned Executor
//   let gelatoCore = Contract.bind(event.address);
//   let executor = gelatoCore.executorByProvider(
//     Address.fromString(provider.addr.toString())
//   );
//   taskReceiptWrapper.selectedExecutor = executor;

//   taskReceiptWrapper.selfProvided =
//     provider.addr == user.address ? true : false;

//   taskReceiptWrapper.save();

// }
