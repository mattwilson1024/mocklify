[![GitHub release](https://img.shields.io/github/release/mattwilson1024/mocklify.svg)](https://GitHub.com/mattwilson1024/mocklify/releases/)
![Tests](https://github.com/mattwilson1024/mocklify/workflows/Tests/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![GitHub license](https://img.shields.io/github/license/mattwilson1024/mocklify.svg)](https://github.com/mattwilson1024/mocklify/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mattwilson1024/mocklify.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/mattwilson1024/mocklify/stargazers/)

---

![mocklify](./assets/logo_400w.png "mocklify")

> A powerful and flexible tool for managing mock data

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
  .mutate(
    override({ isAdmin: true }),
  )
  .getAll();
```

This is just the tip of the iceberg - Mocklify offers a powerful chained API allowing data to be selected, generated, filtered and transformed in many different ways. Read on to find out more.

# Why Mocklify?

Mock data is a crucial element in many aspects of software development. For example:

- For passing into functions, classes or components when writing tests
- For passing as props into components when viewing them with [Storybook](https://storybook.js.org/)
- For simulated demos or examples

Defining and using mock data is generally straightforward but, without care, mock data can quickly become messy, unwieldy and hard to maintain over time (as the codebase grows in size or complexity).

Mocklify aims to ease this pain, providing a simple yet powerful API for working with mock data in a maintainable and declarative manner.

## Let's explore an example...

Suppose our application keeps track of a list of users. One of the models in our app is a simple `IUser` type as below:

```typescript
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}
```

In order to test the "user list" feature, we might start by writing a test which defines some mock users, then passes them into the component to test it, like so:

```typescript
it('should show the users in the UI', () => {
  const mockData: IUser[] = [
    {
      id: 'user1',
      firstName: 'Harry',
      lastName: 'Potter',
      isAdmin: false
    },
    ...
  ];

  // ... pass the data into the component and assert that everything is displayed correctly
});
```

Simple enough. Next, let's imagine that we need to write a second test to check that the component renders correctly when presented with admin users.

A naive approach might be to define a second set of mock data, but this time our users will be admins:

```typescript
it('should display a badge next to admin users', () => {
  const mockData: IUser[] = [
    {
      id: 'user1',
      firstName: 'Harry',
      lastName: 'Potter',
      isAdmin: true
    },
    ...
  ];

  // ... pass the data into the component and assert that everything is displayed correctly
});
```

We've only written two simple tests, but we already have problems arising:

1. **Duplication** - Both tests had to define a set of users, even though they are mostly the same. If many items are needed, or the objects are long and complex, this could result in a huge amount of duplicated code and effort.
2. **Lack of clarity** - The mock data for these two tests is almost identical, the only difference is the `isAdmin` property. For someone reading this code, it would take cognitive effort to identify that `isAdmin` is the changing variable here, especially if the objects are larger or more complex.
3. **Hard to maintain** - As our app evolves, the `IUser` object might change. Such changes would potentially mean adjusting large numbers of mock definitions, otherwise they might become stale and inconsistent.

Experienced developers may address these shortcomings by defining the mock data once and using code to manipulate it in the tests. For example:

```typescript
const mockData: IUser[] = [
  ...
];

it('should display a badge next to admin users', () => {
  const testData = mockUsers.map(user => {
    return {
      ...user,
      isAdmin: true
    };
  });
  
  // ... pass the data into the component and assert that everything is displayed correctly
});
```

This avoids many of the problems identified above, but for less-trivial situations, the code may become complex and hard to interpret, especially if the changes are more complex or the properties being adjusted are deeply nested.

Enter Mocklify. 

Mocklify provides a powerful, chained API which allows complex selection, filtering, transformation and projection - all in a way that reads like a sentence. 

The code example below shows how we might achieve the same task with Mocklify, but crucially this can be extended to perform a range of complex transformations as shown in the documentation.

```typescript
const mockData: IUser[] = [
  ...
];

it('should display a badge next to admin users', () => {
  const mockData = mocklify<IUser>()
    .addAll(MOCK_USERS)               // start with the base mocks
    .mutate(
      override({ isAdmin: true }),    // override the isAdmin property for each item
    )
    .getAll();

  // ... pass the data into the component and assert that everything is displayed correctly
});
```

# Pipeline Overview

Mocklify's API allows you to define a pipeline made up of chainable steps.

Generally, this starts with one or more sources of data, applying optional filtering and transformation, and finally returns data.

```
┌──────────────┐              ┌──────────────┐
│  Predefined  │  - and/or -  │Generated Mock│
│ Mock Objects │              │   Objects    │
└──────────────┘              └──────────────┘
        │                             │       
        └──────────────┬──────────────┘       
                       ▼                      
               ┌───────────────┐              
               │    Filters    │              
               └───────────────┘              
                       │                      
                       ▼                      
               ┌───────────────┐              
               │Transformations│              
               └───────────────┘              
                       │                      
                       ▼                      
               ┌───────────────┐              
               │  Terminator   │              
               └───────────────┘              
```

## Data sources

- `add` - adds a specified number of **predefined mock objects** to the data set
- `addAll` - adds all provided **predefined mock objects** to the data set
- `generate` - generates a specific number of new objects using a factory function, and adds them to the data set

## Filters

- `filter` - removes any items from the data set which don't match the provided predicate

## Transformations

- `mutate` - applies a chain of **transformation operators** to the data set. Transform operators apply to all items by default, but can be limited to a specific subset using `transformation scopes`.

## Terminators

- `getAll` - returns all items in the data set
- `get` - returns the specified number of items from the data set
- `getSlice` - returns a subset of items in the data set
- `getFirst` - returns the first item in the data set
- `getLast` - returns the last item in the data set
- `getOne` - returns a single item from the data set that matches a predicate (if multiple items match, the first is returned)
- `getWhere` - returns any items from the data set which match a predicate
- `getRandom` - returns _n_ random items from the data set
- `getShuffled` - returns all items from the data set, shuffled into a random order

# Transformation Operators

The `mutate` pipeline step is the heart of Mocklify. This takes a _chain_ of transformation operators which modify the data in some way.

Mocklify's transformation operators will _automatically_ be immutable (they will never mutate the original input sources). Internally, Mocklify uses [Immer](https://github.com/immerjs/immer) to get immutable state.

The available operators are:

- `omit` - removes specific properties from the data

```typescript
const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .mutate(
    omit(['isAdmin'])
  )
  .getAll();
```

- `override` - takes an object containing a set of properties which should be overriden with a new value

```typescript
const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .mutate(
    override({ isAdmin: true }),
  )
  .getAll();
```

- `modify` - takes a function which can modify the object in any way, for full control. 

```typescript
const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .mutate(
    modify((user, index, allUsers) => {
      user.id = `user_${index}`;
      user.firstName = `${user.firstName} (user ${index + 1} of ${allUsers.length})`;
      user.points *= 2;
    })
  )
  .getAll();
```

The `modify` operator is a real powerhouse and could, in theory, negate the need for the other operators. For example, `modify` can achieve everything that `override` does and more. However, we believe that the other operators bring increased readability for simple use cases.

In addition to the item itself, the `modify` callback also provides the index and full array of items. This can be very helpful for updating values based on the index, or applying changes conditionally.

# Transformation Scopes

By default, transformations apply to _all_ items in the data set.

Sometimes, it may be useful to apply transformations only to certain items in the data set. This is possible by wrapping `transformation operators` in a `scope`, like so:

```typescript
import { mocklify, modify, omit, override, where } from 'mocklify';

const isGryffindor: Limiter<IUser> = user => user.tagIds.includes(MOCK_TAGS.gryffindor.id);
const isSlytherin: Limiter<IUser> = user => user.tagIds.includes(MOCK_TAGS.slytherin.id);
const isHarry: Limiter<IUser> = user => user.firstName === 'Harry' && user.lastName === 'Potter';

const results = mocklify<IUser>()
  .addAll(MOCK_USERS)
  .mutate(
    omit(['isOnline']),
    where(isGryffindor, [
      override({ points: 1000 })
    ]),
    where(isSlytherin, [
      modify(user => user.points = 0)
    ]),
    where(isHarry, [
      override({
        points: 9000,
        isAdmin: true
      })
    ])
  )
  .getAll();
```

The above example:
- omits the `isOnline` property for _all users_
- gives everyone in Gryffindor 1000 points
- removes all points from everyone in Slytherin
- gives Harry 9000 points and sets him as an admin

The `where` scope takes two parameters:
1. A `scope limiter` function which specifies whether or not each item should be affected by the transformations
2. A `chain of transformation operators` to be applied to those items that meet the limiter's condition

This unlocks a lot of power. For inspriation, here are some examples of how we might use scopes and operators for a list of users:
- "Promote all users in a particular group to be admins"
- "Omit the `lastName` property for a random subset of users"
- "Set `isOnline` to true for the first 10 users, and false for the rest"


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
