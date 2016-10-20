import { ModuleWithProviders } from '@angular/core';
export { Subject, AnonymousSubject } from 'rxjs/Subject';
export { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/publish';
export * from './src/Interfaces';
export * from './src/Resource';
export * from './src/ResourceAction';
export * from './src/ResourceCRUD';
export * from './src/ResourceCRUDBase';
export * from './src/ResourceGlobalConfig';
export * from './src/ResourceModel';
export * from './src/ResourceParams';
export * from './src/ResourceProviders';
export declare class ResourceModule {
    static forRoot(): ModuleWithProviders;
    static forChild(subSet: string): ModuleWithProviders;
}
