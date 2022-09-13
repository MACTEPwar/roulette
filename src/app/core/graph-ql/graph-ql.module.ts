import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  ApolloClientOptions, InMemoryCache, split
} from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const uri = 'https://valued-rhino-85.hasura.app/v1/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // Create an http link:
  const http = httpLink.create({
    uri,
    headers: getHeaders()
  });

  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: `ws://valued-rhino-85.hasura.app/v1/graphql`,
    options: {
      reconnect: true,
    },
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const s = getMainDefinition(query);
      return s.kind === 'OperationDefinition' && s.operation === 'subscription';
    },
    ws,
    http
  );

  return {
    link: http,
    cache: new InMemoryCache(),
  };
}

export function getHeaders(): HttpHeaders {
  let headers = new HttpHeaders();
  headers = headers.append(
    'x-hasura-admin-secret',
    'sxy14YqatWgISVnWm6ujuJeRKODP2XhCjpUZelo0Dg22oVqd0Wn1CQnOc5AGhJeI'
  );
  headers = headers.append('content-type', 'application/json');

  return headers;
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
