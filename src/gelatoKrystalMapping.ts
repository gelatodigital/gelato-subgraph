import {
  LogExecSuccess,
  LogTaskSubmitted,
  LogTaskCanceled,
  LogTaskStored,
  LogTaskRemoved
} from "../generated/GelatoKrystal/GelatoKrystal";
import {
  GelatoKrystalTask,
  Executor,
  User
} from "../generated/schema";

// Task Submitted
export function handleLogTaskSubmitted(event: LogTaskSubmitted): void {
  // setting Id of taskreceipt
  let user = User.load(event.params.order.user.toHex());
  if (user == null) {
    user = new User(event.params.order.user.toHex());
    user.address = event.params.order.user;
    user.signUpDate = event.block.timestamp;
    user.save();
  }

  let taskId = event.params.taskId.toString();
  let gelatoKrystalTask = new GelatoKrystalTask(taskId);
  gelatoKrystalTask.user = user.id;
  gelatoKrystalTask.inToken = event.params.order.inToken;
  gelatoKrystalTask.outToken = event.params.order.outToken;
  gelatoKrystalTask.nTradesLeft = event.params.order.nTradesLeft;
  gelatoKrystalTask.amountPerTrade = event.params.order.amountPerTrade;
  gelatoKrystalTask.minSlippage = event.params.order.minSlippage;
  gelatoKrystalTask.maxSlippage = event.params.order.maxSlippage;
  gelatoKrystalTask.gasPriceCeil = event.params.order.gasPriceCeil;
  gelatoKrystalTask.lastExecutionTime = event.params.order.lastExecutionTime;
  gelatoKrystalTask.delay = event.params.order.delay;
  gelatoKrystalTask.status = "awaitingExec";
  gelatoKrystalTask.submissionHash = event.transaction.hash;
  gelatoKrystalTask.submissionDate = event.block.timestamp;
  gelatoKrystalTask.save();
}

export function handleLogExecSuccess(event: LogExecSuccess): void {
  let gelatoKrystalTask = GelatoKrystalTask.load(
    event.params.taskId.toString()
  );
  gelatoKrystalTask.executionDate = event.block.timestamp;
  gelatoKrystalTask.executionHash = event.transaction.hash;
  gelatoKrystalTask.status = "execSuccess";
  let executor = Executor.load(event.params.executor.toHex());
  if (executor == null) {
    executor = new Executor(event.params.executor.toHex());
    executor.addr = event.params.executor;
  }
  gelatoKrystalTask.executor = executor.id;
  gelatoKrystalTask.save();
}

export function handleLogTaskCanceled(event: LogTaskCanceled): void {
  let gelatoKrystalTask = GelatoKrystalTask.load(
    event.params.taskId.toString()
  );
  gelatoKrystalTask.executionDate = event.block.timestamp;
  gelatoKrystalTask.executionHash = event.transaction.hash;
  gelatoKrystalTask.status = "canceled";
  gelatoKrystalTask.save();
}

export function handleLogTaskStored(
  event: LogTaskStored
): void {}
  
export function handleLogTaskRemoved(
  event: LogTaskRemoved
): void {}
