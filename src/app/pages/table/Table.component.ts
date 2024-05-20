import {
  Component,
  Input,
  ViewChild,
  inject,
  type OnInit,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, delay, of, tap } from 'rxjs';
import { NewClient } from 'src/app/interfaces';
import { ClientService } from 'src/app/services/client.service';
import { RemoveClientModalComponent } from 'src/app/components/remove-client-modal/remove-client-modal.component';
import { MoreMenuColumnComponent, StringColumnComponent, TotsActionTable, TotsColumn, TotsTableComponent, TotsTableConfig } from '@tots/table';
import { StringFieldComponent, SubmitButtonFieldComponent, TotsFormModalService, TotsModalConfig } from '@tots/form';
import { TotsListResponse } from '@tots/core';

@Component({
  selector: 'app-table',
  templateUrl: './Table.component.html',
  styleUrls: ['./Table.component.scss'],
})
export class TableComponent implements OnInit {
  
  private clientService = inject(ClientService);
  
  @ViewChild('tableComp') tableComp!: TotsTableComponent;
  config = new TotsTableConfig();
  items: NewClient[] = [];
  formGroup = new FormGroup({});


  constructor(
    protected modalService: TotsFormModalService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTableList();
  }

  onOrder(column: TotsColumn) {
    const response = new TotsListResponse();

    if (column.order == 'asc') {
      response.data = this.items.sort((a, b) =>
        a.firstname > b.firstname ? 1 : b.firstname > a.firstname ? -1 : 0
      );
    } else {
      response.data = this.items.sort((a, b) =>
        a.firstname < b.firstname ? 1 : b.firstname < a.firstname ? -1 : 0
      );
    }
    this.items = [...this.items];

    this.config.obs = of(response).pipe(delay(1000));
    this.tableComp.loadItems();
  }

  onTableAction(action: TotsActionTable) {
    switch (action.key) {
      case 'remove':
        this.deleteListClient(action.item)
        break;
      case 'edit':
        this.openFormModal(action.item);
        break;
      case 'click-order':
        this.onOrder(action.item);
        break;
      default:
        break;
    }
  }

  tableTestConfig() {
    this.config.id = 'table-example';
    this.config.columns = [
      {
        key: 'title',
        component: StringColumnComponent,
        title: 'Firstname',
        field_key: 'firstname',
        hasOrder: true,
        extra: { cutSeparator: ',' },
      },
      {
        key: 'subtitle',
        component: StringColumnComponent,
        title: 'Lastname',
        field_key: 'lastname',
        hasOrder: false,
        extra: { field_subtitle_key: 'subtitle' },
      },
      {
        key: 'include',
        component: StringColumnComponent,
        title: 'Email',
        field_key: 'email',
        hasOrder: false,
      },
      {
        key: 'more',
        component: MoreMenuColumnComponent,
        title: '',
        extra: {
          stickyEnd: true,
          width: '60px',
          actions: [
            { icon: 'add', title: 'Editar', key: 'edit' },
            { icon: 'add', title: 'Eliminar', key: 'remove' },
          ],
        },
      },
    ];

    const data = new TotsListResponse();
    data.data = this.items;
    this.config.obs = of(data).pipe(delay(1000));
  }

  openFormModal(editItem?: any) {
    let config = new TotsModalConfig();

    if (editItem) {
      config.title = 'Edit Client';
    } else {
      config.title = 'New Client';
    }

    config.autoSave = true;

    config.item = editItem ? editItem : {};

    config.fields = [
      {
        key: 'firstname',
        component: StringFieldComponent,
        label: 'First Name',
        validators: [
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      },
      {
        key: 'lastname',
        component: StringFieldComponent,
        label: 'Last Name',
        validators: [
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      },
      {
        key: 'email',
        component: StringFieldComponent,
        label: 'Email',
        validators: [
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      },
      { key: 'submit', component: SubmitButtonFieldComponent, label: 'Enviar' },
    ];

    this.modalService
      .open(config)
      .pipe(
        tap((action) => {
          if (action.key === 'submit') {
            action.modal?.componentInstance.showLoading();
          }
        }),
      )
      .pipe(delay(2000))
      .pipe(tap((action) => action.modal?.componentInstance.hideLoading()))
      .subscribe((action) => {
        console.log(action)
        if (action.key === 'submit') {
          
          if (!editItem) {
            console.log(editItem);
            this.newClient(action);
          } else {
            this.updateClient(action.item);
          }
          action.modal?.close();
        }
      });
  }

  private getTableList() {
    this.clientService.getList().subscribe({
      next: (clients) => {
        this.items = clients.response.data;
        this.tableTestConfig();
      },
      error: (err: any) => {
        console.error('API Error:', err);
      },
    });
  }

  newClient(action: any) {
    const obj: NewClient = {
      email: action?.item?.email,
      firstname: action?.item?.firstname,
      lastname: action?.item?.lastname,
    };

    this.clientService.createClient(obj).subscribe({
      next: (newClient) => {
        this.items = [
          ...this.items,
          {
            id: newClient.response.id,
            firstname: newClient.response.firstname,
            lastname: newClient.response.lastname,
            email: newClient.response.email,
          } as NewClient,
        ];

        const data = new TotsListResponse();
        data.data = this.items;

        data.data = this.items.sort((a, b) =>
          !!a.id && !!b.id ? (a.id < b.id ? 1 : b.id < a.id ? -1 : 0) : 1
        );
        this.config.obs = of(data);
        this.tableComp?.loadItems();
      },
      error: (err: any) => {
        console.error('API Error:', err);
      },
    });
  }

  deleteListClient(item: any): void {
    const dialogRef = this.dialog.open(RemoveClientModalComponent, {
      panelClass: 'remove-modal',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clientService.deleteClient(item.id).subscribe({
          next: () => {
            this.items = this.items.filter((i) => i.id != item.id);
            const data = new TotsListResponse();
            data.data = this.items;
            this.config.obs = of(data);
            this.tableComp?.loadItems();
          },
          error: (err: any) => {
            console.error('API Error:', err);
          },
        });
      }
    });
  }

  updateClient(object: NewClient) {
    this.clientService.createClient(object)
    .subscribe({
      next: (newClient) => {
        this.items = [
          ...this.items,
          {
            id: newClient.response.id,
            firstname: newClient.response.firstname,
            lastname: newClient.response.lastname,
            email: newClient.response.email,
          } as NewClient,
        ];
        this.tableComp?.loadItems();
      },
      error: (err: any) => {
        console.error('API Error:', err);
      },
    });
  }
}
