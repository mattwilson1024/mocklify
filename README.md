[![GitHub release](https://img.shields.io/github/release/mattwilson1024/mocklify.svg)](https://github.com/mattwilson1024/mocklify/releases/)
![Tests](https://github.com/mattwilson1024/mocklify/workflows/Tests/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![GitHub license](https://img.shields.io/github/license/mattwilson1024/mocklify.svg)](https://github.com/mattwilson1024/mocklify/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mattwilson1024/mocklify.svg?style=social&label=Star&maxAge=2592000)](https://github.com/mattwilson1024/mocklify/stargazers/)

---

![mocklify](./assets/logo_400w.png "mocklify")

> A powerful and flexible tool for managing mock data

# Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Why Mocklify?](#why-mocklify)
- [Pipeline Overview](#pipeline-overview)
- [Data Sources](#data-sources)
  - [add()](#add)
  - [addAll()](#addAll)
  - [generate()](#generate)
  - [generatePartial()](#generatePartial)
- [Filters](#filters)
  - [filter()](#filter)
- [Transformation Operators](#transformation-operators)
  - [omit()](#omit)
  - [override()](#override)
  - [modify()](#modify)
- [Transformation Scopes](#transformation-scopes)
  - [where()](#where)
- [Terminators](#terminators)
  - [getAll()](#getAll)
  - [get()](#get)
  - [getSlice()](#getSlice)
  - [getFirst()](#getFirst)
  - [getLast()](#getLast)
  - [getOne()](#getOne)
  - [getWhere()](#getWhere)
  - [getRandom()](#getRandom)
  - [getRandomOne()](#getRandomOne)
  - [getShuffled()](#getShuffled)
- [Contributors](#contributors-✨)

# Installation

Using NPM:

```
npm install -D mocklify
```

Using Yarn:

```
yarn add mocklify --dev
```

# Quick Start

1. Install `mocklify` using NPM or Yarn

2. (Optional) Alongside your type definitions, define a set of _base mocks_. Note: These only need to be defined once - we recommend colocating them with your model definitions, rather than with your tests.

```typescript
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export const MOCK_USERS: IUser[] = [
  {
    id: 'user1',
    firstName: 'Harry',
    lastName: 'Potter',
    isAdmin: false
  },
  ...
]
```

3. When writing tests, use Mocklify to obtain a suitable set of mock data, manipulating it in any way that is needed for that particular test.

```typescript
import { mocklify, override } from 'mocklify';

const mockData = mocklify<IUser>()
  .add(10, MOCK_USERS)
  .transform(
    override({ isAdmin: true }),
  )
  .getAll();
```

This is just the tip of the iceberg - Mocklify offers a powerful chained API allowing data to be selected, generated, filtered and transformed in many different ways. Read on to find out more.

# Why Mocklify?

In short, Mocklify enables powerful, understandable and maintainable code, without many of the problems that generally occur when working with mock data.

The motivation behind the Mocklify library is explored in more depth in the ["Why Mocklify?" wiki article](https://github.com/mattwilson1024/mocklify/wiki/Why-Mocklify%3F).

# Pipeline Overview

To use Mocklify you define a pipeline of steps, each of which adds, removes or transforms data in some way.

At the end of the chain, you call a "terminator" function which returns the data.

Generally, the first step(s) will accumulate data from one or more sources (objects from a predefined set of mock data, newly generated mock objects, or any combination). After this, optional filtering and transformation steps can be used to manipulate the data to your needs, before it is then returned by one of the terminator functions.

The following diagram shows an example Mocklify pipeline: 

```
                                 const results = mocklify<IUser>()                
┌─────────────────────┐                                                           
│    Data Sources     │◀ ─ ─ ─ ─ ─ .add(20, MOCK_USERS)                           
└─────────────────────┘            .generate(10, greatWizards)                    
           │                                                                      
           ▼                                                                      
┌─────────────────────┐                                                           
│       Filters       │◀ ─ ─ ─ ─ ─ .filter(isDeathEater)                          
└─────────────────────┘                                                           
           │                                                                      
           ▼                                                                      
┌─────────────────────┐                                                           
│   Transformations   │◀ ─ ─ ─ ─ ─ .transform(                                       
└─────────────────────┘              omit(['isOnline']),                          
           │                         where(isGryffindor,                           
           │                           modify(user => user.points += 1000)        
           │                         ),                                           
           │                         where(isSlytherin,                           
           │                           override({ points: 0 })                    
           │                         ),                                           
           ▼                       )                                              
┌─────────────────────┐                                                           
│     Terminator      │◀ ─ ─ ─ ─ ─ .getAll();                                     
└─────────────────────┘                                                           
                                                                                  
```

Data Sources [[learn more](#data-sources)]

- `add` - adds a specified number of predefined mock objects to the data set
- `addAll` - adds all provided predefined mock objects to the data set
- `generate` - generates a specific number of new objects using a factory function, and adds them to the data set
- `generatePartial` - generates a specific number of new objects using a partial factory function, and adds them to the data set

Filters [[learn more](#filters)]

- `filter` - removes any items from the data set which don't match the provided predicate

Transformations [[learn more](#transformation-operators)]

- `transform` - applies a chain of [transformation operators](#transformation-operators) to the data set. Transform operators apply to all items by default, but can be limited to a specific subset using [transformation scopes](#transformation-scopes).

Terminators [[learn more](#terminators)]

- `getAll` - returns all items in the data set
- `get` - returns the specified number of items from the data set
- `getSlice` - returns a subset of items in the data set
- `getFirst` - returns the first item in the data set
- `getLast` - returns the last item in the data set
- `getOne` - returns a single item from the data set that matches a predicate (if multiple items match, the first is returned)
- `getWhere` - returns any items from the data set which match a predicate
- `getRandom` - returns a specific number of random items from the data set
- `getRandomOne` - Returns a single item from the data set, selected at random
- `getShuffled` - returns all items from the data set, shuffled into a random order

# Data Sources

The core state of the Mocklify pipeline is an in-memory set of mock data, in the form of a strongly typed array. Because each use-case is likely to need a different set of data, Mocklify is flexible about how this data set is constructed.

At any point in the pipeline (typically the start), items can be _added_ to current data set using any combination of:

- predefined mock objects (using the `add` or `addAll` functions)
- generated mock objects (using the `generate` function)

## add()

> `add(targetLength: number, items: T[], predicate?: FilterPredicate<T>)`

The `add` method pushes a specific number of items from a source set of predefined mock objects into the current data set. 

The `targetLength` parameter defines exactly how many items should be added. If the source array contains more items than requested, Mocklify takes the first `n` items. If it contains less items than requested, then it will repeat items as many times are needed to reach the target length.

The optional `predicate` parameter allows more control over which items from the source set are added. Only items that match the predicate will be used.

## addAll()

> `addAll(items: T[], predicate?: FilterPredicate<T>)`

The `addAll` method pushes all items from a source set of predefined mock objects into the current data set. This is similar to `add()` but is not constrained to a specific length.

The optional `predicate` parameter limits which items are included.

## generate()

> `generate(count: number, factory: MockFactory<T>)`

The `generate` method generates a specific number of new objects using the provided factory function. This is useful if you need mock objects that are not based on a predefined set of examples.

The function takes two parameters:
- The number of items to generate
- A factory function which, given the index, returns a new mock object.

```typescript
export const MOCK_USER_FACTORY = (index: number): IUser => {
  return {
    id: `user_${index}`,
    firstName: 'FirstName',
    lastName: 'LastName',
    isAdmin: false,
    ...
  };
};

const twentyGeneratedUsers = mocklify<IUser>()
  .generate(20, MOCK_USER_FACTORY)
  .getAll();
```

The above example will generate 20 users with incrementing IDs, but they will all have the same static `firstName` and `lastName` properties. 

For more sophisticated data generation, it is easy to combine Mocklify with other libraries such as [Faker.js](https://github.com/marak/Faker.js/), like so:

```typescript
import { mocklify } from 'mocklify';
import { lorem, name, random } from 'faker';

export const MOCK_USER_FACTORY: MockFactory<IUser> = (index: number): IUser => {
  return {
    id: random.uuid(),
    firstName: name.firstName(),
    lastName: name.lastName(),
    note: lorem.paragraph(),
    ...
  };
};

const twentyGeneratedUsers = mocklify<IUser>()
  .generate(20, MOCK_USER_FACTORY)
  .getAll();
```

## generatePartial()

> `generatePartial(count: number, factory: PartialMockFactory<T>)`

The `generatePartial` method is similar to [generate()](#generate), except that the factory function is not required to specify all required properties of the generated object up front (i.e. it returns `Partial<T>` instead of `T`).

This simplies the process of creating mock objects and is particularly useful when combined with [transformation operators](#transformation-operators). 

In the example below, the factory function only sets up minimal information about the user (the `id` property) on the assumption that any other properties of importance will be populated later in the pipeline (by transformation operators):

```typescript
export const PARTIAL_MOCK_USER_FACTORY: PartialMockFactory<IUser> = (index: number): Partial<IUser> => {
  return {
    id: `user_${index}`
  };
};

const results = mocklify<IUser>()
  .generatePartial(3, PARTIAL_MOCK_USER_FACTORY)
  .transform(
    modify((user, index) => user.firstName = `Generated User ${index + 1}`)
  )
  .getAll();
```

# Filters

After adding data from one or more [data sources](data-sources), filters allow the current data set to be reduced if required.

Note: These filters apply to the pipeline's entire internal data set (i.e. after combining data from one or more data sources). In many cases, it may be better to avoid adding certain items in the first place - this can be achieved by passing a predicate to the data source methods at the point of adding data.

## filter()

> filter(predicate: FilterPredicate<T>)

Filters the current data set to only include items that fulfil the specified criteria.

```typescript
const whereNameIsPotter: FilterPredicate<IUser> = user => user.lastName === 'Potter';

const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .filter(whereNameIsPotter)
  .getAll();
```

# Transformation Operators

Transformation operators are the heart of Mocklify. They are composable, chainable methods which transform data items in some way.

To use them, pass one or more operators into the `transform` pipeline step.

Mocklify's transformation operators will _automatically_ be immutable (they will never mutate the original input sources). Internally, Mocklify uses [Immer](https://github.com/immerjs/immer) to get immutable state.

## omit()

> `omit<T>(propsToOmit: Array<keyof T>)`

Removes one or more specific properties from the data

```typescript
const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .transform(
    omit(['isAdmin'])
  )
  .getAll();
```

## override()

> `override<T, P extends Partial<T>>(propsToOverride: P)`

Overrides specific properties with new values, spreading them on top of the original object

```typescript
const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .transform(
    override({ isAdmin: true }),
  )
  .getAll();
```

## modify()

> `modify<T>(modifierFunction: ModifierFunction<T>)`

Takes a callback function which gives full control over modifying the object in any way. 

The provided function is given the item, its index and the full array of items. This can be very helpful for updating values based on the existing data or the index.

Mocklify takes care of applying the changes in an immutable way.

```typescript
const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .transform(
    modify((user, index, allUsers) => {
      user.id = `user_${index}`;
      user.firstName = `${user.firstName} (user ${index + 1} of ${allUsers.length})`;
      user.points *= 2;
    })
  )
  .getAll();
```

Note: The `modify` operator is a powerhouse and could, in theory, negate the need for the other operators. For example, `modify` can achieve everything that `override` does and more. However, we believe that the other operators bring increased readability for simple use cases.

# Transformation Scopes

By default, transformations apply to _all_ items in the data set.

Sometimes, it may be useful to apply transformations only to certain items in the data set. This is possible by wrapping `transformation operators` in a `scope`.

## where()

> `where<T>(limiter: Limiter<T>, ...operators: Operator<T>[])`

The `where` scope applies the specified chain of `transformation operators` only to those items that fulfil the criteria defined by the `limiter`.

This unlocks a lot of power. For inspiration, here are some examples of how we might use scopes and operators for a list of users:
- "Promote all users in a particular group to be admins"
- "Omit the `lastName` property for a random subset of users"
- "Set `isOnline` to true for the first 10 users, and false for the rest"

Let's try an example: say I'm not interested in the users' online status, I want to bump the house points of Gryffindors, nuke the points for Slytherins, max out Harry's points and make him an admin for good measure.

This could achieved as follows:

```typescript
import { mocklify, modify, omit, override, where, Limiter } from 'mocklify';

const isGryffindor: Limiter<IUser> = user => user.tagIds.includes(MOCK_TAGS.gryffindor.id);
const isSlytherin: Limiter<IUser> = user => user.tagIds.includes(MOCK_TAGS.slytherin.id);
const isHarry: Limiter<IUser> = user => user.firstName === 'Harry' && user.lastName === 'Potter';

const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .transform(
    omit(['isOnline']),
    where(isGryffindor,
      modify(user => user.points += 1000)
    ),
    where(isSlytherin,
      override({ points: 0 })
    ),
    where(isHarry,
      override({
        points: 9999,
        isAdmin: true
      })
    )
  )
  .getAll();
```

# Terminators

Terminator methods are the final step in a Mocklify chain, used to access the fruit of your labour.

Terminator methods return the current data set, or some subset of that data set, ready for consumption by your app or tests.

## getAll()

> `getAll(): T[]`

Returns all items in the data set.

## get()

> `get(count: number): T[]`

Returns the specified number of items from the data set.

## getSlice()

> `getSlice(start: number, end?: number): T[]`

Returns a subset of items in the data set. 

As per `Array.prototype.slice`, the `end` parameter is optional and negative values are supported, acting as an offset from the end of the array.

## getFirst()

> `getFirst(): T | undefined`

Returns the first item in the data set.

## getLast()

> `getLast(): T | undefined`

Returns the last item in the data set.

## getOne()

> `getOne(predicate: FilterPredicate<T>): T | undefined`

Returns a single item from the data set that matches a predicate (if multiple items match, the first is returned).

## getWhere()

> `getWhere(predicate: FilterPredicate<T>): T[]`

Returns any items from the data set which match a predicate.

## getRandom()

> `getRandom(count: number): T[]`

Returns a specific number of random items from the data set.

## getRandomOne()

> `getRandomOne(): T | undefined`

Returns a single item from the data set, selected at random (or undefined if there are no items in the data set).

## getShuffled()

> `getShuffled(): T[]`

Returns all items from the data set, shuffled into a random order

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/mattwilson1024"><img src="https://avatars1.githubusercontent.com/u/3042769?v=4" width="100px;" alt=""/><br /><sub><b>mattwilson1024</b></sub></a><br /><a href="https://github.com/mattwilson1024/mocklify/commits?author=mattwilson1024" title="Code">💻</a> <a href="#ideas-mattwilson1024" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/mattwilson1024/mocklify/commits?author=mattwilson1024" title="Documentation">📖</a> <a href="#maintenance-mattwilson1024" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/MatthewAlner"><img src="https://avatars2.githubusercontent.com/u/2782730?v=4" width="100px;" alt=""/><br /><sub><b>MatthewAlner</b></sub></a><br /><a href="https://github.com/mattwilson1024/mocklify/commits?author=MatthewAlner" title="Code">💻</a> <a href="#ideas-MatthewAlner" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/mattwilson1024/mocklify/commits?author=MatthewAlner" title="Documentation">📖</a> <a href="#maintenance-MatthewAlner" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
