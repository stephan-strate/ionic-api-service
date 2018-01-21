// general imports
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { ToastController, Events, Toast } from "ionic-angular";
import { Storage } from "@ionic/storage";

// rxjs imports
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/map";

/**
 * Set of api request modes, that have a slightly
 * different behaviour. They are optional for every
 * ApiProvider request. Default mode is DIRECT.
 */
export enum ApiMode {

    /**
     * Default Mode. Requests that fail and are
     * still cached will be fetched from cache.
     * Successful requests will be shipped. Error
     * message will be shown, when request fails.
     */
    DIRECT,

    /**
     * Requests that are cached will be shipped
     * instantly. When data is out of lifetime, new data will
     * be fetched from endpoint and stored in cached.
     * When request fails, no error message will be shown.
     * When no data is cached for this request,
     * a default DIRECT request will be executed.
     */
    BACKGROUND,

    /**
     * Requests that are cached will be shipped
     * instantly. When data is out of lifetime, new data will
     * be fetched from endpoint and shipped too.
     * When request fails, no error message will be shown.
     * When no data is cached for this request,
     * a default DIRECT request will be executed.
     */
    FAST
}

/**
 *
 */
export enum ApiType {

    /**
     *
     */
    LIVE,

    /**
     *
     */
    CACHE
}

/**
 *
 */
export class ApiResult {

    /**
     *
     */
    private response: string;

    /**
     *
     */
    private type: ApiType;

    /**
     *
     */
    private date: Date;

    /**
     *
     */
    private update: Promise<object>;

    /**
     *
     */
    constructor () {

    }
}

/**
 *
 */
export class ApiEndpoint {

    /**
     *
     */
	private url: string;

    /**
     *
     */
    private lifetime: number;

    /**
     *
     * @param {string} url
     * @param {number} lifetime
     */
    constructor (url: string, lifetime: number) {
        this.url = url;
        this.lifetime = lifetime;
    }

    /**
     *
     * @param {object} data
     * @param {string} opt
     * @returns {string}
     */
    public unwrap (data: object, opt: string = "") : string {
        return data[this.url + opt];
    }

    /**
     *
     * @returns {string}
     */
    public getUrl () : string {
        return this.url;
    }

    /**
     *
     * @returns {number}
     */
    public getLifetime () : number {
        return this.lifetime;
    }

    /**
     *
     * @param {number} lifetime
     */
    public setLifetime (lifetime: number) : void {
        this.lifetime = lifetime;
    }

    /**
     *
     * @param {string} url
     * @param {number} lifetime
     * @returns {ApiEndpoint}
     */
    public static endpoint (url: string, lifetime?: number) : ApiEndpoint {
        if (!lifetime) lifetime = 24;
        return new ApiEndpoint(url, lifetime);
    }
}

/**
 *
 */
@Injectable()
export class ApiProvider {

    /**
     *
     */
	private error: any;

    /**
     *
     * @type {boolean}
     */
	private errorInstance: boolean = false;

    /**
     *
     * @type {string}
     */
	private message: string = "Check your internet connection.";

    /**
     *
     * @type {string}
     */
	private button: string = "Reload";

    /**
     *
     * @type {number}
     */
	private duration: number = 3000;

    /**
     *
     * @type {number}
     */
	private repeat: number = 3;

    /**
     *
     * @type {number}
     */
	private delay: number = 1000;

    /**
     *
     * @type {boolean}
     */
	private cache: boolean = true;

    /**
     *
     * @type {boolean}
     */
	private debug: boolean = false;

	/**
	 * Enables debug mode. Debug mode does not need to be
	 * disabled, it is disabled by default.
	 * @return {boolean}	whether debug got enabled or not
	 */
	public enableDebug () : boolean {
		 if (!this.debug) {
			 console.info("Api Service: Debug mode enabled.");
			 return this.debug = true;
		 } else {
			 console.warn("Api Service: Debug mode can not be enabled multiple times.");
			 return false;
		 }
	}

	/**
	 * Enables cache. Cache does not need to be enabled,
	 * it is enabled by default.
	 * @return {boolean}	whether cache could be enabled or not
	 */
	public enableCache () : boolean {
		if (this.cache) {
			return false;
		} else {
			this.cache = true;
			return true;
		}
	}

