var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { RequestMethod } from '@angular/http';
import { Resource } from './Resource';
import { ResourceAction } from './ResourceAction';
export var ResourceCRUDBase = (function (_super) {
    __extends(ResourceCRUDBase, _super);
    function ResourceCRUDBase() {
        _super.apply(this, arguments);
    }
    // Alias to save
    ResourceCRUDBase.prototype.create = function (data, callback) {
        return this.save(data, callback);
    };
    __decorate([
        ResourceAction({
            isArray: true
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "query", void 0);
    __decorate([
        ResourceAction(), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "get", void 0);
    __decorate([
        ResourceAction({
            method: RequestMethod.Post
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "save", void 0);
    __decorate([
        ResourceAction({
            method: RequestMethod.Put
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "update", void 0);
    __decorate([
        ResourceAction({
            method: RequestMethod.Delete
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "remove", void 0);
    return ResourceCRUDBase;
}(Resource));
