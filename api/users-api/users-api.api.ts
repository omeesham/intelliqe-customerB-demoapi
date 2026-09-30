import type { APIResponse } from '@playwright/test';
import { BaseApi } from '../base.api';

/**
 * UsersApi — service object for the "users-api" endpoints.
 *
 * One method per distinct request. Specs call these methods and assert on the
 * response; the URL, headers and payload live here and nowhere else.
 */
export class UsersApi extends BaseApi {
  /** GET https://jsonplaceholder.typicode.com/users/1 */
  async verifyGETUsers1Returns200WithANonEmptyJSON(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/99999999 */
  async return404ForGETUsers99999999WhenTheUserId(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/99999999", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/abc */
  async returnA4xxForGETUsersAbcWhenANonNumericIdIs(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/abc", {
      headers: {"Accept":"application/json"},
    });
  }

  /** POST https://jsonplaceholder.typicode.com/users/1 */
  async returnA404ForPOSTUsers1WhenUsingTheWrongHTTP(): Promise<APIResponse> {
    return this.send("POST", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** PATCH https://jsonplaceholder.typicode.com/users/1 */
  async returnA4xxForDELETEMismatchedMethodGETOnly(): Promise<APIResponse> {
    return this.send("PATCH", "https://jsonplaceholder.typicode.com/users/1", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/1?foo=bar */
  async confirmGETUsers1IgnoresAnUnknownQuery(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1?foo=bar", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/1/ */
  async confirmGETUsers1WithATrailingSlashDoesNot(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1/", {
      headers: {"Accept":"application/json"},
    });
  }

  /** GET https://jsonplaceholder.typicode.com/users/1%27%20OR%20%271%27%3D%271 */
  async confirmGETUsers1ReturnsAClean4xxAndNoEchoFor(): Promise<APIResponse> {
    return this.send("GET", "https://jsonplaceholder.typicode.com/users/1%27%20OR%20%271%27%3D%271", {
      headers: {"Accept":"application/json"},
    });
  }
}