	/**
	 * Disables cache. Cache is enabled by default.
	 * @return {boolean}	whether cache could be disabled or not
	 */
	public disableCache () : boolean {
		if (this.cache) {
			this.cache = false;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the set cache status.
	 * @return {boolean}	cache status
	 */
	public checkCache () : boolean {
		return this.cache;
	}

	/**
	 * You can customize your error message by passing
	 * a message to this function.
	 * @param message {string}	message that is diplayed if request fails
	 * @return {boolean}	status, if the change worked
	 */
	public setMessage (message: string) : boolean {
		if (this.debug) {
			if (this.error) {
				console.warn("Api Service: You can not change the toast, while its active.");
			} else {
				console.info("Api Service: Custom error message set.");
			}
		}

		if (!this.error) {
			this.message = message;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the set error message.
	 * @return {string}	the error message thats valid in this moment
	 */
	public getMessage () : string {
		return this.message;
	}

	/**
	 * You can customize your button text by passing
	 * a message to this function.
	 * @param button {string}	message that is displayed to reload
	 * @return {boolean}	status, if the change worked
	 */
	public setButton (button: string) : boolean {
		if (this.debug) {
			if (this.error) {
				console.warn("Api Service: You can not change the toast, while its active.");
			} else {
				console.info("Api Service: Custom button text set.");
			}
		}

		if (!this.error) {
			this.button = button;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the set button text.
	 * @return {string}	the button text thats valid in this moment
	 */
	public getButton () : string {
		return this.button;
	}

	/**
	 * You can customize the duration the error message is displayed
	 * by passing a value in ms to this function.
	 * @param duration {number}
	 * @return void
	 */
	public setDuration (duration: number) : boolean {
		if (this.debug) {
			if (this.error) {
				console.warn("Api Service: You can not change the toast, while its active.");
			} else {
				console.info("Api Service: Custom duration set.");
			}
		}

		if (!this.error) {
			this.duration = duration;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the set duration.
	 * @return {number}	the duration thats valid in this moment
	 */
	public getDuration () : number {
		return this.duration;
	}

	/**
	 * You can customize the times a request gets repeated before
	 * its being rejected by passing a value to this function.
	 * @param repeat 
	 * @return {boolean}	feedback if repeat is set
	 */
	public setRepeat (repeat: number) : boolean {
		if (this.debug) {
			console.info("Api Service: Custom repeat set.");
		}

		this.repeat = repeat;
		return true;
	}

	/**
	 * Returns the set repeat.
	 * @return {number}
	 */
	public getRepeat () : number {
		return this.repeat;
	}

	/**
	 * You can customize the delay between the requests by passing
	 * a value in ms to this function.
	 * @param delay 
	 * @return {boolean}	feedback if delay is set
	 */
	public setDelay (delay: number) : boolean {
		if (this.debug) {
			console.info("Api Service: Custom delay set.");
		}

		this.delay = delay;
		return true;
	}

	/**
	 * Returns the set delay.
	 * @return {number}
	 */
	public getDelay () : number {
		return this.delay;
	}

	constructor (private http: Http, private storage: Storage, private toastCtrl: ToastController, private events: Events) {
		if (this.debug) {
			console.debug("ApiService initialized.");
		}
	}

    /**
     *
     * @param {ApiEndpoint | ApiEndpoint[]} api
     * @param {string | string[]} opt
     * @param {ApiMode} mode
     * @returns {Promise<object>}
     */
	public get (api: ApiEndpoint | ApiEndpoint[], opt?: string | string[], mode?: ApiMode) : Promise<object> {
		// mapping all parameters to a readable format
		let requests;
		let opts;

		if (!ApiProvider.isArray(api)) {
			if (this.debug) {
				console.info("Api Service: Single request initialized.");
			}

			// building array of api request
			requests = [].concat(api);
		} else {
			if (this.debug) {
				console.info("Api Service: Multiple request initialized.");
			}

			requests = api;
		}

		// mapping parameters to array
		if (!ApiProvider.isArray(opt)) {
			opts = [].concat(opt);
		} else {
			opts = opt;
		}

		return new Promise((resolve, reject) => {
			// start all api requests
			this.multiplePromise(requests, opts).subscribe(result => {
				// map result for return
				let values = [];
				for (let i = 0; i < requests.length; i++) {
					let temp = opts[i] ? opts[i] : '';
					values[requests[i].getUrl() + temp] = result[i];
				}

				resolve(values);
			}, error => {
				// one or more requests failed somewhere
				reject(error);
			});
		});
	}

	/**
	 * You can test an object if it is an array or not.
	 * @param test {object | object[]}	array or object to test
	 * @return {boolean}	whether the object is an array or not
	 */
	private static isArray (test: any | any[]) : boolean {
		// most common strategy to check if it's an array or not
		return Object.prototype.toString.call(test) === '[object Array]';
	}

	/**
	 * Forking all requests together and make them subscribable.
	 * @param requests {ApiEndpoint[]}	api objects @see API
	 * @param opt {string | string[]}	optional parameters to endpoints
	 * @return {Observable<string[]>}	all requests together
	 */
	private multiplePromise (requests: ApiEndpoint[], opt: string | string[] = []) : Observable<string[]> {
		let result: Promise<string>[] = [];

		// creating array of all requests
		for (let i = 0; i < requests.length; i++) {
			result.push(this.request(this.concatUrl(requests[i], opt[i]), requests[i].getLifetime()));
		}

		if (this.debug) {
			console.info("Api Service: Forked " + requests.length + " requests together. Waiting for result.");
		}

		// fork all requests together and make them subscribable
		return Observable.forkJoin(result);
	}

	/**
	 * Building url based on url, endpoint, api key and
	 * optional parameters.
	 * @param api {object}	api object @see API
	 * @param opt {string}	optional parameter to endpoint
	 * @return {string}		request ready url
	 */
	private concatUrl (api: ApiEndpoint, opt: string = "") : string {
		if (this.debug) {
			console.info("Api Service: Called url " + api.getUrl() + opt);
		}

		return api.getUrl() + opt;
	}

	/**
	 * Requesting a single url, checking for cached results
	 * and handle errors.
	 * @param url {string}			url to request
	 * @param lifetime {number}		lifetime in hours
	 * @param number {number}		internal number (do not touch)
	 * @return {Promise<string>}	Promise of http request
	 */
	private request (url: string, lifetime: number, number: number = 0) : Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.debug) {
				console.info("Api Service: Starting request " + url + ".");
			}

			this.getCache(url).then(value => {
				if (value == null || (new Date().getTime() - new Date(value.timestamp).getTime()) > (lifetime * 3600000)) {
					if (this.debug) {
						console.info("Api Service: No cached values for " +  url + " found.");
					}

					this.http.get(url).map(ApiProvider.extract).subscribe(result => {
						if (this.debug) {
							console.info("Api Service: Request " + url + " successful.");
						}
		
						// case 1: normal request
						this.cacheItems(result, url);
						resolve(result);
					}, error => {
						// case 2: problems with request
						if (this.debug) {
							console.warn("Api Service: Request " + url + " failed.");
						}
		
						if (number < (this.repeat - 1)) {
							setTimeout(() => {
								this.request(url, lifetime, (number + 1)).then(result => {
									// request was successful after another try
									this.cacheItems(result, url);
									resolve(result);
								}).catch(error => {
									// request still not successful
									reject(error);
								});
							}, this.delay);
						} else {
							// all requests did fail
							if (!this.errorInstance) {
								this.errorInstance = true;
								this.error = this.errorMessage();
		
								this.error.onDidDismiss((data, role) => {
									this.events.publish("error:dismiss", data, role);
			
									// deleting error message again
									this.errorInstance = false;
								});
		
								this.error.present();
							}
		
							this.events.subscribe("error:dismiss", (data, role) => {
								if (role == "close") {
									this.request(url, lifetime).then(result => {
										this.cacheItems(result, url);
										resolve(result);
									}).catch(error => {
										reject(error);
									});
								} else {
									reject(error);
								}
		
								this.events.unsubscribe("error:dismiss");
							});
						}
					});
				} else {
					if (this.debug) {
						console.info("Api Service: Cached values for " + url + " found.");
					}

					try {
						// trying to map result to json
						resolve(JSON.parse(value.value));
					} catch (error) {
						// fallback mapping to source
						resolve(value.value);
					}
				}
			});
		});
	}

	/**
	 * Extracting the result out of the response.
	 * It is whether json or source.
	 * @param res
	 * @return {string}	result, whether json or source
	 */
	private static extract (res: Response) : string {
		try {
			// trying to map result to json
			return res.json();
		} catch (error) {
			// fallback mapping to source
			return res.text();
		}
	}

    /**
     * Returning the controller for error message
     * @returns {Toast} error message toast controller
     */
	private errorMessage () : Toast {
		return this.toastCtrl.create({
			message: this.message,
			duration: this.duration,
			position: "bottom",
			showCloseButton: true,
			closeButtonText: this.button,
			dismissOnPageChange: true
		});
	}

    /**
	 * Generates a hash string out of a raw string
     * input. It is used to store and access data
     * from remote requests.
     * @param {string} raw  raw string input to generate hash from
     * @returns {string}    generated hash string
     */
	private static hash (raw: string) : string {
		// declare variables
		let hash = 0, char;

		if (raw == null || raw.length == 0) {
			// catch empty string
			return hash.toString();
		} else {
			// generate hash for full string
            for (let i = 0; i < raw.length; i++) {
                char = raw.charCodeAt(i); // get current char
                hash = ((hash << 5) - hash) + char; // extend hash value
                hash = hash & hash; // convert to 32bit integer
            }
		}

		// parse hash number to string
		return hash.toString();
	}

	/**
	 * Cache result to hashed url.
	 * @param result {string}	result to cache
	 * @param url {string}		url to cache to
	 * @return none
	 */
	private cacheItems (result: string, url: string) : Promise<any> {
		// only use storage when cache is enabled
		if (this.cache) {
			return this.storage.set(ApiProvider.hash(url), { value: JSON.stringify(result), timestamp: new Date() });
		}
	}

	/**
	 * Synchronize the storage request.
	 * @param url {string}	url to request from storage
	 * @return {Promise}	storage element of url
	 */
	private async getCache (url: string) : Promise<any> {
		if (this.cache) {
			// requesting storage when activated
			return await this.storage.get(ApiProvider.hash(url));
		} else {
			// returning null promise when cache is disabled
			return await new Promise((resolve) => {
				resolve(null);
			});
		}
	}
}