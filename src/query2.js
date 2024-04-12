import { gql } from "@urql/core";

export const query = gql`
  query ManagedUsers {
    me {
      id
      publicUsername
      managedUsers {
        id
        publicUsername
      }
    }
  }
`;

export const response = {
  data: {
    me: {
      "id": "2",
      "publicUsername": "Alice",
      "managedUsers": [
        {
          "id": "100",
          "publicUsername": "Bob",
          "__typename": "UserType"
        }
      ],
      "__typename": "UserType"
    }
  }
};