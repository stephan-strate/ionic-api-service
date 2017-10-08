import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { ToastController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

export const API_CONFIG = {
	url: 'http://jsonplaceholder.typicode.com',
	api_key: ''
}

export const API = {
	POSTS: { endpoint: '/posts', lifetime: 1 },
	USERS: { endpoint: '/users', lifetime: 24 },
	COMMENTS: { endpoint: '/comments', lifetime: 48 }
}

@Injectable()
export class ApiProvider {

	private error: any;
	private errorInstance: boolean = false;

	private message: string = 'Bitte Internetverbindung überprüfen';
	private button: string = 'Neu laden';
	private duration: number = 3000;

	private repeat: number = 3;
	private delay: number = 1000;

	private cache: boolean = true;
	private debug: boolean = false;

	/**
	 * Enables debug mode. Debug mode does not need to be
	 * disabled, it is disabled by default.
	 * @return {boolean}	whether debug got enabled or not
	 */
	public enableDebug () : boolean {
		 if (!this.debug) {
			 console.info('Api Service: Debug mode enabled.');
			 return this.debug = true;
		 } else {
			 console.warn('Api Service: Debug mode can not be enabled multiple times.');
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
				console.warn('Api Service: You can not change the toast, while its active.');
			} else {
				console.info('Api Service: Custom error message set.');
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
				console.warn('Api Service: You can not change the toast, while its active.');
			} else {
				console.info('Api Service: Custom button text set.');
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
				console.warn('Api Service: You can not change the toast, while its active.');
			} else {
				console.info('Api Service: Custom duration set.');
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
			console.info('Api Service: Custom repeat set.');
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
			console.info('Api Service: Custom delay set.');
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

	constructor(private http: Http, private storage: Storage, private toastCtrl: ToastController, private events: Events) {
		if (this.debug) {
			console.debug('ApiService initialized.');
		}
	}

	/**
	 * 
	 * @param api {object | object Array}	api objects @see API
	 * @param opt {string | string[]}		optional parameters to endpoints 
	 * @return {Promise<object>}	Object that includes all results or error
	 */
	public get (api: { endpoint: string, lifetime: number } | { endpoint: string, lifetime: number }[], opt?: string | string[]) : Promise<object> {
		// mapping all parameters to a readable format
		var requests;
		var opts;

		if (!this.isArray(api)) {
			if (this.debug) {
				console.info('Api Service: Single request initialized.');
			}

			// building array of api request
			requests = [].concat(api);
		} else {
			if (this.debug) {
				console.info('Api Service: Multiple request initialized.');
			}

			requests = api;
		}

		// mapping parameters to array
		if (!this.isArray(opt)) {
			opts = [].concat(opt);
		} else {
			opts = opt;
		}

		return new Promise((resolve, reject) => {
			// start all api requests
			this.multiplePromise(requests, opts).subscribe(result => {
				// map result for return
				var values = new Array();
				for (var i = 0; i < requests.length; i++) {
					var temp = opts[i] ? opts[i] : '';
					values[requests[i].endpoint + temp] = result[i];
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
	 * @param test {any | any[]}	array or object to test
	 * @return {boolean}	whether the object is an array or not
	 */
	private isArray (test: any | any[]) : boolean {
		// most common strategy to check if it's an array or not
		return Object.prototype.toString.call(test) === '[object Array]';
	}

	/**
	 * Forking all requests together and make them subscribable.
	 * @param requests {object Array}	api objects @see API
	 * @param opt {string | string[]}	optional parameters to endpoints
	 * @return {Observable<string[]>}	all requests together
	 */
	private multiplePromise (requests: { endpoint: string, lifetime: number }[], opt: string | string[] = []) : Observable<string[]> {
		var result: Promise<string>[] = new Array();

		// creating array of all requests
		for (var i = 0; i < requests.length; i++) {
			result.push(this.request(this.concatUrl(requests[i], opt[i]), requests[i].lifetime));
		}

		if (this.debug) {
			console.info('Api Service: Forked ' + requests.length + ' requests together. Waiting for result.');
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
	private concatUrl (api: { endpoint: string, lifetime: number }, opt: string = '') : string {
		if (this.debug) {
			console.info('Api Service: Called url ' + API_CONFIG.url + api.endpoint + API_CONFIG.api_key + opt);
		}

		return API_CONFIG.url + api.endpoint + API_CONFIG.api_key + opt;
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
				console.info('Api Service: Starting request ' + url + '.');
			}

			this.getCache(url).then(value => {
				if (value == null || (new Date().getTime() - new Date(value.timestamp).getTime()) > (lifetime * 3600000)) {
					if (this.debug) {
						console.info('Api Service: No cached values for ' +  url + ' found.');
					}

					this.http.get(url).map(this.extract).subscribe(result => {
						if (this.debug) {
							console.info('Api Service: Request ' + url + ' successful.');
						}
		
						// case 1: normal request
						this.cacheItems(result, url);
						resolve(result);
					}, error => {
						// case 2: problems with request
						if (this.debug) {
							console.warn('Api Service: Request ' + url + ' failed.');
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
									this.events.publish('error:dismiss', data, role);
			
									// deleting error message again
									this.errorInstance = false;
								});
		
								this.error.present();
							}
		
							this.events.subscribe('error:dismiss', (data, role) => {
								if (role == 'close') {
									this.request(url, lifetime).then(result => {
										this.cacheItems(result, url);
										resolve(result);
									}).catch(error => {
										reject(error);
									});
								} else {
									reject(error);
								}
		
								this.events.unsubscribe('error:dismiss');
							});
						}
					});
				} else {
					if (this.debug) {
						console.info('Api Service: Cached values for ' + url + ' found.');
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
	private extract (res: Response) : string {
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
	 * @return {any}	error message toast controller
	 */
	private errorMessage () : any {
		return this.toastCtrl.create({
			message: this.message,
			duration: this.duration,
			position: 'bottom',
			showCloseButton: true,
			closeButtonText: this.button,
			dismissOnPageChange: true
		});
	}

	/**
	 * Function to hash a string. We need this to
	 * store results of api requests.
	 * @param raw {string}	string to hash
	 * @return {number}	hash code of parameter raw
	 */
	private hash (raw: string) : string {
		var hash = 0, i, chr, len;
		if (raw.length === 0) return '' + hash;
		for (i = 0, len = raw.length; i < len; i++) {
			chr = raw.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}

		return '' + hash;
	}

	/**
	 * Cache result to hashed url.
	 * @param result {string}	result to cache
	 * @param url {string}		url to cache to
	 * @return none
	 */
	private cacheItems (result: string, url: string) : void {
		// only use storage when cache is enabled
		if (this.cache) {
			this.storage.set(this.hash(url), { value: JSON.stringify(result), timestamp: new Date() });
		}
	}

	/**
	 * Synchronize the storage request.
	 * @param url {string}	url to request from storage
	 * @return {Promise}	storage element of url
	 */
	private async getCache (url: string) {
		if (this.cache) {
			// requesting storage when activated
			return await this.storage.get(this.hash(url));
		} else {
			// returning null promise when cache is disabled
			return await new Promise((resolve, reject) => {
				resolve(null);
			});
		}
	}
}