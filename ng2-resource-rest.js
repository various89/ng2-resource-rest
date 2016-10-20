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
import './rxjs.operators';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXJlc291cmNlLXJlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItcmVzb3VyY2UtcmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLFFBQVEsRUFBc0IsTUFBTSxlQUFlO09BQ3BELEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCO09BQ3JDLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUNqQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0seUJBQXlCO09BQ2xELGtCQUFrQjtBQUV6QixjQUFjLGtCQUFrQixDQUFDO0FBQ2pDLGNBQWMsZ0JBQWdCLENBQUM7QUFDL0IsY0FBYyxzQkFBc0IsQ0FBQztBQUNyQyxjQUFjLG9CQUFvQixDQUFDO0FBQ25DLGNBQWMsd0JBQXdCLENBQUM7QUFDdkMsY0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxjQUFjLHFCQUFxQixDQUFDO0FBQ3BDLGNBQWMsc0JBQXNCLENBQUM7QUFDckMsY0FBYyx5QkFBeUIsQ0FBQztBQVF4QztJQUFBO0lBZUEsQ0FBQztJQWRRLHNCQUFPLEdBQWQ7UUFDRSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDO1NBQzVFLENBQUM7SUFDSixDQUFDO0lBRU0sdUJBQVEsR0FBZixVQUFnQixNQUFjO1FBQzVCLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7U0FDMUYsQ0FBQztJQUNKLENBQUM7SUFuQkg7UUFBQyxRQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsWUFBWTtnQkFDWixVQUFVO2FBQ1g7U0FDRixDQUFDOztzQkFBQTtJQWdCRixxQkFBQztBQUFELENBQUMsQUFmRCxJQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SHR0cE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQge1Jlc291cmNlUHJvdmlkZXJzfSBmcm9tICcuL3NyYy9SZXNvdXJjZVByb3ZpZGVycyc7XG5pbXBvcnQgJy4vcnhqcy5vcGVyYXRvcnMnO1xuXG5leHBvcnQgKiBmcm9tICcuL3NyYy9JbnRlcmZhY2VzJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlQWN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlQ1JVRCc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZUNSVURCYXNlJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlR2xvYmFsQ29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlTW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvUmVzb3VyY2VQYXJhbXMnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvUmVzb3VyY2VQcm92aWRlcnMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEh0dHBNb2R1bGVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVzb3VyY2VNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFJlc291cmNlUHJvdmlkZXJzLnByb3ZpZGVyc1tSZXNvdXJjZVByb3ZpZGVycy5tYWluUHJvdmlkZXJzTmFtZV1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZvckNoaWxkKHN1YlNldDogc3RyaW5nKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBSZXNvdXJjZU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogUmVzb3VyY2VQcm92aWRlcnMucHJvdmlkZXJzW3N1YlNldF0gPyBSZXNvdXJjZVByb3ZpZGVycy5wcm92aWRlcnNbc3ViU2V0XSA6IFtdXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=