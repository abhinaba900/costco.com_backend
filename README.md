# API Documentation

## Overview

This documentation provides a comprehensive overview of the endpoints available in the API, including methods for user management, product browsing, and cart management. It's designed to help developers understand how to interact with the API effectively.

## Authentication

Authentication is required for certain endpoints. The API uses JWT for authentication, expecting `authToken` and `refreshToken` tokens to be provided in request cookies.

## Base URL

The API is served at `http://localhost:<PORT>`. Replace `<PORT>` with the actual port number where your server is running.

## Endpoints

### User Management

#### Register User

- **Endpoint:** `/user/register`
- **Method:** POST
- **Body Parameters:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
- **Success Response:** HTTP 201 Created
- **Error Response:** HTTP 422 Unprocessable Entity, HTTP 409 Conflict, HTTP 500 Internal Server Error

#### Login

- **Endpoint:** `/user/login`
- **Method:** POST
- **Body Parameters:**
  - `email`: String (required)
  - `password`: String (required)
- **Success Response:** HTTP 200 OK
- **Error Response:** HTTP 400 Bad Request, HTTP 401 Unauthorized, HTTP 500 Internal Server Error

### Product Management

#### Get All Products

- **Endpoint:** `/products`
- **Method:** GET
- **Query Parameters:**
  - `sort`: String (optional)
  - `search`: String (optional)
- **Success Response:** HTTP 200 OK
- **Error Response:** HTTP 500 Internal Server Error

#### Get Product by ID

- **Endpoint:** `/products/:id`
- **Method:** GET
- **URL Parameters:**
  - `id`: ID of the product
- **Success Response:** HTTP 200 OK
- **Error Response:** HTTP 404 Not Found, HTTP 400 Bad Request, HTTP 500 Internal Server Error

### Cart Management

#### Add Product to Cart

- **Endpoint:** `/cart/:id`
- **Method:** POST
- **URL Parameters:**
  - `id`: ID of the product
- **Body Parameters:**
  - `userId`: String (required)
- **Success Response:** HTTP 200 OK
- **Error Response:** HTTP 404 Not Found, HTTP 500 Internal Server Error

#### Get Cart Items

- **Endpoint:** `/cart`
- **Method:** GET
- **Body Parameters:**
  - `userId`: String (required)
- **Success Response:** HTTP 200 OK
- **Error Response:** HTTP 500 Internal Server Error

#### Delete Cart Item

- **Endpoint:** `/cart/:id`
- **Method:** DELETE
- **URL Parameters:**
  - `id`: ID of the product
- **Body Parameters:**
  - `userId`: String (required)
- **Success Response:** HTTP 200 OK
- **Error Response:** HTTP 404 Not Found, HTTP 500 Internal Server Error

## Error Handling

The API uses standard HTTP response codes to indicate the outcome of requests:
- `2xx` codes indicate success.
- `4xx` codes indicate an error that failed due to the information provided (e.g., a required parameter was missing).
- `5xx` codes indicate an error with the server.

Please ensure all requests are made with valid parameters and within the constraints of the API to avoid errors.
