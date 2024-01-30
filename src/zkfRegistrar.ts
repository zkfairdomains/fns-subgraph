import { 
  BigInt,  
  Bytes, 
  log, 
  ethereum,
  crypto,
  ByteArray,
  ens
} from "@graphprotocol/graph-ts"
 
import { 
  NameRegistered as NameRegisteredByController,
  NameRenewed as NameRenewedByController
} from "../generated/ZKFRegistrarController/ZKFRegistrarController"

import { 
  NameRegistered as NameRegisteredByRegistrar,
  NameRenewed as NameRenewedByRegistrar,
  Transfer as NameTransferredByRegistrar
} from "../generated/BaseRegistrarImplementation/BaseRegistrarImplementation"

import {  
  NewOwner as NameNewOwnerByRegistry,
  Transfer as NameTransferredByRegistry
} from "../generated/ENSRegistryWithFallback/ENSRegistryWithFallback"

 
import { Domain, Account } from "../generated/schema"

import { checkValidLabel, uint256ToByteArray } from "./utils"
 
const ZKF_NODE = "0x99399a6fdf00305eb312ceca5cb6971d481638860700d269d8e5056c8ccf8af5"
   
export function handleNameRegisteredByController(event: NameRegisteredByController): void {
    
  let cost = event.params.baseCost
  let expires = event.params.expires
  let hash = event.params.label
  let name = event.params.name
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
 
  if(!checkValidLabel(name)) {
    return;
  }

  let _owner = getAccount(owner);
  saveAccount(_owner)

  let domain = getDomain(hash, blockTimestamp) 
  domain.name = name + ".zkf";
  domain.labelName = name   
  domain.owner = _owner.id
  domain.registrant = _owner.id
  domain.registeredAt = blockTimestamp
  domain.expiryDate = expires;
  saveDomain(domain, event);
}

export function handleNameRenewedByController(event: NameRenewedByController): void {
   
  let cost = event.params.cost
  let expires = event.params.expires
  let hash = event.params.label
  let name = event.params.name
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  if(!checkValidLabel(name)) {
    return;
  }
  
  let domain = getDomain(hash, blockTimestamp)
  domain.name = name + ".zkf";
  domain.labelName = name;
  domain.expiryDate = expires,
  saveDomain(domain, event);

  let _owner = getAccount(domain.owner!);
  saveAccount(_owner);
}

 
export function handleNameRegisteredByRegistrar(event: NameRegisteredByRegistrar): void {

  let tokenId = event.params.id
  let expires = event.params.expires
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
 
  let label = uint256ToByteArray(tokenId) 
  let hash = Bytes.fromByteArray(label)
  let domain = getDomain(hash, blockTimestamp)
  
  let _owner = getAccount(owner);
  saveAccount(_owner)

  //let name = ens.nameByHash(label.toHexString());

  //if (name != null && domain.labelName === null) {
  //  domain.name = name + ".zkf";
  //  domain.labelName = name;
  //}
 
  domain.owner = _owner.id;
  domain.registrant = _owner.id
  domain.registeredAt = blockTimestamp
  domain.expiryDate = expires 
 
  saveDomain(domain, event)
}

export function handleNameRenewedByRegistrar(event: NameRenewedByRegistrar): void {

  let tokenId = event.params.id
  let expires = event.params.expires
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let label = uint256ToByteArray(tokenId) 
  let hash = Bytes.fromByteArray(label)
  let domain = getDomain(hash, blockTimestamp)

  //let name = ens.nameByHash(label.toHexString());

  //if (name != null && domain.labelName === null) {
  //  domain.name = name + ".zkf";
  //  domain.labelName = name;
  //} 

  domain.expiryDate = expires 
  saveDomain(domain, event)  
}

export function handleNameTransferredByRegistrar(event: NameTransferredByRegistrar): void {
  
  let tokenId = event.params.tokenId
  let from = event.params.from
  let to = event.params.to
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp

  let label = uint256ToByteArray(tokenId) 
  let hash = Bytes.fromByteArray(label)
  let domain = getDomain(hash, blockTimestamp) 

  let _owner = getAccount(to)
  saveAccount(_owner)

  domain.owner = _owner.id
  saveDomain(domain, event) 
}
 
export function handleTransferByRegistry(event: NameTransferredByRegistry): void {
  let node = event.params.node
  let owner = event.params.owner 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let _owner = getAccount(owner)
  saveAccount(_owner)

  let domain = getDomain(node, blockTimestamp)
  domain.owner = _owner.id
  saveDomain(domain, event)
} 

export function handleNewOwnerByRegistry(event: NameNewOwnerByRegistry): void { 
  let node = event.params.node
  let owner = event.params.owner
  let hash = event.params.label 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
  
  //let labelName = ens.nameByHash(hash.toHexString());
   
  let domain = getDomain(hash, blockTimestamp)
 
  let _owner = getAccount(owner)
  saveAccount(_owner)
 
  domain.owner = _owner.id
 
  //if (labelName != null) {
  //   domain.labelName = labelName;
  //} 

  saveDomain(domain, event)
} 

function getAccount(id: Bytes): Account {
  let account = Account.load(id)
  if(account === null) {
    return createAccount(id)
  }else{
    return account
  }
}

function createAccount(id: Bytes): Account {
  let account = new Account(id)  
  return account
}

function saveAccount(account: Account): void {
  account.save()
}

function saveDomain(domain: Domain, event: ethereum.Event): void {
  if(domain != null ) {    
      domain.save() 
  }
}
   
function getDomain(label: Bytes, timestamp: BigInt): Domain {
  let domain = Domain.load(getID(label))
  if(domain === null) {
    return createDomain(label, timestamp)
  }else{
    return domain
  }
}

function createDomain(label: Bytes, timestamp: BigInt): Domain {
  let domain = new Domain(getID(label))  
  domain.createdAt = timestamp 
  return domain
}

function getID(label: Bytes): Bytes {
  return label;
}
