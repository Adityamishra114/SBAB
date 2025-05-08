# API Documentation: `/users` Endpoint

## POST `/api/users`

Creates a new user and sends an OTP to the provided contact number.

### Request Body

Send a JSON object with the following fields:

| Field   | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| name    | string | Yes      | Name of the user          |
| email   | string | No       | Email address of the user |
| contact | string | Yes      | Unique contact number     |

**Example:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "contact": "9876543210"
}
```

### Response

- **201 Created**

  ```
  {
    "message": "User created. OTP sent."
  }
  ```

- **400 Bad Request**

  - If required fields are missing or invalid.

- **409 Conflict**

  - If the contact already exists (handled by Mongoose unique constraint).

### Notes

- The OTP is generated and stored with the user, and is logged to the server console for testing.
- The endpoint expects `Content-Type: application/json` in the request header.

## Status Codes

| Code | Description               |
| ---- | ------------------------- |
| 201  | User created successfully |
| 400  | Invalid input data        |
| 409  | Contact already exists    |

# API Documentation

## 1. GET `/api/users/identity-exist`

**Description:**  
Checks if a user with the given contact number exists.

### Query Parameters

| Parameter | Type   | Required | Description           |
| --------- | ------ | -------- | --------------------- |
| contact   | string | Yes      | User's contact number |

**Example:**  
`/api/users/identity-exist?contact=9876543210`

### Response

- **200 OK**
  ```json
  { "exists": true }
  ```
- **400 Bad Request**
  ```json
  { "error": "Contact number is required." }
  ```
- **500 Internal Server Error**
  ```json
  { "error": "Internal server error." }
  ```

---

## 2. POST `/api/otp`

**Description:**  
Sends a new OTP to the user with the given contact number.

### Request Body

| Field   | Type   | Required | Description           |
| ------- | ------ | -------- | --------------------- |
| contact | string | Yes      | User's contact number |

**Example:**

```json
{ "contact": "9876543210" }
```

### Response

- **200 OK**
  ```json
  { "message": "OTP sent successfully" }
  ```
- **404 Not Found**
  ```json
  { "error": "User not found" }
  ```

---

## 3. POST `/api/otp-verify`

**Description:**  
Verifies the OTP for a given contact number.

### Request Body

| Field   | Type   | Required | Description           |
| ------- | ------ | -------- | --------------------- |
| contact | string | Yes      | User's contact number |
| otp     | string | Yes      | OTP to verify         |

**Example:**

```json
{ "contact": "9876543210", "otp": "123456" }
```

### Response

- **200 OK**
  ```json
  { "success": true, "userId": "USER_OBJECT_ID" }
  ```
- **400 Bad Request**
  ```json
  { "success": false, "message": "Invalid OTP" }
  ```

---

## 4. GET `/api/users/:id`

**Description:**  
Fetches user details by user ID (except OTP).

### URL Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| id        | string | Yes      | User's Object ID |

**Example:**  
`/api/users/609e12a4b5c3a12d4c8e1234`

### Response

- **200 OK**
  ```json
  {
    "_id": "609e12a4b5c3a12d4c8e1234",
    "name": "John Doe",
    "email": "john@example.com",
    "contact": "9876543210",
    "__v": 0
  }
  ```
- **404 Not Found**
  ```json
  { "error": "User not found" }
  ```
- **500 Internal Server Error**
  ```json
  { "error": "Internal server error." }
  ```

## 5. GET `/api/sevas`

**Description:**  
Fetches a list of all available sevas.

### Request

No parameters or body required.

### Response

- **200 OK**
  ```json
  [
    {
      "_id": "609e12a4b5c3a12d4c8e1234",
      "code": "SEVA001",
      "name": "Abhishekam",
      "description": "Special pooja"
      // ...other seva fields
    }
    // ...more sevas
  ]
  ```
- **500 Internal Server Error**
  ```json
  { "message": "Error retrieving sevas", "error": {} }
  ```

---

## 6. GET `/api/sevas/:code`

**Description:**  
Fetches details of a seva by its unique code.

### URL Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| code      | string | Yes      | Seva unique code |

**Example:**  
`/api/sevas/SEVA001`

### Response

- **200 OK**
  ```json
  {
    "_id": "609e12a4b5c3a12d4c8e1234",
    "code": "SEVA001",
    "name": "Abhishekam",
    "description": "Special pooja"
    // ...other seva fields
  }
  ```
- **404 Not Found**
  ```json
  { "message": "Seva not found" }
  ```
- **500 Internal Server Error**

  ```json
  { "message": "Error retrieving the seva", "error": {} }
  ```

  ## 7. GET `/api/address-by-pincode/:pincode`

**Description:**  
Fetches the city and state for a given pincode.

### URL Parameters

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| pincode   | string | Yes      | Pincode to look up |

**Example:**  
`/api/address-by-pincode/560001`

### Response

- **200 OK**
  ```json
  {
    "city": "Bengaluru",
    "state": "Karnataka"
  }
  ```
- **404 Not Found**
  ```json
  { "message": "Address not found for this pincode" }
  ```
- **500 Internal Server Error**
  ```json
  { "message": "Error fetching address by pincode" }
  ```

---

## 8. POST `/api/order`

**Description:**  
Creates a new order for one or more sevas and an address.

### Request Body

| Field   | Type     | Required | Description             |
| ------- | -------- | -------- | ----------------------- |
| items   | string[] | Yes      | Array of seva ObjectIds |
| address | string   | Yes      | Address ObjectId        |

**Example:**

```json
{
  "items": ["609e12a4b5c3a12d4c8e1234", "609e12a4b5c3a12d4c8e5678"],
  "address": "609e12a4b5c3a12d4c8e9999"
}
```

### Response

- **201 Created**
  ```json
  {
    "orderId": 12345,
    "paymentId": 67890,
    "amountToPay": 1500
  }
  ```
- **400 Bad Request**
  - If address is not found:
    ```json
    { "message": "Address not found or invalid" }
    ```
  - If one or more sevas are invalid:
    ```json
    { "message": "One or more Sevas are invalid" }
    ```
- **500 Internal Server Error**
  ```json
  { "message": "Server error" }
  ```

## 9. POST `/api/payment`

**Description:**  
Creates a new payment entry for either Card or UPI method. Validates required fields and saves payment details.

### Request Body

| Field      | Type   | Required | Description                                  |
| ---------- | ------ | -------- | -------------------------------------------- |
| method     | string | Yes      | Payment method: `"card"` or `"upi"`          |
| cardNumber | string | Yes\*    | Card number (required if method is `"card"`) |
| expiry     | string | Yes\*    | Card expiry (required if method is `"card"`) |
| cvv        | string | Yes\*    | Card CVV (required if method is `"card"`)    |
| upiId      | string | Yes\*    | UPI ID (required if method is `"upi"`)       |
| amount     | number | Yes      | Payment amount                               |

\* Required only for the respective payment method.

**Example (Card):**

```json
{
  "method": "card",
  "cardNumber": "4111111111111111",
  "expiry": "12/27",
  "cvv": "123",
  "amount": 1000
}
```

**Example (UPI):**

```json
{
  "method": "upi",
  "upiId": "user@upi",
  "amount": 1000
}
```

### Response

- **201 Created**

  ```json
  {
    "message": "Payment successful",
    "payment": {
      "_id": "663b1e2f8e4b2c0012a12345",
      "method": "upi",
      "upiId": "user@upi",
      "amount": 1000,
      "status": "success",
      "createdAt": "2024-05-08T12:34:56.789Z",
      "updatedAt": "2024-05-08T12:34:56.789Z",
      "__v": 0
    }
  }
  ```

- **400 Bad Request**

  - If required fields are missing or invalid:
    ```json
    { "message": "Payment method and amount required" }
    ```
    ```json
    { "message": "Card details required" }
    ```
    ```json
    { "message": "Valid UPI ID required" }
    ```
    ```json
    { "message": "Invalid payment method" }
    ```

- **500 Internal Server Error**
  ```json
  { "success": false, "statusCode": 500, "message": "Internal Server Error" }
  ```
