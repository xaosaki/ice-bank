# Auth Endpoints

## Registration
- **Method**: `POST`
- **URL**: `/auth/register`
- **Request Body**:
  ```json
  {
    "password": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string (optional)",
    "phone": "string (optional)"
  }
  ```
- **Response**: 
  ```json
  {
    "userId": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string (or null)",
    "avatar": "string (or null)",
    "phone": "string (or null)"
  }
  ```
- **Note**: `bcrypt` password hashing

## Login
- **Method**: `POST`
- **URL**: `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "userId": "string",
    "accessToken": "string"
  }
  ```

## Logout
- **Method**: `POST`
- **URL**: `/auth/logout`
- **Response**: Success message

# Profile Endpoints

## Get Profile
- **Method**: `GET`
- **URL**: `/profile`
- **Response**:
  ```json
  {
    "userId": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string (or null)",
    "avatar": "string (or null)",
    "phone": "string (or null)"
  }
  ```

## Update Avatar
- **Method**: `POST`
- **URL**: `/profile/avatar`
- **Request Body**: File upload (avatar image)
- **Response**: Success message
- **Note**: Upload file and update `user.avatar` field, check file type: only images

# Friends Endpoints

## Get Friends
- **Method**: `GET`
- **URL**: `/friends`
- **Response**: List of friends
  ```json
  [
    {
      "userId": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string (or null)",
      "avatar": "string (or null)",
      "phone": "string (or null)"
    }
  ]
  ```

## Add Friend
- **Method**: `POST`
- **URL**: `/friends/{userId}`
- **Response**: Success message

## Remove Friend
- **Method**: `DELETE`
- **URL**: `/friends/{userId}`
- **Response**: Success message


# Accounts Endpoints

## Get Accounts
- **Method**: `GET`
- **URL**: `/accounts`
- **Response**: List of accounts
  ```json
  [
    {
      "accountId": "string",
      "balance": "number",
      "currency": "enum(CAD, USD)"
    }
  ]
  ```

## Get Transactions for Account 
- **Method**: `GET`
- **URL**: `/accounts/{accountId}/transactions`
- **Response**: List of transactions
  ```json
  [
    {
      "transactionId": "string",
      "accountId": "string",
      "amount": "number",
      "description": "string",
      "date": "string",
      "category": "string",
      "merchant": {
        "name": "string",
        "logo": "string"
      }
    }
  ]
  ```
- **Note**: Check that `accountId` owner is current user

# Transactions Endpoints

## Create Transaction
- **Method**: `POST`
- **URL**: `/transactions`
- **Request Body**:
  ```json
  {
    "accountId": "string",
    "amount": "number",
    "description": "string",
    "category": "string",
    "merchant": {
      "id": "string (optional)",
      "name": "string",
      "logo": "string (optional)",
      "mcc": "string (optional)"
    },
    "note": "string"
  }
  ```
- **Response**: Created transaction details
- **Note**: Check that `accountId` owner is current user
- **Note**: If `merchant.id` is not provided or not found, the system will create a new merchant based on the provided `name`, `logo`, and `mcc`.


## Get Transaction by ID
- **Method**: `GET`
- **URL**: `/transactions/{transactionId}`
- **Response**:
  ```json
  {
    "transactionId": "string",
    "accountId": "string",
    "amount": "number",
    "description": "string",
    "date": "string",
    "category": "string",
    "merchant": {
      "name": "string",
      "logo": "string",
      "id": "string",
      "mcc": "string"
    },
    "note": "string",
    "receipt": "string (URL or path)"
  }
  ```
- **Note**: Check that `accountId` owner is current user

## Add Receipt by TransactionID
- **Method**: `POST`
- **URL**: `/transactions/{transactionId}/receipt`
- **Request Body**: File upload (receipt image)
- **Response**: Success message
- **Note**: Check that transaction owner is current user, check file type: only images

## Remove Receipt by TransactionID
- **Method**: `DELETE`
- **URL**: `/transactions/{transactionId}/receipt`
- **Response**: Success message
- **Note**: Check that transaction owner is current user

# Split Endpoints

