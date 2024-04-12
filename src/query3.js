import { gql } from "@urql/core";

export const query = gql`
  query MyItems {
    me {
      id
      status: Status
      items {
        id
      }
    }
  }
`;

export const response = {
  data: {
    me: {
      "id": "1",
      "status": "OK",
      "items": [
        {
          "id": "1",
          "__typename": "ItemType"
        },
      ],
      "__typename": "UserType"
    }
  }
};