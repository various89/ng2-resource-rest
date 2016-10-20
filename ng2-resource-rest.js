var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ResourceProviders } from './src/ResourceProviders';
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
export var ResourceModule = (function () {
    function ResourceModule() {
    }
    ResourceModule.forRoot = function () {
        return {
            ngModule: ResourceModule,
            providers: ResourceProviders.providers[ResourceProviders.mainProvidersName]
        };
    };
    ResourceModule.forChild = function (subSet) {
        return {
            ngModule: ResourceModule,
            providers: ResourceProviders.providers[subSet] ? ResourceProviders.providers[subSet] : []
        };
    };
    ResourceModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                HttpModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ResourceModule);
    return ResourceModule;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXJlc291cmNlLXJlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItcmVzb3VyY2UtcmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLFFBQVEsRUFBc0IsTUFBTSxlQUFlO09BQ3BELEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCO09BQ3JDLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUNqQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0seUJBQXlCO0FBQ3pELFNBQVMsT0FBTyxFQUFFLGdCQUFnQixRQUFRLGNBQWMsQ0FBQztBQUN6RCxTQUFTLFVBQVUsUUFBUSxpQkFBaUIsQ0FBQztPQUN0Qyx1QkFBdUI7T0FDdkIsNEJBQTRCO09BQzVCLDZCQUE2QjtPQUM3QixvQ0FBb0M7T0FDcEMsd0NBQXdDO09BQ3hDLDZCQUE2QjtPQUM3QiwyQkFBMkI7QUFFbEMsY0FBYyxrQkFBa0IsQ0FBQztBQUNqQyxjQUFjLGdCQUFnQixDQUFDO0FBQy9CLGNBQWMsc0JBQXNCLENBQUM7QUFDckMsY0FBYyxvQkFBb0IsQ0FBQztBQUNuQyxjQUFjLHdCQUF3QixDQUFDO0FBQ3ZDLGNBQWMsNEJBQTRCLENBQUM7QUFDM0MsY0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxjQUFjLHNCQUFzQixDQUFDO0FBQ3JDLGNBQWMseUJBQXlCLENBQUM7QUFReEM7SUFBQTtJQWVBLENBQUM7SUFkUSxzQkFBTyxHQUFkO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGNBQWM7WUFDeEIsU0FBUyxFQUFFLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztTQUM1RSxDQUFDO0lBQ0osQ0FBQztJQUVNLHVCQUFRLEdBQWYsVUFBZ0IsTUFBYztRQUM1QixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1NBQzFGLENBQUM7SUFDSixDQUFDO0lBbkJIO1FBQUMsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLFlBQVk7Z0JBQ1osVUFBVTthQUNYO1NBQ0YsQ0FBQzs7c0JBQUE7SUFnQkYscUJBQUM7QUFBRCxDQUFDLEFBZkQsSUFlQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHtSZXNvdXJjZVByb3ZpZGVyc30gZnJvbSAnLi9zcmMvUmVzb3VyY2VQcm92aWRlcnMnO1xuZXhwb3J0IHsgU3ViamVjdCwgQW5vbnltb3VzU3ViamVjdCB9IGZyb20gJ3J4anMvU3ViamVjdCc7XG5leHBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWVyZ2VNYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9zd2l0Y2hNYXAnO1xuaW1wb3J0ICdyeGpzL29wZXJhdG9yL2Rpc3RpbmN0VW50aWxDaGFuZ2VkJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZGlzdGluY3RVbnRpbENoYW5nZWQnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9wdWJsaXNoJztcblxuZXhwb3J0ICogZnJvbSAnLi9zcmMvSW50ZXJmYWNlcyc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZUFjdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZUNSVUQnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvUmVzb3VyY2VDUlVEQmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZUdsb2JhbENvbmZpZyc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZU1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlUGFyYW1zJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlUHJvdmlkZXJzJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBIdHRwTW9kdWxlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFJlc291cmNlTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBSZXNvdXJjZVByb3ZpZGVycy5wcm92aWRlcnNbUmVzb3VyY2VQcm92aWRlcnMubWFpblByb3ZpZGVyc05hbWVdXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmb3JDaGlsZChzdWJTZXQ6IHN0cmluZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVzb3VyY2VNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFJlc291cmNlUHJvdmlkZXJzLnByb3ZpZGVyc1tzdWJTZXRdID8gUmVzb3VyY2VQcm92aWRlcnMucHJvdmlkZXJzW3N1YlNldF0gOiBbXVxuICAgIH07XG4gIH1cblxufVxuIl19