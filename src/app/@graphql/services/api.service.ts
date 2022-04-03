import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { DocumentNode } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class ApiGraphQLService {

  constructor(private apollo: Apollo) { }

  /**
   * Operation to take data with custom query
   * @param query query info with gql format
   * @param variables info to customize query
   * @param context token, pubsub,...
   * @param cache 
   * @returns 
   */
  protected query(query: DocumentNode, variables: object = {}, context: object = {}, cache: boolean = true) {
    return this.apollo.watchQuery({
      query,
      variables,
      context,
      fetchPolicy: (cache) ? 'network-only' : 'no-cache'
    }).valueChanges.pipe(map((result) => {
      return result.data;
    }));
  }

  protected mutation(mutation: DocumentNode, variables: object = {}, context: object = {}) {
    return this.apollo.mutate({
      mutation,
      variables,
      context
    }).pipe(
      map((result) => {
        return result.data;
      })
    );
  }
  protected subscription(subscription: DocumentNode, variables: object = {}) {
    return this.apollo.subscribe({
      query: subscription,
      variables
    }).pipe(
      map((result) => {
        return result.data;
      })
    );
  }
}