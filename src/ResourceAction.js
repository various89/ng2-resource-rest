import { RequestMethod, Headers, URLSearchParams, RequestOptions, Request } from '@angular/http';
import { ReflectiveInjector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
export function ResourceAction(methodOptions) {
    methodOptions = methodOptions || {};
    if (methodOptions.method === undefined) {
        methodOptions.method = RequestMethod.Get;
    }
    return function (target, propertyKey) {
        target[propertyKey] = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var resourceOptions = this._getResourceOptions();
            var isGetRequest = methodOptions.method === RequestMethod.Get;
            var ret;
            var resourceModel = methodOptions.model || this.constructor['model'];
            if (resourceModel && !methodOptions.isArray) {
                ret = resourceModel.create({}, false);
            }
            else if (methodOptions.isLazy) {
                ret = {};
            }
            else {
                ret = methodOptions.isArray ? [] : {};
            }
            var mainDeferredSubscriber = null;
            var mainObservable = null;
            ret.$resolved = false;
            ret.$observable = Observable.create(function (subscriber) {
                mainDeferredSubscriber = subscriber;
            }).flatMap(function () { return mainObservable; });
            ret.$abortRequest = function () {
                ret.$resolved = true;
            };
            function releaseMainDeferredSubscriber() {
                mainDeferredSubscriber.next();
                mainDeferredSubscriber.complete();
                mainDeferredSubscriber = null;
            }
            if (!methodOptions.isLazy) {
                ret.$observable = ret.$observable.publish();
                ret.$observable.connect();
            }
            Promise.all([
                Promise.resolve(methodOptions.url || this.getUrl()),
                Promise.resolve(methodOptions.path || this.getPath()),
                Promise.resolve(methodOptions.headers || this.getHeaders()),
                Promise.resolve(methodOptions.params || this.getParams()),
                Promise.resolve(methodOptions.data || this.getData())
            ])
                .then(function (dataAll) {
                if (ret.$resolved) {
                    mainObservable = Observable.create(function (observer) {
                        observer.next(null);
                    });
                    releaseMainDeferredSubscriber();
                }
                var url = dataAll[0] + dataAll[1];
                var headers = new Headers(dataAll[2]);
                var defPathParams = dataAll[3];
                var data = args.length ? args[0] : null;
                var callback = args.length > 1 ? args[1] : null;
                if (typeof data === 'function') {
                    if (!callback) {
                        callback = data;
                        data = null;
                    }
                    else if (typeof callback !== 'function') {
                        var tmpData = callback;
                        callback = data;
                        data = tmpData;
                    }
                    else {
                        data = null;
                    }
                }
                data = Object.assign({}, dataAll[4], data);
                var pathParams = url.match(/{([^}]*)}/g) || [];
                var usedPathParams = {};
                var _loop_1 = function(i) {
                    var pathParam = pathParams[i];
                    var pathKey = pathParam.substr(1, pathParam.length - 2);
                    var isMandatory = pathKey[0] === '!';
                    if (isMandatory) {
                        pathKey = pathKey.substr(1);
                    }
                    var isGetOnly = pathKey[0] === ':';
                    if (isGetOnly) {
                        pathKey = pathKey.substr(1);
                    }
                    var value = getValueForPath(pathKey, defPathParams, data, usedPathParams);
                    if (isGetOnly) {
                        delete data[pathKey];
                    }
                    if (!value) {
                        if (isMandatory) {
                            var consoleMsg_1 = "Mandatory " + pathParam + " path parameter is missing";
                            mainObservable = Observable.create(function (observer) {
                                observer.error(new Error(consoleMsg_1));
                            });
                            console.warn(consoleMsg_1);
                            releaseMainDeferredSubscriber();
                            return { value: void 0 };
                        }
                        url = url.substr(0, url.indexOf(pathParam));
                        return "break";
                    }
                    // Replacing in the url
                    url = url.replace(pathParam, value);
                };
                for (var i = 0; i < pathParams.length; i++) {
                    var state_1 = _loop_1(i);
                    if (typeof state_1 === "object") return state_1.value;
                    if (state_1 === "break") break;
                }
                // Removing double slashed from final url
                url = url.replace(/\/\/+/g, '/');
                if (url.startsWith('http')) {
                    url = url.replace(':/', '://');
                }
                // Remove trailing slash
                if (typeof methodOptions.removeTrailingSlash === 'undefined') {
                    methodOptions.removeTrailingSlash = _this.removeTrailingSlash();
                }
                if (methodOptions.removeTrailingSlash) {
                    while (url[url.length - 1] === '/') {
                        url = url.substr(0, url.length - 1);
                    }
                }
                // Remove mapped params
                for (var key in defPathParams) {
                    if (defPathParams[key][0] === '@') {
                        delete defPathParams[key];
                    }
                }
                // Default search params or data
                var body = null;
                var searchParams;
                if (isGetRequest) {
                    // GET
                    searchParams = Object.assign({}, defPathParams, data);
                }
                else {
                    // NON GET
                    if (data) {
                        body = JSON.stringify(data);
                    }
                    searchParams = defPathParams;
                }
                // Setting search params
                var search = new URLSearchParams();
                for (var key in searchParams) {
                    if (!usedPathParams[key]) {
                        var value = searchParams[key];
                        if (typeof value === 'object') {
                            // if (value instanceof Object) {
                            value = JSON.stringify(value);
                        }
                        search.append(key, value);
                    }
                }
                // Adding TS if needed
                var tsName = methodOptions.addTimestamp || resourceOptions.addTimestamp;
                if (tsName) {
                    if (tsName === true) {
                        tsName = 'ts';
                    }
                    search.append(tsName, '' + new Date().getTime());
                }
                // Removing Content-Type header if no body
                if (!body) {
                    headers.delete('content-type');
                }
                // Creating request options
                var requestOptions = new RequestOptions({
                    method: methodOptions.method,
                    headers: headers,
                    body: body,
                    url: url,
                    search: search
                });
                // Creating request object
                var req = new Request(requestOptions);
                req = methodOptions.requestInterceptor ?
                    methodOptions.requestInterceptor(req) :
                    _this.requestInterceptor(req);
                if (!req) {
                    mainObservable = Observable.create(function (observer) {
                        observer.error(new Error('Request is null'));
                    });
                    console.warn('Request is null');
                    releaseMainDeferredSubscriber();
                    return;
                }
                // Doing the request
                var requestObservable = _this.http.request(req);
                // noinspection TypeScriptValidateTypes
                requestObservable = methodOptions.responseInterceptor ?
                    methodOptions.responseInterceptor(requestObservable, req) :
                    _this.responseInterceptor(requestObservable, req);
                if (methodOptions.isLazy) {
                    mainObservable = requestObservable;
                }
                else {
                    mainObservable = Observable.create(function (subscriber) {
                        var reqSubscr = requestObservable.subscribe(function (resp) {
                            if (resp !== null) {
                                var map = methodOptions.map ? methodOptions.map : _this.map;
                                var filter = methodOptions.filter ? methodOptions.filter : _this.filter;
                                if (methodOptions.isArray) {
                                    if (!Array.isArray(resp)) {
                                        console.error('Returned data should be an array. Received', resp);
                                    }
                                    else {
                                        var result = resp.filter(filter).map(map);
                                        result = !!resourceModel ? mapToModel.bind(_this)(result, resourceModel) : result;
                                        Array.prototype.push.apply(ret, result);
                                    }
                                }
                                else {
                                    if (Array.isArray(resp)) {
                                        console.error('Returned data should be an object. Received', resp);
                                    }
                                    else {
                                        if (filter(resp)) {
                                            if (!!resourceModel) {
                                                ret.$fillFromObject(map(resp));
                                            }
                                            else {
                                                Object.assign(ret, map(resp));
                                            }
                                        }
                                    }
                                }
                            }
                            subscriber.next(resp);
                        }, function (err) { return subscriber.error(err); }, function () {
                            ret.$resolved = true;
                            subscriber.complete();
                            if (callback) {
                                callback(ret);
                            }
                        });
                        ret.$abortRequest = function () {
                            if (ret.$resolved) {
                                return;
                            }
                            reqSubscr.unsubscribe();
                            ret.$resolved = true;
                        };
                    });
                }
                releaseMainDeferredSubscriber();
            });
            if (resourceModel) {
                ret.$observable = ret.$observable.map(function (resp) {
                    return mapToModel.bind(_this)(resp, resourceModel);
                });
            }
            return ret;
        };
    };
}
export function mapToModel(resp, model) {
    var modelProviders = Reflect.getMetadata('providers', model) || [];
    var providers = ReflectiveInjector.resolve(modelProviders);
    var injector = ReflectiveInjector.fromResolvedProviders(providers, this.injector);
    var properties = Reflect.getMetadata('design:paramtypes', model) || [];
    var injection = [];
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        injection.push(injector.get(property));
    }
    var result;
    if (Array.isArray(resp)) {
        result = [];
        for (var _a = 0, resp_1 = resp; _a < resp_1.length; _a++) {
            var item = resp_1[_a];
            var modelInstance = new (model.bind.apply(model, [void 0].concat(injection)))().$fillFromObject(item);
            modelInstance.$resource = this;
            result.push(modelInstance);
        }
    }
    else {
        result = new (model.bind.apply(model, [void 0].concat(injection)))().$fillFromObject(resp);
        result.$resource = this;
    }
    return result;
}
function getValueForPath(key, params, data, usedPathParams) {
    if (typeof data[key] !== 'object') {
        usedPathParams[key] = true;
        return data[key];
    }
    if (!params[key]) {
        return null;
    }
    if (params[key][0] === '@') {
        return getValueForPath(params[key].substr(1), params, data, usedPathParams);
    }
    usedPathParams[key] = true;
    return params[key];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNvdXJjZUFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLGFBQWEsRUFBWSxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUMsTUFBTSxlQUFlO09BQ2pHLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxlQUFlO09BT3pDLEVBQUMsVUFBVSxFQUFDLE1BQU0saUJBQWlCO0FBRTFDLCtCQUErQixhQUFrQztJQUUvRCxhQUFhLEdBQUcsYUFBYSxJQUFJLEVBQUUsQ0FBQztJQUVwQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsYUFBYSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQzNDLENBQUM7SUFHRCxNQUFNLENBQUMsVUFBVSxNQUFnQixFQUFFLFdBQW1CO1FBRTlDLE1BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRztZQUFBLGlCQWtUNUI7WUFsVHNDLGNBQWM7aUJBQWQsV0FBYyxDQUFkLHNCQUFjLENBQWQsSUFBYztnQkFBZCw2QkFBYzs7WUFFbkQsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFFakQsSUFBSSxZQUFZLEdBQUcsYUFBYSxDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDO1lBRTlELElBQUksR0FBd0MsQ0FBQztZQUU3QyxJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckUsRUFBRSxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEdBQUcsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4QyxD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LElBQVMsRUFBRSxjQUFtQjtJQUUvRSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDM0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSZXF1ZXN0TWV0aG9kLCBSZXNwb25zZSwgSGVhZGVycywgVVJMU2VhcmNoUGFyYW1zLCBSZXF1ZXN0T3B0aW9ucywgUmVxdWVzdH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQge1JlZmxlY3RpdmVJbmplY3Rvcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1R5cGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3R5cGUnO1xuaW1wb3J0IHtSZXNvdXJjZUFjdGlvbkJhc2UsIFJlc291cmNlUmVzdWx0LCBSZXNvdXJjZVJlc3BvbnNlTWFwLCBSZXNvdXJjZVJlc3BvbnNlRmlsdGVyfSBmcm9tICcuL0ludGVyZmFjZXMnO1xuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9SZXNvdXJjZSc7XG5pbXBvcnQge1Jlc291cmNlTW9kZWx9IGZyb20gJy4vUmVzb3VyY2VNb2RlbCc7XG5pbXBvcnQge0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQge1N1YnNjcmliZXIsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcy9TdWJzY3JpYmVyJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc291cmNlQWN0aW9uKG1ldGhvZE9wdGlvbnM/OiBSZXNvdXJjZUFjdGlvbkJhc2UpIHtcblxuICBtZXRob2RPcHRpb25zID0gbWV0aG9kT3B0aW9ucyB8fCB7fTtcblxuICBpZiAobWV0aG9kT3B0aW9ucy5tZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgIG1ldGhvZE9wdGlvbnMubWV0aG9kID0gUmVxdWVzdE1ldGhvZC5HZXQ7XG4gIH1cblxuXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBSZXNvdXJjZSwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXG4gICAgKDxhbnk+dGFyZ2V0KVtwcm9wZXJ0eUtleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pOiBSZXNvdXJjZVJlc3VsdDxhbnk+IHwgUmVzb3VyY2VNb2RlbCB7XG5cbiAgICAgIGxldCByZXNvdXJjZU9wdGlvbnMgPSB0aGlzLl9nZXRSZXNvdXJjZU9wdGlvbnMoKTtcblxuICAgICAgbGV0IGlzR2V0UmVxdWVzdCA9IG1ldGhvZE9wdGlvbnMubWV0aG9kID09PSBSZXF1ZXN0TWV0aG9kLkdldDtcblxuICAgICAgbGV0IHJldDogUmVzb3VyY2VSZXN1bHQ8YW55PiB8IFJlc291cmNlTW9kZWw7XG5cbiAgICAgIGxldCByZXNvdXJjZU1vZGVsID0gbWV0aG9kT3B0aW9ucy5tb2RlbCB8fCB0aGlzLmNvbnN0cnVjdG9yWydtb2RlbCddO1xuXG4gICAgICBpZiAocmVzb3VyY2VNb2RlbCAmJiAhbWV0aG9kT3B0aW9ucy5pc0FycmF5KSB7XG4gICAgICAgIHJldCA9IHJlc291cmNlTW9kZWwuY3JlYXRlKHt9LCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKG1ldGhvZE9wdGlvbnMuaXNMYXp5KSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0ID0gbWV0aG9kT3B0aW9ucy5pc0FycmF5ID8gW10gOiB7fTtcbiAgICAgIH1cblxuICAgICAgbGV0IG1haW5EZWZlcnJlZFN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55PiA9IG51bGw7XG4gICAgICBsZXQgbWFpbk9ic2VydmFibGU6IE9ic2VydmFibGU8UmVzcG9uc2U+ID0gbnVsbDtcblxuICAgICAgcmV0LiRyZXNvbHZlZCA9IGZhbHNlO1xuICAgICAgcmV0LiRvYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5jcmVhdGUoKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55PikgPT4ge1xuICAgICAgICBtYWluRGVmZXJyZWRTdWJzY3JpYmVyID0gc3Vic2NyaWJlcjtcbiAgICAgIH0pLmZsYXRNYXAoKCkgPT4gbWFpbk9ic2VydmFibGUpO1xuICAgICAgcmV0LiRhYm9ydFJlcXVlc3QgPSAoKSA9PiB7XG4gICAgICAgIHJldC4kcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gcmVsZWFzZU1haW5EZWZlcnJlZFN1YnNjcmliZXIoKSB7XG4gICAgICAgIG1haW5EZWZlcnJlZFN1YnNjcmliZXIubmV4dCgpO1xuICAgICAgICBtYWluRGVmZXJyZWRTdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIG1haW5EZWZlcnJlZFN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgfVxuXG5cbiAgICAgIGlmICghbWV0aG9kT3B0aW9ucy5pc0xhenkpIHtcbiAgICAgICAgcmV0LiRvYnNlcnZhYmxlID0gcmV0LiRvYnNlcnZhYmxlLnB1Ymxpc2goKTtcbiAgICAgICAgKDxDb25uZWN0YWJsZU9ic2VydmFibGU8YW55Pj5yZXQuJG9ic2VydmFibGUpLmNvbm5lY3QoKTtcbiAgICAgIH1cblxuICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kT3B0aW9ucy51cmwgfHwgdGhpcy5nZXRVcmwoKSksXG4gICAgICAgIFByb21pc2UucmVzb2x2ZShtZXRob2RPcHRpb25zLnBhdGggfHwgdGhpcy5nZXRQYXRoKCkpLFxuICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kT3B0aW9ucy5oZWFkZXJzIHx8IHRoaXMuZ2V0SGVhZGVycygpKSxcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKG1ldGhvZE9wdGlvbnMucGFyYW1zIHx8IHRoaXMuZ2V0UGFyYW1zKCkpLFxuICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kT3B0aW9ucy5kYXRhIHx8IHRoaXMuZ2V0RGF0YSgpKVxuICAgICAgXSlcbiAgICAgICAgICAudGhlbigoZGF0YUFsbDogYW55W10pID0+IHtcblxuICAgICAgICAgICAgaWYgKHJldC4kcmVzb2x2ZWQpIHtcbiAgICAgICAgICAgICAgbWFpbk9ic2VydmFibGUgPSBPYnNlcnZhYmxlLmNyZWF0ZSgob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQobnVsbCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHJlbGVhc2VNYWluRGVmZXJyZWRTdWJzY3JpYmVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IGRhdGFBbGxbMF0gKyBkYXRhQWxsWzFdO1xuICAgICAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhkYXRhQWxsWzJdKTtcbiAgICAgICAgICAgIGxldCBkZWZQYXRoUGFyYW1zID0gZGF0YUFsbFszXTtcblxuICAgICAgICAgICAgbGV0IGRhdGEgPSBhcmdzLmxlbmd0aCA/IGFyZ3NbMF0gOiBudWxsO1xuICAgICAgICAgICAgbGV0IGNhbGxiYWNrID0gYXJncy5sZW5ndGggPiAxID8gYXJnc1sxXSA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBudWxsO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxldCB0bXBEYXRhID0gY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0bXBEYXRhO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBudWxsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGFBbGxbNF0sIGRhdGEpO1xuXG4gICAgICAgICAgICBsZXQgcGF0aFBhcmFtcyA9IHVybC5tYXRjaCgveyhbXn1dKil9L2cpIHx8IFtdO1xuICAgICAgICAgICAgbGV0IHVzZWRQYXRoUGFyYW1zOiBhbnkgPSB7fTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoUGFyYW1zLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgbGV0IHBhdGhQYXJhbSA9IHBhdGhQYXJhbXNbaV07XG5cbiAgICAgICAgICAgICAgbGV0IHBhdGhLZXkgPSBwYXRoUGFyYW0uc3Vic3RyKDEsIHBhdGhQYXJhbS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgICAgbGV0IGlzTWFuZGF0b3J5ID0gcGF0aEtleVswXSA9PT0gJyEnO1xuICAgICAgICAgICAgICBpZiAoaXNNYW5kYXRvcnkpIHtcbiAgICAgICAgICAgICAgICBwYXRoS2V5ID0gcGF0aEtleS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgaXNHZXRPbmx5ID0gcGF0aEtleVswXSA9PT0gJzonO1xuICAgICAgICAgICAgICBpZiAoaXNHZXRPbmx5KSB7XG4gICAgICAgICAgICAgICAgcGF0aEtleSA9IHBhdGhLZXkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWVGb3JQYXRoKHBhdGhLZXksIGRlZlBhdGhQYXJhbXMsIGRhdGEsIHVzZWRQYXRoUGFyYW1zKTtcbiAgICAgICAgICAgICAgaWYgKGlzR2V0T25seSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhW3BhdGhLZXldO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc01hbmRhdG9yeSkge1xuXG4gICAgICAgICAgICAgICAgICBsZXQgY29uc29sZU1zZyA9IGBNYW5kYXRvcnkgJHtwYXRoUGFyYW19IHBhdGggcGFyYW1ldGVyIGlzIG1pc3NpbmdgO1xuXG4gICAgICAgICAgICAgICAgICBtYWluT2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKG5ldyBFcnJvcihjb25zb2xlTXNnKSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGNvbnNvbGVNc2cpO1xuXG4gICAgICAgICAgICAgICAgICByZWxlYXNlTWFpbkRlZmVycmVkU3Vic2NyaWJlcigpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YocGF0aFBhcmFtKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBSZXBsYWNpbmcgaW4gdGhlIHVybFxuICAgICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShwYXRoUGFyYW0sIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVtb3ZpbmcgZG91YmxlIHNsYXNoZWQgZnJvbSBmaW5hbCB1cmxcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXC9cXC8rL2csICcvJyk7XG4gICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xuICAgICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgnOi8nLCAnOi8vJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBzbGFzaFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRob2RPcHRpb25zLnJlbW92ZVRyYWlsaW5nU2xhc2ggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIG1ldGhvZE9wdGlvbnMucmVtb3ZlVHJhaWxpbmdTbGFzaCA9IHRoaXMucmVtb3ZlVHJhaWxpbmdTbGFzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1ldGhvZE9wdGlvbnMucmVtb3ZlVHJhaWxpbmdTbGFzaCkge1xuICAgICAgICAgICAgICB3aGlsZSAodXJsW3VybC5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBSZW1vdmUgbWFwcGVkIHBhcmFtc1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRlZlBhdGhQYXJhbXMpIHtcbiAgICAgICAgICAgICAgaWYgKGRlZlBhdGhQYXJhbXNba2V5XVswXSA9PT0gJ0AnKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRlZlBhdGhQYXJhbXNba2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIERlZmF1bHQgc2VhcmNoIHBhcmFtcyBvciBkYXRhXG4gICAgICAgICAgICBsZXQgYm9keTogc3RyaW5nID0gbnVsbDtcblxuICAgICAgICAgICAgbGV0IHNlYXJjaFBhcmFtczogYW55O1xuICAgICAgICAgICAgaWYgKGlzR2V0UmVxdWVzdCkge1xuICAgICAgICAgICAgICAvLyBHRVRcbiAgICAgICAgICAgICAgc2VhcmNoUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmUGF0aFBhcmFtcywgZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBOT04gR0VUXG4gICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlYXJjaFBhcmFtcyA9IGRlZlBhdGhQYXJhbXM7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gU2V0dGluZyBzZWFyY2ggcGFyYW1zXG4gICAgICAgICAgICBsZXQgc2VhcmNoOiBVUkxTZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gc2VhcmNoUGFyYW1zKSB7XG4gICAgICAgICAgICAgIGlmICghdXNlZFBhdGhQYXJhbXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTogYW55ID0gc2VhcmNoUGFyYW1zW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlYXJjaC5hcHBlbmQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkaW5nIFRTIGlmIG5lZWRlZFxuICAgICAgICAgICAgbGV0IHRzTmFtZSA9IG1ldGhvZE9wdGlvbnMuYWRkVGltZXN0YW1wIHx8IHJlc291cmNlT3B0aW9ucy5hZGRUaW1lc3RhbXA7XG4gICAgICAgICAgICBpZiAodHNOYW1lKSB7XG4gICAgICAgICAgICAgIGlmICh0c05hbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0c05hbWUgPSAndHMnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlYXJjaC5hcHBlbmQodHNOYW1lLCAnJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVtb3ZpbmcgQ29udGVudC1UeXBlIGhlYWRlciBpZiBubyBib2R5XG4gICAgICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgICAgaGVhZGVycy5kZWxldGUoJ2NvbnRlbnQtdHlwZScpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIENyZWF0aW5nIHJlcXVlc3Qgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IHJlcXVlc3RPcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtcbiAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2RPcHRpb25zLm1ldGhvZCxcbiAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgICAgYm9keTogYm9keSxcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgIHNlYXJjaDogc2VhcmNoXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRpbmcgcmVxdWVzdCBvYmplY3RcbiAgICAgICAgICAgIGxldCByZXEgPSBuZXcgUmVxdWVzdChyZXF1ZXN0T3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJlcSA9IG1ldGhvZE9wdGlvbnMucmVxdWVzdEludGVyY2VwdG9yID9cbiAgICAgICAgICAgICAgICBtZXRob2RPcHRpb25zLnJlcXVlc3RJbnRlcmNlcHRvcihyZXEpIDpcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RJbnRlcmNlcHRvcihyZXEpO1xuXG4gICAgICAgICAgICBpZiAoIXJlcSkge1xuICAgICAgICAgICAgICBtYWluT2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IobmV3IEVycm9yKCdSZXF1ZXN0IGlzIG51bGwnKSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVxdWVzdCBpcyBudWxsJyk7XG5cbiAgICAgICAgICAgICAgcmVsZWFzZU1haW5EZWZlcnJlZFN1YnNjcmliZXIoKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEb2luZyB0aGUgcmVxdWVzdFxuICAgICAgICAgICAgbGV0IHJlcXVlc3RPYnNlcnZhYmxlID0gdGhpcy5odHRwLnJlcXVlc3QocmVxKTtcblxuICAgICAgICAgICAgLy8gbm9pbnNwZWN0aW9uIFR5cGVTY3JpcHRWYWxpZGF0ZVR5cGVzXG4gICAgICAgICAgICByZXF1ZXN0T2JzZXJ2YWJsZSA9IG1ldGhvZE9wdGlvbnMucmVzcG9uc2VJbnRlcmNlcHRvciA/XG4gICAgICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5yZXNwb25zZUludGVyY2VwdG9yKHJlcXVlc3RPYnNlcnZhYmxlLCByZXEpIDpcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNlSW50ZXJjZXB0b3IocmVxdWVzdE9ic2VydmFibGUsIHJlcSk7XG5cblxuICAgICAgICAgICAgaWYgKG1ldGhvZE9wdGlvbnMuaXNMYXp5KSB7XG4gICAgICAgICAgICAgIG1haW5PYnNlcnZhYmxlID0gcmVxdWVzdE9ic2VydmFibGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIG1haW5PYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5jcmVhdGUoKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55PikgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHJlcVN1YnNjcjogU3Vic2NyaXB0aW9uID0gcmVxdWVzdE9ic2VydmFibGUuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICAocmVzcDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcCAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWFwOiBSZXNvdXJjZVJlc3BvbnNlTWFwID0gbWV0aG9kT3B0aW9ucy5tYXAgPyBtZXRob2RPcHRpb25zLm1hcCA6IHRoaXMubWFwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcjogUmVzb3VyY2VSZXNwb25zZUZpbHRlciA9IG1ldGhvZE9wdGlvbnMuZmlsdGVyID8gbWV0aG9kT3B0aW9ucy5maWx0ZXIgOiB0aGlzLmZpbHRlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZE9wdGlvbnMuaXNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocmVzcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZXR1cm5lZCBkYXRhIHNob3VsZCBiZSBhbiBhcnJheS4gUmVjZWl2ZWQnLCByZXNwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gcmVzcC5maWx0ZXIoZmlsdGVyKS5tYXAobWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAhIXJlc291cmNlTW9kZWwgPyBtYXBUb01vZGVsLmJpbmQodGhpcykocmVzdWx0LCByZXNvdXJjZU1vZGVsKSA6IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignUmV0dXJuZWQgZGF0YSBzaG91bGQgYmUgYW4gb2JqZWN0LiBSZWNlaXZlZCcsIHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXIocmVzcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIXJlc291cmNlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDxSZXNvdXJjZU1vZGVsPnJldCkuJGZpbGxGcm9tT2JqZWN0KG1hcChyZXNwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgbWFwKHJlc3ApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocmVzcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKGVycjogYW55KSA9PiBzdWJzY3JpYmVyLmVycm9yKGVyciksXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICByZXQuJHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXQpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXQuJGFib3J0UmVxdWVzdCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZXQuJHJlc29sdmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJlcVN1YnNjci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgcmV0LiRyZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZWxlYXNlTWFpbkRlZmVycmVkU3Vic2NyaWJlcigpO1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXNvdXJjZU1vZGVsKSB7XG4gICAgICAgIHJldC4kb2JzZXJ2YWJsZSA9IHJldC4kb2JzZXJ2YWJsZS5tYXAoKHJlc3A6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiBtYXBUb01vZGVsLmJpbmQodGhpcykocmVzcCwgcmVzb3VyY2VNb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0O1xuXG4gICAgfTtcblxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9Nb2RlbChyZXNwOiBhbnksIG1vZGVsOiBUeXBlPFJlc291cmNlTW9kZWw+KSB7XG4gIGxldCBtb2RlbFByb3ZpZGVycyA9ICg8YW55PlJlZmxlY3QpLmdldE1ldGFkYXRhKCdwcm92aWRlcnMnLCBtb2RlbCkgfHwgW107XG4gIGxldCBwcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShtb2RlbFByb3ZpZGVycyk7XG4gIGxldCBpbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocHJvdmlkZXJzLCB0aGlzLmluamVjdG9yKTtcbiAgbGV0IHByb3BlcnRpZXMgPSAoPGFueT5SZWZsZWN0KS5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCBtb2RlbCkgfHwgW107XG4gIGxldCBpbmplY3Rpb246IGFueVtdID0gW107XG4gIGZvciAobGV0IHByb3BlcnR5IG9mIHByb3BlcnRpZXMpIHtcbiAgICBpbmplY3Rpb24ucHVzaChpbmplY3Rvci5nZXQocHJvcGVydHkpKTtcbiAgfVxuXG4gIGxldCByZXN1bHQ6IGFueTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShyZXNwKSkge1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzcCkge1xuICAgICAgbGV0IG1vZGVsSW5zdGFuY2UgPSBuZXcgbW9kZWwoLi4uaW5qZWN0aW9uKS4kZmlsbEZyb21PYmplY3QoaXRlbSk7XG4gICAgICBtb2RlbEluc3RhbmNlLiRyZXNvdXJjZSA9IHRoaXM7XG4gICAgICByZXN1bHQucHVzaChtb2RlbEluc3RhbmNlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gbmV3IG1vZGVsKC4uLmluamVjdGlvbikuJGZpbGxGcm9tT2JqZWN0KHJlc3ApO1xuICAgIHJlc3VsdC4kcmVzb3VyY2UgPSB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVGb3JQYXRoKGtleTogc3RyaW5nLCBwYXJhbXM6IGFueSwgZGF0YTogYW55LCB1c2VkUGF0aFBhcmFtczogYW55KTogc3RyaW5nIHtcblxuICBpZiAodHlwZW9mIGRhdGFba2V5XSAhPT0gJ29iamVjdCcpIHtcbiAgICB1c2VkUGF0aFBhcmFtc1trZXldID0gdHJ1ZTtcbiAgICByZXR1cm4gZGF0YVtrZXldO1xuICB9XG5cbiAgaWYgKCFwYXJhbXNba2V5XSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHBhcmFtc1trZXldWzBdID09PSAnQCcpIHtcbiAgICByZXR1cm4gZ2V0VmFsdWVGb3JQYXRoKHBhcmFtc1trZXldLnN1YnN0cigxKSwgcGFyYW1zLCBkYXRhLCB1c2VkUGF0aFBhcmFtcyk7XG4gIH1cblxuICB1c2VkUGF0aFBhcmFtc1trZXldID0gdHJ1ZTtcbiAgcmV0dXJuIHBhcmFtc1trZXldO1xuXG59XG4iXX0=