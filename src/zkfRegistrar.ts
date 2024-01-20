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

import {  
  SetNameCall,
  SetNameForAddrCall
} from "../generated/ReverseRegistrar/ReverseRegistrar"
  
import { Domain, DomainEvent, Account } from "../generated/schema"

import {  createEventID, uint256ToByteArray } from "./utils"
 
 
export function handleSetName(call: SetNameCall): void {
  const name = call.inputs.name 
  let account = getAccount(call.from)
  account.primaryName = name;
  saveAccount(account);
}

export function handleSetNameForAddr(call: SetNameForAddrCall): void {
  const addr = call.inputs.addr 
  const name = call.inputs.name 
  let account = getAccount(addr)
  account.primaryName = name;
  saveAccount(account);
}
   
export function handleNameRegisteredByController(event: NameRegisteredByController): void {
    
  let cost = event.params.baseCost
  let expires = event.params.expires
  let hash = event.params.label
  let name = event.params.name
  let owner = event.params.owner
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
 
  let _owner = getAccount(owner);
  saveAccount(_owner)

  let domain = getDomainByLabelHash(hash, blockTimestamp) 
  domain.label = name   
  domain.owner = _owner.id
  domain.registrant = _owner.id
  domain.registered = blockTimestamp
  domain.expires = expires
  saveDomain(domain, event) 

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.name = "NameRegistered" 
  domainEvent.from = _owner.id
  domainEvent.cost = cost;
  domainEvent.expires = expires
  domainEvent.save()  
}

export function handleNameRenewedByController(event: NameRenewedByController): void {
   
  let cost = event.params.cost
  let expires = event.params.expires
  let hash = event.params.label
  let name = event.params.name
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let domain = getDomainByLabelHash(hash, blockTimestamp)
  domain.label = name   
  domain.expires = expires
  saveDomain(domain, event)

  let _owner = getAccount(domain.owner!);
  saveAccount(_owner)

  let domainEvent = new DomainEvent(createEventID(event))
  domainEvent.domain = domain.id
  domainEvent.blockNumber = blockNumber.toI32()
  domainEvent.transactionID = transactionHash
  domainEvent.blockTimestamp = blockTimestamp
  domainEvent.from = _owner.id
  domainEvent.cost = cost;
  domainEvent.name = "NameRenewed" 
  domainEvent.expires = expires
  domainEvent.save()  
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
  let domain = getDomainByLabelHash(hash, blockTimestamp)
  
  let _owner = getAccount(owner);
  saveAccount(_owner)

  let labelName = ens.nameByHash(label.toHexString());

  if (labelName != null && domain.label === null) {
    domain.label = labelName;
  } 

  domain.labelHash = hash; 
  domain.owner = _owner.id
  domain.registrant = _owner.id
  domain.registered = blockTimestamp
  domain.expires = expires 
 
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
  let domain = getDomainByLabelHash(hash, blockTimestamp)

  let labelName = ens.nameByHash(label.toHexString());

  if (labelName != null && domain.label === null) {
    domain.label = labelName;
  } 

  domain.expires = expires 
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
  let domain = getDomainByLabelHash(hash, blockTimestamp) 

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

  let domain = getDomainByLabelHash(node, blockTimestamp)
  domain.owner = _owner.id
  saveDomain(domain, event)
} 

export function handleNewOwnerByRegistry(event: NameNewOwnerByRegistry): void { 
  _handleNewOwner(event)
} 

export function handleTransferByRegistryOld(event: NameTransferredByRegistry): void { 
  handleTransferByRegistry(event)
} 

export function handleNewOwnerByRegistryOld(event: NameNewOwnerByRegistry): void { 
  _handleNewOwner(event)
} 

function _handleNewOwner(event: NameNewOwnerByRegistry): void {
  let node = event.params.node
  let owner = event.params.owner
  let hash = event.params.label 
  let blockNumber = event.block.number
  let transactionHash = event.transaction.hash
  let blockTimestamp = event.block.timestamp
   
  let domain = getDomainByLabelHash(hash, blockTimestamp)
 
  let _owner = getAccount(owner)
  saveAccount(_owner)
 
  domain.owner = _owner.id

  let labelName = ens.nameByHash(hash.toHexString());
  
  if (labelName != null && domain.label === null) {
    domain.label = labelName;
  } 

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
   
function getDomainByLabelHash(label: Bytes, timestamp: BigInt): Domain {
  let domain = Domain.load(label)
  if(domain === null) {
    return createDomainByLabelHash(label, timestamp)
  }else{
    return domain
  }
}

function createDomainByLabelHash(label: Bytes, timestamp: BigInt): Domain {
  let domain = new Domain(label)  
  domain.created = timestamp 
  return domain
}