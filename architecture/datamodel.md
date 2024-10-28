# Database Schema

## Users Table

| Column Name     | Type      | Nullable | Attributes                 |
|-----------------|-----------|----------|----------------------------|
| user_id         | UUID      | No       | Primary Key                |
| password_hash   | VARCHAR   | No       |                            |
| email           | VARCHAR   | No       | Unique                     |
| first_name      | VARCHAR   | No       |                            |
| last_name       | VARCHAR   | No       |                            |
| middle_name     | VARCHAR   | Yes      |                            |
| avatar          | TEXT      | Yes      |                            |
| phone           | VARCHAR   | Yes      | Unique                     |

## Accounts Table

| Column Name | Type          | Nullable | Attributes                     |
|-------------|---------------|----------|--------------------------------|
| account_id  | UUID          | No       | Primary Key                    |
| user_id     | UUID          | No       | Foreign Key to `users.user_id` |
| balance     | DECIMAL(12,2) | No       | Default: 0                     |
| currency    | ENUM          | No       | ('CAD', 'USD'), Default: 'CAD' |

## Transactions Table

| Column Name    | Type          | Nullable | Attributes                             |
|----------------|---------------|----------|----------------------------------------|
| transaction_id | UUID          | No       | Primary Key                            |
| account_id     | UUID          | No       | Foreign Key to `accounts.account_id`   |
| user_id        | UUID          | No       | Foreign Key to `users.user_id`         |
| amount         | DECIMAL(12,2) | No       |                                        |
| description    | TEXT          | Yes      |                                        |
| date           | TIMESTAMP     | No       | Default: CURRENT_TIMESTAMP             |
| category       | VARCHAR       | No       |                                        |
| merchant_id    | UUID          | Yes      | Foreign Key to `merchants.merchant_id` |
| receipt        | TEXT          | Yes      |                                        |

## Merchants Table

| Column Name     | Type      | Nullable | Attributes                 |
|-----------------|-----------|----------|----------------------------|
| merchant_id     | UUID      | No       | Primary Key                |
| name            | VARCHAR   | No       |                            |
| logo            | TEXT      | Yes      |                            |
| mcc             | INTEGER   | Yes      |                            |

## Splits Table

| Column Name      | Type          | Nullable | Attributes                                               |
|------------------|---------------|----------|----------------------------------------------------------|
| split_id         | UUID          | No       | Primary Key                                              |
| transaction_id   | UUID          | No       | Foreign Key to `transactions.transaction_id`             |
| transaction_name | VARCHAR       | No       |                                                          |
| transaction_logo | TEXT          | Yes      |                                                          |
| transaction_date | TIMESTAMP     | No       |                                                          |
| receipt          | TEXT          | Yes      |                                                          |
| amount           | DECIMAL(12,2) | No       |                                                          |
| from_user_id     | UUID          | No       | Foreign Key to `users.user_id`                           |
| status           | ENUM          | No       | ('Pending', 'Completed', 'Canceled'), Default: 'Pending' |

## Split Parts Table

| Column Name | Type          | Nullable | Attributes                                                          |
|-------------|---------------|----------|---------------------------------------------------------------------|
| part_id     | UUID          | No       | Primary Key                                                         |
| user_id     | UUID          | No       | Foreign Key to `users.user_id`                                      |
| split_id    | UUID          | No       | Foreign Key to `splits.split_id`                                    |
| amount      | DECIMAL(12,2) | No       |                                                                     |
| status      | ENUM          | No       | ('Accepted', 'Declined', 'Pending', 'Canceled'), Default: 'Pending' |
| comment     | TEXT          | Yes      |                                                                     |

## Friends Table

| Column Name    | Type | Nullable | Attributes                     |
|----------------|------|----------|--------------------------------|
| user_id        | UUID | No       | Foreign Key to `users.user_id` |
| friend_user_id | UUID | No       | Foreign Key to `users.user_id` |
| Primary Key    | -    | -        | (`user_id`, `friend_user_id`)  |
