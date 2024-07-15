# Summary

This is the Camplight pair coding task. You and the interviewer are going to work together on it to make it better.

# Setup

1. Create a new `data.json` file with the following contents:

  ```json
  {
    "users": [
      { "id": "1", "name": "Alice" },
      { "id": "2", "name": "Bob" }
    ]
  }
  ```

2. Run `npm i`

3. Run `npm start`

4. Do one of the following requests to test the endpoints

  ```sh
  # Get all users
  curl http://localhost:3000/users

  # Get health check
  curl http://localhost:3000/health

  # Get user by ID
  curl http://localhost:3000/users/1
  ```