## Outgoing Splits

### Create
- **Method**: `POST`
- **URL**: `/splits/outgoing`
- **Request Body**:
  ```json
  {
    "transactionId": "string",
    "receipt": "string",
    "amount": "number",
    "users": [
      {
        "userId": "string",
        "amount": "number"
      }
    ]
  }
  ```
- **Response**: 
  ```json
  {
      "splitId": "string",
      "receipt": "string",
      "amount": "number",
      "status": "Pending",
      "transactionId": "string",
      "transactionName": "string",
      "transactionDate": "string",
      "transactionLogo": "string",
      "fromUserId": "string",
      "users": [
        {
          "userId": "string",
          "amount": "number"
        }
      ]
    }
  ```
- **Note**: Check that transaction owner is current user

### Cancel by ID
- **Method**: `DELETE`
- **URL**: `/splits/outgoing/{splitId}`
- **Response**: Success message
- **Note**: Check that split `from_user_id` is current user
- **Note**: Also change status for all parts from `Pending` to `Canceled` 

### List + Filter by Transaction
- **Method**: `GET`
- **URL**: `/splits/outgoing`
- **Query Parameters**: `transactionId`
- **Response**: List of outgoing splits
  ```json
  [
    {
      "splitId": "string",
      "receipt": "string",
      "amount": "number",
      "status": "enum(Pending, Completed, Canceled)",
      "transactionId": "string",
      "transactionName": "string",
      "transactionDate": "string",
      "transactionLogo": "string",
      "fromUserId": "string",
      "users": [
        {
          "userId": "string",
          "amount": "number"
        }
      ]
    }
  ]
  ```
- **Note**: Check that split `from_user_id` is current user

### Details by ID
- **Method**: `GET`
- **URL**: `/splits/outgoing/{splitId}`
- **Response**: Split details
  ```json
  {
    "splitId": "string",
    "receipt": "string",
    "amount": "number",
    "status": "enum(Pending, Completed, Canceled)",
    "transactionId": "string",
    "transactionName": "string",
    "transactionDate": "string",
    "transactionLogo": "string",
    "fromUserId": "string",
    "users": [
      {
        "userId": "string",
        "amount": "number"
      }
    ]
  }
  ```
- **Note**: Check that split `from_user_id` is current user

## Incoming Splits

### List
- **Method**: `GET`
- **URL**: `/splits/incoming`
- **Response**: List of incoming splits
  ```json
  [
    {
      "splitId": "string",
      "transactionName": "string",
      "transactionLogo": "string",
      "transactionDate": "string",
      "amountForPay": "number",
      "fromUser": {
        "userId": "string",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string (or null)",
        "avatar": "string (or null)",
        "phone": "string (or null)"
      },
      "receipt": "string",
      "answerStatus": "enum('Accepted', 'Declined', 'Pending', 'Canceled')",
      "splitStatus": "enum(Pending, Completed, Canceled)"
    }
  ]
  ```
- **Note**: Check that split `users` contains current user

### Details by ID
- **Method**: `GET`
- **URL**: `/splits/incoming/{splitId}`
- **Response**: Split details
  ```json
  {
    "splitId": "string",
    "transactionName": "string",
    "transactionLogo": "string",
    "transactionDate": "string",
    "amountForPay": "number",
    "fromUser": {
      "userId": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string (or null)",
      "avatar": "string (or null)",
      "phone": "string (or null)"
    },
    "transactionId": "string",
    "receipt": "string",
    "comment": "string (or null)",
    "answerStatus": "enum('Accepted', 'Declined', 'Pending', 'Canceled')",
    "splitStatus": "enum(Pending, Completed, Canceled)"
  }
  ```
- **Note**: Check that split `users` contains current user

### Process by ID
- **Method**: `POST`
- **URL**: `/splits/incoming/{splitId}/process`
- **Request Body**:
  ```json
  {
    "action": "accept/decline",
    "comment": "string (or null)"
  }
  ```
- **Response**: Success message
- **Note**: Check that split `users` contains current user
- **Note**: Move split to `Completed` if there is no pending parts
