import { gql } from "@urql/core";

export const query = gql`
  query Me {
    me {
      id
      publicUsername
    }
  }
`;

export const response = {
  data: {
    me: {
      "id": "1",
      "publicUsername": "John",
      "__typename": "UserType"
    }
  }
};