## Gelato Network Subgraph

This repository contains the schemas & event handlers that compose Gelato's Subgraph, enabling developers to easily fetch indexed data from the GelatoCore smart contract.

The respective smart contract can be found [here](https://github.com/gelatodigital/gelato-network/blob/master/contracts/gelato_core/GelatoCore.sol).

This Subraph is available on the following Networks:
- [Mainnet](https://thegraph.com/explorer/subgraph/gelatodigital/gelato-network)
- [Rinkeby](https://thegraph.com/explorer/subgraph/gelatodigital/gelato-network-rinkeby)

## Queries

### Querying All Task Receipt Wrappers of a certain User

On gelato, a user can submit a [Task](https://github.com/gelatodigital/gelato-network/blob/257f534cf0de7652928d082b09fd32d4db12c969/contracts/gelato_core/interfaces/IGelatoCore.sol#L31-L36), which defines what conditions the gelato Executors should track and what actions they should execute on behalf of the user. When submitted, gelato emits a [TaskReceipt](https://github.com/gelatodigital/gelato-network/blob/257f534cf0de7652928d082b09fd32d4db12c969/contracts/gelato_core/interfaces/IGelatoCore.sol#L38-L47), which contains additional information, such as how often the submitted `Task` should be executed, among others.

Gelato's Subgraph provide you with an API to query `Task Receipt Wrappers`, which basically contain a `Task Receipt`, plus additional information around its current status, transactions hashes, timestamps when it was submitted & executed and whether the User pays for the Task direcly (being a self-provider) or has someone else paying for him (external provider).

You can query every all `TaskReceiptWrappers` of a single User, in this case address `0xb0511d19216320e0612746cb24943300b03955f3` like this:

```graphql
{
  taskReceiptWrappers(where: {user: "0xb0511d19216320e0612746cb24943300b03955f3"}) {
    taskReceipt {
      id
      userProxy
      provider {
        addr
        module
      }
      index
      tasks {
        conditions {
          inst
          data
        }
        actions {
          addr
          data
          operation
          dataFlow
          value
          termsOkCheck
        }
        selfProviderGasLimit
        selfProviderGasPriceCeil
      }
      expiryDate
      cycleId
      submissionsLeft
    }
    submissionHash
    status
    submissionDate
    executionDate
    executionHash
    selfProvided
  }
}
```

## Help

If you have questions, feel free to shoot us a message in our [Telegram](https://t.me/joinchat/HbZmeE1JoKF92g_idVz6nA) or [Discord](https://discord.gg/Avmrfg7) channels!
