import { Inject, Injectable } from '@angular/core';
import { Client } from '../entities/client';
import { HttpClient } from '@angular/common/http';
import { TOTS_CORE_PROVIDER, TotsBaseHttpService, TotsCoreConfig } from '@tots/core';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { NewClient, RegisterResponse, ReponseDeleteClient, ReponseListClient } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends TotsBaseHttpService<Client> {
  base_url: string;

  constructor(
    @Inject(TOTS_CORE_PROVIDER) protected override config: TotsCoreConfig,
    protected override http: HttpClient,
  ) {
    super(config, http);
    this.base_url = environment.baseUrl
  }


  getList(): Observable<any> {
    const url = this.base_url + '/client/list';
    return this.http.post<ReponseListClient>(url, {});
  }

  createClient(object: NewClient): Observable<any> {
    const url = this.base_url + '/client/save';
    return this.http.post<RegisterResponse>(url, object);
  }

  deleteClient(id: number): Observable<any> {
    const url = this.base_url + `/client/remove/${id}`;
    return this.http.delete<ReponseDeleteClient>(url);
  }

}
