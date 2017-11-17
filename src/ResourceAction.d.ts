import { URLSearchParams } from '@angular/http';
import { Type } from '@angular/core/src/type';
import { ResourceActionBase } from './Interfaces';
import { Resource } from './Resource';
import { ResourceModel } from './ResourceModel';
export declare function ResourceAction(methodOptions?: ResourceActionBase): (target: Resource, propertyKey: string) => void;
export declare function setDataToObject(ret: any, resp: any): any;
export declare function appendSearchParams(search: URLSearchParams, key: string, value: any): void;
export declare function mapToModel(resp: any, model: Type<ResourceModel<Resource>>): any;
