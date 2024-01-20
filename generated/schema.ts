// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Domain extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Domain entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Domain must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Domain", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Domain | null {
    return changetype<Domain | null>(store.get("Domain", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get label(): string | null {
    let value = this.get("label");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set label(value: string | null) {
    if (!value) {
      this.unset("label");
    } else {
      this.set("label", Value.fromString(<string>value));
    }
  }

  get labelHash(): Bytes | null {
    let value = this.get("labelHash");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set labelHash(value: Bytes | null) {
    if (!value) {
      this.unset("labelHash");
    } else {
      this.set("labelHash", Value.fromBytes(<Bytes>value));
    }
  }

  get owner(): Bytes | null {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes | null) {
    if (!value) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromBytes(<Bytes>value));
    }
  }

  get expires(): BigInt | null {
    let value = this.get("expires");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set expires(value: BigInt | null) {
    if (!value) {
      this.unset("expires");
    } else {
      this.set("expires", Value.fromBigInt(<BigInt>value));
    }
  }

  get registrant(): Bytes | null {
    let value = this.get("registrant");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set registrant(value: Bytes | null) {
    if (!value) {
      this.unset("registrant");
    } else {
      this.set("registrant", Value.fromBytes(<Bytes>value));
    }
  }

  get registered(): BigInt | null {
    let value = this.get("registered");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set registered(value: BigInt | null) {
    if (!value) {
      this.unset("registered");
    } else {
      this.set("registered", Value.fromBigInt(<BigInt>value));
    }
  }

  get created(): BigInt | null {
    let value = this.get("created");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set created(value: BigInt | null) {
    if (!value) {
      this.unset("created");
    } else {
      this.set("created", Value.fromBigInt(<BigInt>value));
    }
  }

  get events(): Array<Bytes> {
    let value = this.get("events");
    return value!.toBytesArray();
  }

  set events(value: Array<Bytes>) {
    this.set("events", Value.fromBytesArray(value));
  }
}

export class DomainEvent extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DomainEvent entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type DomainEvent must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("DomainEvent", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): DomainEvent | null {
    return changetype<DomainEvent | null>(
      store.get("DomainEvent", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get blockNumber(): i32 {
    let value = this.get("blockNumber");
    return value!.toI32();
  }

  set blockNumber(value: i32) {
    this.set("blockNumber", Value.fromI32(value));
  }

  get transactionID(): Bytes | null {
    let value = this.get("transactionID");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set transactionID(value: Bytes | null) {
    if (!value) {
      this.unset("transactionID");
    } else {
      this.set("transactionID", Value.fromBytes(<Bytes>value));
    }
  }

  get blockTimestamp(): BigInt | null {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt | null) {
    if (!value) {
      this.unset("blockTimestamp");
    } else {
      this.set("blockTimestamp", Value.fromBigInt(<BigInt>value));
    }
  }

  get domain(): Bytes {
    let value = this.get("domain");
    return value!.toBytes();
  }

  set domain(value: Bytes) {
    this.set("domain", Value.fromBytes(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get from(): Bytes | null {
    let value = this.get("from");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set from(value: Bytes | null) {
    if (!value) {
      this.unset("from");
    } else {
      this.set("from", Value.fromBytes(<Bytes>value));
    }
  }

  get to(): Bytes | null {
    let value = this.get("to");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set to(value: Bytes | null) {
    if (!value) {
      this.unset("to");
    } else {
      this.set("to", Value.fromBytes(<Bytes>value));
    }
  }

  get cost(): BigInt | null {
    let value = this.get("cost");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set cost(value: BigInt | null) {
    if (!value) {
      this.unset("cost");
    } else {
      this.set("cost", Value.fromBigInt(<BigInt>value));
    }
  }

  get expires(): BigInt | null {
    let value = this.get("expires");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set expires(value: BigInt | null) {
    if (!value) {
      this.unset("expires");
    } else {
      this.set("expires", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class Account extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Account entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Account must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Account", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Account | null {
    return changetype<Account | null>(store.get("Account", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get primaryName(): string | null {
    let value = this.get("primaryName");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set primaryName(value: string | null) {
    if (!value) {
      this.unset("primaryName");
    } else {
      this.set("primaryName", Value.fromString(<string>value));
    }
  }

  get domains(): Array<Bytes> {
    let value = this.get("domains");
    return value!.toBytesArray();
  }

  set domains(value: Array<Bytes>) {
    this.set("domains", Value.fromBytesArray(value));
  }
}