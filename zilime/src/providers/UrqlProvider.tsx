import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { SERVER_BASE_URL } from "../constants";

const client = new Client({
  url: `${SERVER_BASE_URL}/api/v1/graphql`,
  exchanges: [cacheExchange, fetchExchange],
});

const UrqlProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider value={client}>{children}</Provider>
);

export default UrqlProvider;
